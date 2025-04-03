const Contact = require('../models/contact.modal');
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

