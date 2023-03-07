const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    //Schema
    legalName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Feedback = new mongoose.model("Feedback", feedSchema);
module.exports = Feedback;
