// controllers/competitionQuestionController.js
const CompetitionQuestion = require('../models/CompetitionQuestion');

exports.createQuestion = async (req, res) => {
  try {
    console.log(req.body)
    const question = await CompetitionQuestion.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getQuestionsByEvent = async (req, res) => {
  try {
    const questions = await CompetitionQuestion.find({ eventId: req.params.eventId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await CompetitionQuestion.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await CompetitionQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
