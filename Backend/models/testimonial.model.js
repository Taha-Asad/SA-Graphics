const mongoose = require("mongoose");
const testimonialSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref: "User" , require:true},
    text:{type:String , require:true},
    jobTitle:{type:String, default: ''},
    status:{type:String , enum:['pending' , 'approved' , 'rejected'] , default:'pending'},
    createdAt:{type:Date , default:Date.now}
})
module.exports = mongoose.model('Testimonial' , testimonialSchema)
