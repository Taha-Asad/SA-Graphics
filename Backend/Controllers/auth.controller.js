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

    // Hash password securely
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Password: " , hashedPassword)
    // Set profile picture or initials
    let profilePic = req.file ? req.file.path : null;
    if (!profilePic) {
      const initials = name
        .split(" ")
        .map(word => word[0].toUpperCase())
        .join(""); // Extract initials (e.g., "John Doe" → "JD")
      profilePic = `https://ui-avatars.com/api/?name=${initials}&background=random`;
    }

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNo,
      profilePic
    });

    await user.save(); // Save user to database

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
    console.error('Error in registerUser:', error.message); // Log errors for debugging
    next(error);
  }
};

// const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       throw createError(400, 'Email and password are required');
//     }

//     // Find user and explicitly select password field
//     const user = await User.findOne({ email }).select('+password');

//     if (!user) {
//       throw createError(401, 'User not found');
//     }

//     // Debug logging - very important
//     console.log('🔑 Input Password:', password);
//     console.log('🔑 Stored Hash:', user.password);
//     console.log('🔑 Password Match:', await bcrypt.compare(password, user.password));

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       throw createError(401, 'Incorrect password');
//     }

//     // Generate token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // Prepare user data without password
//     const userData = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       profilePic: user.profilePic
//     };

//     res.status(200).json({
//       status: 'success',
//       token,
//       user: userData  // Changed from data.user to user for consistency
//     });

//   } catch (error) {
//     console.error("🚨 Login Error:", error);
//     next(error);
//   }
// };

// const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Ensure both fields are provided
//     if (!email || !password) {
//       throw createError(400, 'Email and password are required');
//     }

//     // Find user in database and retrieve password explicitly
//     const user = await User.findOne({ email }).select('+password');

//     // Debugging logs
//     console.log("User Found:", user ? user.email : "No user found");

//     if (!user) {
//       throw createError(401, 'User not found');
//     }

//     // Debugging logs - Check password comparison
//     console.log("Entered Password:", password);
//     console.log("Stored Hash from DB:", user.password);

//     // Compare entered password with hashed password
//     const isMatch = await bcrypt.compare(password.trim(), user.password);

//     console.log("Password Match:", isMatch); // Debugging log

//     if (!isMatch) {
//       throw createError(401, 'Incorrect password');
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // Remove password before sending response
//     user.password = undefined;

//     res.status(200).json({
//       status: 'success',
//       token,
//       data: { user }
//     });

//   } catch (error) {
//     console.error("Login Error:", error.message);
//     next(error);
//   }
// };


// const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists and password is correct
//     const user = await User.findOne({ email }).select('+password');
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       throw createError(401, 'Incorrect email or password');
//     }

//     // Generate token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // Remove password from output
//     user.password = undefined;

//     res.status(200).json({
//       status: 'success',
//       token,
//       data: {
//         user
//       }
//     });

//   } catch (error) {
//     next(error);
//   }
// };
// const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       throw createError(400, 'Email and password are required');
//     }

//     const user = await User.findOne({ email }).select('+password');

//     console.log("🛠 User Found:", user ? user.email : "No user found");

//     if (!user) {
//       throw createError(401, 'User not found');
//     }

//     console.log("🛠 Entered Password:", password);
//     console.log("🛠 Stored Hashed Password:", user.password);

//     const isMatch = await bcrypt.compare(password.trim(), user.password);

//     console.log("🛠 Password Match:", isMatch); // Debugging log

//     if (!isMatch) {
//       throw createError(401, 'Incorrect password');
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     user.password = undefined;

//     res.status(200).json({
//       status: 'success',
//       token,
//       data: { user }
//     });

//   } catch (error) {
//     console.error("🚨 Login Error:", error.message);
//     next(error);
//   }
// };
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw createError(400, 'Email and password are required');
    }

    // 1. Find user with password field explicitly selected
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw createError(401, 'User not found');
    }

    // 2. Detailed debugging logs
    console.log('🔑 Input Password:', password);
    console.log('🔑 Stored Hash:', user.password);
    console.log('🔑 Password Length:', password.length);
    console.log('🔑 Hash Length:', user.password.length);

    // 3. Trim and compare passwords
    const trimmedPassword = password.trim();
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    console.log('🔑 Password Match Result:', isMatch);

    if (!isMatch) {
      // 4. Additional check for common issues
      const isOldHashMatch = await bcrypt.compare(password, user.password); // Without trim
      console.log('🔑 Untrimmed Password Match:', isOldHashMatch);
      
      throw createError(401, 'Incorrect password');
    }

    // 5. Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Prepare user data without sensitive fields
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic
    };

    res.status(200).json({
      status: 'success',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error("🚨 Detailed Login Error:", {
      message: error.message,
      inputEmail: req.body.email,
      errorStack: error.stack
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

    // Send email
    const resetURL = `${req.protocol}://${req.get('host')}/api/reset-password/${resetToken}`;
    const templatePath = path.join(__dirname, '../views/emails/passwordReset.ejs');
    const html = await ejs.renderFile(templatePath, { resetURL });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      html
    };

    await sendEmail(mailOptions);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
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