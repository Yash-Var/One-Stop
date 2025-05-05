const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  marks: {
    type: String, // or use Number if marks should be numeric
    required: true,
  },
});

const competitionQuestionSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    questions: [questionSchema], // Embed an array of questions
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompetitionQuestion', competitionQuestionSchema);
