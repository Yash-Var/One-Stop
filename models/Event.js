const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: [true, "Please provide Event name"],
      maxlength: 25,
      minlength: 3,
    },
    start_date: {
      type: Date,
      required: [true, "Please provide start date"],
    },
    end_date: {
      type: Date,
      required: [true, "Please provide end date"],
    },
    maxRegistration: {
      type: Number,
      required: [true, "Please provide max registration"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
