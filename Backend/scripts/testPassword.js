const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const testPassword = async () => {
  try {
    await mongoose.connect("mongodb+srv://tahaasad709:SA-graphics@sa-graphics.8x1ek.mongodb.net/");
    console.log('Connected to MongoDB');

    // Find the admin user
    const admin = await User.findOne({ email: 'admin@gmail.com' }).select('+password');
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }

    console.log('Found admin user:', {
      email: admin.email,
      role: admin.role,
      hasPassword: !!admin.password,
      passwordLength: admin.password?.length
    });

    // Test password comparison
    const testPassword = 'admin123';
    const directCompare = await bcrypt.compare(testPassword, admin.password);
    const modelCompare = await admin.correctPassword(testPassword);

    console.log('Password test results:', {
      directCompare,
      modelCompare,
      testPassword,
      storedHash: admin.password
    });

    // Create a new hash for comparison
    const newHash = await bcrypt.hash(testPassword, 12);
    console.log('New hash for same password:', newHash);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testPassword(); 