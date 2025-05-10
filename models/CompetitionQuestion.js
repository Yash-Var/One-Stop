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
    type: String, 
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
    questions: [questionSchema], 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompetitionQuestion', competitionQuestionSchema);
