const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
      require: true,
      unique: true,
      validates: function (v) {
        /^\ d{11} /.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    profilePic:{
      type:String,
      default:"",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
