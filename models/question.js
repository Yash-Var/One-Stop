const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Please provide question"],
      maxlength: 100,
      minlength: 3,
    },
    option1: {
      type: String,
      required: [true, "Please provide option1"],
      maxlength: 100,
      minlength: 3,
    },
    option2: {
      type: String,
      required: [true, "Please provide option2"],
      maxlength: 100,
      minlength: 3,
    },
    option3: {
      type: String,
      required: [true, "Please provide option3"],
      maxlength: 100,
      minlength: 3,
    },
    option4: {
      type: String,
      required: [true, "Please provide option4"],
      maxlength: 100,
      minlength: 3,
    },
    answer: {
      type: String,
      required: [true, "Please provide answer"],
      maxlength: 100,
      minlength: 3,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
