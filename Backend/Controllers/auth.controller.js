const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const createError = require('http-errors');
const path = require('path');
const ejs = require('ejs');
const { sendEmail } = require('../config/nodemailer');

// Helper function to construct profile picture URL
const getProfilePicUrl = (profilePic) => {
  if (!profilePic) return null;
  if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
    return profilePic;
  }
  return `http://localhost:5000/uploads/${profilePic}`;
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phoneNo, address } = req.body;

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
      address, // Add address field
      profilePic,
      role: email === "admin@gmail.com" ? "admin" : "user"
    });

    console.log("🟢 Before Saving: User Object", {
      name: user.name,
      email: user.email,
      phoneNo: user.phoneNo,
      address: user.address,
      role: user.role
    });

    await user.save();

    const savedUser = await User.findById(user._id);
    console.log("🟢 After Saving: User from DB", {
      name: savedUser.name,
      email: savedUser.email,
      phoneNo: savedUser.phoneNo,
      address: savedUser.address,
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
    if (savedUser.profilePic) {
      savedUser.profilePic = getProfilePicUrl(savedUser.profilePic);
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
    if (user.profilePic) {
      user.profilePic = getProfilePicUrl(user.profilePic);
    }

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
        profilePic: user.profilePic
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

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user.id;

    // Find user and update
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, 'User not found');
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw createError(409, 'Email is already taken');
      }
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNo = phone || user.phoneNo;
    user.address = address || user.address;

    await user.save();

    // Remove sensitive data
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phoneNo,
          address: user.address,
          role: user.role,
          profilePic: user.profilePic
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw createError(400, 'Current password and new password are required');
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      throw createError(404, 'User not found');
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw createError(401, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Since we're using JWT, we don't need to do anything server-side
    // The client will remove the token
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'tahaasad709@gmail.com' });
    
    if (adminExists) {
      // Update existing admin with new details
      await User.findOneAndUpdate(
        { email: 'tahaasad709@gmail.com' },
        {
          phoneNo: '03259881310',
          address: 'House no 240 Block E-1 Wapda Town Lahore'
        },
        { new: true }
      );
      console.log('Admin user details updated');
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'Taha Asad',
      email: 'tahaasad709@gmail.com',
      password: 'TahaAsad@1234',
      role: 'admin',
      phoneNo: '03259881310',
      address: 'House no 240 Block E-1 Wapda Town Lahore'
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
  }
};

// Call createAdminUser when the server starts
createAdminUser();

module.exports = {
  registerUser,
  loginUser,
  updateProfilePic,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  logout
};