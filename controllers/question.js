const question = require("../models/question");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Event = require("../models/Event");

const getAllquestions = async (req, res) => {
  const _id = req.params.event_id;
  const object_id = req.params.object_id;

  const event = await Event.findOne({ _id });

  if (!event) {
    throw new BadRequestError("Event not found");
  }
  const isUserRegistered = event.registrations.includes(object_id);

  if (!isUserRegistered) {
    throw new BadRequestError("User not registered");
  }
  const questions = await question.findOne({ EventId: _id }).sort("createdAt");
  console.log(questions.Questions.length);
  res.status(StatusCodes.OK).json({ questions });
};
const getquestion = async (req, res) => {
  const question = await question.findOne({
    _id: questionId,
  });
  if (!question) {
    throw new NotFoundError(`No question with id ${questionId}`);
  }
  res.status(StatusCodes.OK).json({ question });
};

const createquestion = async (req, res) => {
  console.log(req.body.EventId);
  const EventId = req.body.EventId;
  const createQuestion = await question.findOne({ EventId });

  console.log(createQuestion);

  if (!createQuestion) {
    throw new BadRequestError("Event not found");
  }
  console.log(req.body);
  createQuestion.Questions.push(req.body.Questions);
  console.log(createQuestion);
  await createQuestion.save();

  res.status(StatusCodes.CREATED).json({ createQuestion });
};

const updatequestion = async (req, res) => {
  const {
    body: { question, answer, category, subcategory, difficulty },
    user: { userId },
    params: { id: questionId },
  } = req;

  if (
    question === "" ||
    answer === "" ||
    category === "" ||
    subcategory === "" ||
    difficulty === ""
  ) {
    throw new BadRequestError(
      "question or answer or category or subcategory or difficulty must be provided"
    );
  }
  const questionToUpadate = await question.findByIdAndUpdate(
    { _id: questionId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!question) {
    throw new NotFoundError(`No question with id ${questionId}`);
  }
  res.status(StatusCodes.OK).json({ questionToUpadate });
};

module.exports = {
  getAllquestions,
  getquestion,
  createquestion,
  updatequestion,
};
