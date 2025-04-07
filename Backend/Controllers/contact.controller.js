const Contact = require('../models/contact.modal');
const NotificationService = require('../services/notification.service');
const createError = require('http-errors');


module.exports.createContact = async (req, res , next) => {
try{
    const { name , email , subject  , message} = req.body;
    if(!name || !email || !subject || !message) {
        throw createError(400, 'All fields are required');
    }
    const contact = await Contact.create({
        name,
        email,
        subject,
        message ,
    })
    await contact.save()
    res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        contact
    })
}catch(error){
    next(error);
    console.log(error);
    res.status(500).json({
        success: false,
        message: 'Error in creating contact',
        error: error.message
    })
}
}

module.exports.getAllContact = async (req, res , next) => {
    try{
        const contact =  await Contact.find();
        res.status(200).json({success:true , message: 'All contacts fetched successfully', data: contact})
    }catch(error){
        next(error);
        console.log(error);
        res.status(500).json({success:false , message: 'Error in fetching all contacts', error: error.message})
    }
}

// Delete contact
module.exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    
    await Contact.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Submit contact form
module.exports.submitContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    
    // Send notification
    await NotificationService.notifyContactForm(newContact);
    
    res.status(201).json({
      status: 'success',
      message: 'Contact form submitted successfully',
      data: newContact
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

