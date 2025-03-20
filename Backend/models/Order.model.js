const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  item: [{
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      require: true,
    },
    quantity:{
      type:Number,
      Default:1,
      require:true
    },
    price:{
      type:Number,
      require:true,
    }
  }],
  totalAmount:{
    type:Number,
    require:true,
  },
  shippingAddress:{
    street:{type:String , require:true},
    city:{type:String , require: true},
    province:{type:String , require:true},
    postalCode:{type:String , require:true}
  },
  paymentMethod:{type:String , require:true},
  paymentStatus:{type:String , enum:['pending' , 'completed' , 'failed'] , default: 'pending'},
  status:{type:String , enum: ['pending' , 'shipped' , 'delivered'] , default:'pending'},
  createdAt:{type:Date , default: Date.now}
});
module.exports = mongoose.model("Order" , orderSchema)