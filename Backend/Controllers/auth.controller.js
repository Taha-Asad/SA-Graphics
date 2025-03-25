const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model.js");
const path = require("path");
const transporter = require("../config/nodemailer.js");
const ejs = require("ejs");
const {
  forgotPasswordSchema,
  registarSchema,
  loginSchema,
  resetPasswordSchema,
} = require("../validations/userValidations.js");

const registerUser = async (req, res) => {
  const { error } = registarSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  const { name, email, password, phoneNo } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User Already exists" });
    let userByPhoneNo = await User.findOne({ phoneNo });
    if (userByPhoneNo)
      return res
        .status(400)
        .json({ success: false, message: "User Already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profilePic = req.file ? req.file.path : "";

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNo,
      profilePic,
    });

    // await user.save();

    const payLoad = { id: user.id };
    const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};
const updateProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Save new profile picture path
    if (req.file) {
      user.profilePic = req.file.path;
      await user.save();
    }

    res.json({ success: true, profilePic: user.profilePic });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "No user found!" });
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password!" });
    const payLoad = { id: user.id };
    const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 900000; // 15 min
    await user.save();
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/reset-password/${resetToken}`;
    const templatePath = path.join(
      __dirname,
      "../views/emails/passwordReset.ejs"
    );
    const html = await ejs.renderFile(templatePath, { resetUrl });
    const mailOption = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html,
    };
    await transporter.sendMail(mailOption);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  const { token } = req.params;
  const { password } = req.body;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired Token" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser , updateProfilePic , forgotPassword, resetPassword };




// Update Profile Picture


