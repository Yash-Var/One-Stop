const question = require("../models/question");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllquestions = async (req, res) => {
  const questions = await question.find().sort("createdAt");
  res.status(StatusCodes.OK).json({ questions, count: questions.length });
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
  req.body.createdBy = req.user.userId;
  const createQuestion = await question.create(req.body);
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
