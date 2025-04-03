const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const createError = require('http-errors');
const path = require('path');
const ejs = require('ejs');
const { sendEmail } = require('../config/nodemailer');


const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phoneNo } = req.body;

    if (!name || !email || !password || !phoneNo) {
      throw createError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
    if (existingUser) {
      throw createError(409, 'User already exists with this email or phone number');
    }

    let profilePic = '';
    if (req.file) {
      // Store only the filename, not the full path
      profilePic = req.file.filename;
    } else {
      const initials = name.split(" ").map(word => word[0].toUpperCase()).join("");
      profilePic = `https://ui-avatars.com/api/?name=${initials}&background=random`;
    }

    // Create user with explicit role assignment
    const user = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save middleware
      phoneNo,
      profilePic,
      role: email === "admin@gmail.com" ? "admin" : "user"
    });

    console.log("🟢 Before Saving: User Object", {
      name: user.name,
      email: user.email,
      phoneNo: user.phoneNo,
      role: user.role
    });

    await user.save();

    const savedUser = await User.findById(user._id);
    console.log("🟢 After Saving: User from DB", {
      name: savedUser.name,
      email: savedUser.email,
      phoneNo: savedUser.phoneNo,
      role: savedUser.role
    });

    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: "7d" }
    );

    // Remove sensitive data
    savedUser.password = undefined;

    // Construct the full profile pic URL for response
    if (savedUser.profilePic && !savedUser.profilePic.startsWith('http')) {
      savedUser.profilePic = `http://localhost:5000/uploads/${savedUser.profilePic}`;
    }

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      data: { user: savedUser }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    next(error);
  }
};







const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 Login attempt for:', email);
    
    if (!email || !password) {
      throw createError(400, 'Email and password are required');
    }

    // Find user and explicitly include the password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      throw createError(401, 'Invalid email or password');
    }

    // Direct password comparison using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔑 Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      throw createError(401, 'Invalid email or password');
    }

    // Generate token with user role
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role || 'user' // Ensure role is always set
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    // Remove sensitive data
    user.password = undefined;

    // Ensure user has a role
    if (!user.role) {
      user.role = 'user';
      await User.findByIdAndUpdate(user._id, { role: 'user' });
    }

    // Construct full profile pic URL
    const profilePic = user.profilePic.startsWith('http') 
      ? user.profilePic 
      : `http://localhost:5000/uploads/${user.profilePic}`;

    console.log('✅ Login successful:', {
      email: user.email,
      role: user.role,
      id: user._id
    });
    
    // Send response in the format the frontend expects
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};

const updateProfilePic = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw createError(404, 'User not found');

    if (req.file) {
      user.profilePic = req.file.path;
      await user.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw createError(404, 'User not found with this email');

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send email with backend URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const templatePath = path.join(__dirname, '../views/emails/passwordReset.ejs');
    const html = await ejs.renderFile(templatePath, { resetUrl });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      html
    };

    await sendEmail(mailOptions);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
      token: resetToken
    });

  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    // Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) throw createError(400, 'Token is invalid or has expired');

    // Update password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Log the user in
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'success',
      token
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfilePic,
  forgotPassword,
  resetPassword
};