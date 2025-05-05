const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    EventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Please provide event id"],
    },
    Questions: {
      type: [
        {
          questionText: {
            type: String,
            required: [true, "Please provide question text"],
            maxlength: 100,
            minlength: 3,
          },
          answerOptions: {
            type: [
              {
                answerText: {
                  type: String,
                  required: [false, "Please provide answer text"],
                  maxlength: 100,
                  minlength: 3,
                },
                isCorrect: {
                  type: Boolean,
                  required: [false, "Please provide isCorrect value"],
                },
              },
            ],
            required: [false, "Please provide answer options"],
          },
          marks: {
            type: Number,
            required: [false, "Please provide marks for the question"],
            min: [1, "Marks must be at least 1"],
          },
        },
      ],
      required: [true, "Please provide question"],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
