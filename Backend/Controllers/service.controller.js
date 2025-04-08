const Service = require("../models/service.model.js");
const { createError } = require("../utils/error.js");

const defaultServices = [
  { 
    name: "Printing Services", 
    description: "Professional printing services for all your needs", 
    price: 25000,
    category: "Printing",
    isActive: true 
  },
  { 
    name: "Design Services", 
    description: "Creative design solutions for your business", 
    price: 50000,
    category: "Design",
    isActive: true 
  },
  { 
    name: "Branding Services", 
    description: "Complete branding solutions to establish your identity", 
    price: 150000,
    category: "Branding",
    isActive: true 
  },
  { 
    name: "Signage Services", 
    description: "Custom signage creation for your business", 
    price: 75000,
    category: "Signage",
    isActive: true 
  },
  { 
    name: "Packaging Services", 
    description: "Custom packaging solutions for your products", 
    price: 35000,
    category: "Packaging",
    isActive: true 
  }
];

// Get all active services
const getServices = async (req, res, next) => {
  try {
    let services = await Service.find({ isActive: true });
    
    // If no services exist, create default ones
    if (services.length === 0) {
      console.log('No services found. Creating default services...');
      services = await Service.create(defaultServices);
      console.log('Default services created:', services);
    }
    
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching/creating services:", error);
    next(error);
  }
};

// Create a new service (admin only)
const createService = async (req, res, next) => {
  try {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error("Error creating service:", error);
    next(error);
  }
};

// Update a service (admin only)
const updateService = async (req, res, next) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedService) {
      return next(createError(404, "Service not found"));
    }
    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    next(error);
  }
};

// Delete a service (admin only)
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return next(createError(404, "Service not found"));
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    next(error);
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
}; 