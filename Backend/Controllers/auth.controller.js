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

    // Validate required fields
    if (!name || !email || !password || !phoneNo) {
      throw createError(400, 'All fields are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
    if (existingUser) {
      throw createError(409, 'User already exists with this email or phone number');
    }

    // Set profile picture or initials
    let profilePic = req.file ? req.file.path : null;
    if (!profilePic) {
      const initials = name
        .split(" ")
        .map(word => word[0].toUpperCase())
        .join(""); // Extract initials (e.g., "John Doe" → "JD")
      profilePic = `https://ui-avatars.com/api/?name=${initials}&background=random`;
    }

    // Create new user - password will be hashed by middleware
    const user = new User({
      name,
      email,
      password, // Plain password - will be hashed by middleware
      phoneNo,
      profilePic
    });

    await user.save(); // Save user to database
    console.log("Registration - User saved successfully");

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      data: { user }
    });
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);
    
    if (!email || !password) {
      throw createError(400, 'Email and password are required');
    }

    // Find user with password field explicitly selected
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      throw createError(401, 'User not found');
    }

    console.log('User found:', {
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      storedHash: user.password
    });

    // Use the model's correctPassword method
    const isMatch = await user.correctPassword(password);
    console.log('Password comparison:', {
      inputPassword: password,
      isMatch: isMatch,
      passwordLength: password.length
    });
    
    if (!isMatch) {
      console.log('Login failed: Incorrect password for user:', email);
      throw createError(401, 'Incorrect password');
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare user data without sensitive fields
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic
    };

    console.log('Login successful for user:', email);
    res.status(200).json({
      status: 'success',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error("Login Error Details:", {
      message: error.message,
      email: req.body.email,
      stack: error.stack
    });
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