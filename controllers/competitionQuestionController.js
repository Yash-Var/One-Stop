// controllers/competitionQuestionController.js
const CompetitionQuestion = require('../models/CompetitionQuestion');
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

exports.createQuestion = async (req, res) => {
  console.log(req.body.eventId);
  const eventId = req.body.eventId;
  const createQuestion = await CompetitionQuestion.findOne({ eventId });

  console.log(createQuestion);

  if (!createQuestion) {
    throw new BadRequestError("Event not found");
  }
  console.log(req.body);
  createQuestion.questions.push(...req.body.questions);
  console.log(createQuestion);
  await createQuestion.save();

  res.status(StatusCodes.CREATED).json({ createQuestion });
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
