const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: [true, "Please provide Event name"],
      maxlength: 25,
      minlength: 3,
      unique: true,
    },
    event_description: {
      type: String,
      required: [true, "Please provide description"],
      maxlength: 100,
      minlength: 3,
    },
    event_url: {
      type: String,
      required: [true, "Please provide Event URL"],
      maxlength: 250,
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
    key: {
      type: String,  // Can be 'quiz' or 'competition'
      required: false,
      enum: ['quiz', 'competition'],
    },
    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);

// const User_log = await User.findOne({ _id: Object_id });
// const event = await Event.findOne({ _id: Event_Object_id });

// if (!User_log) {
//   throw new UnauthenticatedError("Invalid User");
// }

// if (!event) {
//   throw new BadRequestError("Invalid Event");
// }

// event.registration = User_log;
// await event.save();
