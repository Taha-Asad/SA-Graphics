const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    await mongoose.connect("mongodb+srv://tahaasad709:SA-graphics@sa-graphics.8x1ek.mongodb.net/");
    console.log('Connected to MongoDB');

    // First, try to find and remove existing admin
    await User.findOneAndDelete({ email: 'admin@gmail.com' });
    console.log('Removed existing admin if any');

    // Create new admin user with a simpler password
    const password = '123456';
    
    const admin = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: password, // Don't hash here, let the model middleware do it
      phoneNo: '03259881310',
      role: 'admin',
      profilePic: 'https://ui-avatars.com/api/?name=AD&background=random'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Admin credentials:');
    console.log('Email: admin@gmail.com');
    console.log('Password:', password);

    // Verify the password
    const savedAdmin = await User.findOne({ email: 'admin@gmail.com' }).select('+password');
    const isMatch = await savedAdmin.correctPassword(password);
    console.log('Password verification:', isMatch);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin(); 