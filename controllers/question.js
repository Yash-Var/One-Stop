const question = require("../models/question");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Event = require("../models/Event");
const result = require("../models/Result");

const getAllquestions = async (req, res) => {
  const _id = req.params.event_id;
  const object_id = req.params.object_id;

  const Result = await result.findOne({ EventId: _id });

  const isResultSubmitted = Result.Users.some(
    (user) => user.UserId == object_id
  );

  if (isResultSubmitted) {
    throw new BadRequestError("already submitted");
  }
  const event = await Event.findOne({ _id });

  if (!event) {
    throw new BadRequestError("Event not found");
  }
  const isUserRegistered = event.registrations.includes(object_id);

  if (!isUserRegistered) {
    throw new BadRequestError("User not registered");
  }
  const questions = await question.findOne({ EventId: _id }).sort("createdAt");

  res.status(StatusCodes.OK).json({ questions });
};
const getquestions = async (req, res) => {
  const { event_id } = req.params;
  console.log(event_id)

  const event = await Event.findById(event_id);
  console.log(event)

  if (!event) {
    throw new NotFoundError(`No event found with id ${event_id}`);
  }

  const questions = await question.find({ EventId: event_id });

  res.status(StatusCodes.OK).json({ questions });
};
const deletequestion = async (req, res) => {
  const { id: questionId } = req.params;

  // Use findOneAndUpdate to pull the question by ID from the array
  const updatedDoc = await question.findOneAndUpdate(
    { "Questions._id": questionId },
    { $pull: { Questions: { _id: questionId } } },
    { new: true } // return the updated document
  );

  if (!updatedDoc) {
    throw new NotFoundError(`No question found with id ${questionId}`);
  }

  res.status(StatusCodes.OK).json({
    msg: `Question with id ${questionId} deleted successfully.`,
    questions: [updatedDoc],
  });
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
  createQuestion.Questions.push(...req.body.Questions);
  console.log(createQuestion);
  await createQuestion.save();

  res.status(StatusCodes.CREATED).json({ createQuestion });
};

const updatequestion = async (req, res) => {
  const {
    body: { questionText, marks, answerOptions },
    params: { id: questionId },
  } = req;


    console.log(questionId)
  // Validate required fields
  if (
    !questionText ||
    !marks ||
    !Array.isArray(answerOptions) ||
    answerOptions.length === 0
  ) {
    throw new BadRequestError("questionText, marks, and answerOptions are required");
  }

  // Validate marks between 1 and 10
  if (marks < 1 || marks > 10) {
    throw new BadRequestError("Marks should be between 1 and 10");
  }

  // Validate each answerOption
  for (const option of answerOptions) {
    if (!option.answerText || typeof option.isCorrect !== "boolean") {
      throw new BadRequestError("Each answerOption must have answerText and isCorrect (boolean)");
    }
  }
  console.log("kushagra")
  // Update question
  const updatedQuestion = await question.updateOne(
    { "Questions._id": questionId },
    {
      $set: {
        "Questions.$.questionText": questionText,
        "Questions.$.marks": marks,
        "Questions.$.answerOptions": answerOptions,
      }
    }
  );
  

  console.log(updatedQuestion)
  updatedQuestion2= await question.find( {"Questions._id": questionId})

  if (!updatedQuestion) {
    throw new NotFoundError(`No question found with id ${questionId}`);
  }

  res.status(StatusCodes.OK).json({ question: updatedQuestion2 });
};


const checkquestion = async (req, res) => {
  const _id = req.params.event_id;
  const object_id = req.params.object_id;

  const Result = await result.findOne({ EventId: _id });

  const isResultSubmitted = Result.Users.some(
    (user) => user.UserId == object_id
  );

  if (isResultSubmitted) {
    res.status(StatusCodes.OK).json({ isResultSubmitted });
    return;
  } else {
    res.status(StatusCodes.OK).json({ isResultSubmitted: false });
    return;
  }
};
module.exports = {
  getAllquestions,
  getquestions,
  deletequestion,
  getquestion,
  createquestion,
  updatequestion,
  checkquestion,
};
