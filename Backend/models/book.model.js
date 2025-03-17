const mongoose = require("mongoose");
const reviewsSchema = require("./reviews.model.js");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        image:{
            type: String,
            required: true,
        },
        price:{
            type:Number,
            required:true,
        },
        averageRating:{
            type:Number,
            required:true,
            default: 0,
        },
        reviews:[reviewsSchema],
        countInStock:{
            type:Number,
            required:true,
        },
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Book" , bookSchema)