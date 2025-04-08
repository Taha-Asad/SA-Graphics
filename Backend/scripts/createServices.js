require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/service.model.js');

const services = [
  { 
    name: "Printing Services", 
    description: "Professional printing services for all your needs", 
    price: 100,
    category: "Printing",
    isActive: true 
  },
  { 
    name: "Design Services", 
    description: "Creative design solutions for your business", 
    price: 150,
    category: "Design",
    isActive: true 
  },
  { 
    name: "Branding Services", 
    description: "Complete branding solutions to establish your identity", 
    price: 200,
    category: "Branding",
    isActive: true 
  },
  { 
    name: "Signage Services", 
    description: "Custom signage creation for your business", 
    price: 250,
    category: "Signage",
    isActive: true 
  },
  { 
    name: "Packaging Services", 
    description: "Custom packaging solutions for your products", 
    price: 180,
    category: "Packaging",
    isActive: true 
  }
];

async function createServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sa-graphics');
    console.log('Connected to MongoDB');

    // Delete existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Create new services
    const createdServices = await Service.create(services);
    console.log('Created services:', createdServices);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createServices(); 