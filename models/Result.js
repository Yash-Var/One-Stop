const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Result = new mongoose.Schema({
  EventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "Please provide event id"],
  },
  Users: {
    type: [
      {
        UserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [false, "Please provide user id"],
        },
        Score: {
          type: Number,
          required: [false, "Please provide score"],
        },
      },
    ],
    required: [false, "Please provide user id and score"],
  },
});

module.exports = mongoose.model("Result", Result);
