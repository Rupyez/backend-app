const mongoose = require("mongoose");
const validator = require("validator");

const registerFormSchema = new mongoose.Schema(
  {
    // schema
    legalName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    academicLevel: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: Number,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RegisterForm = new mongoose.model("RegisterForm", registerFormSchema);
module.exports = RegisterForm;
