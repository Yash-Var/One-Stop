const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Event = require("../models/Event");
const result = require("../models/Result");
const question = require("../models/question");

const createResult = async (req, res) => {
  // const createResult = await result.create(req.body);

  const EventId = req.body.EventId;
  const object_id = req.body.object_id;
  const score = req.body.score;
  const checkEvent = await Event.findOne({ _id: EventId });
  if (!checkEvent) {
    throw new BadRequestError("Event not found");
  }

  const isUserRegistered = checkEvent.registrations.includes(object_id);

  if (!isUserRegistered) {
    throw new BadRequestError("User not registered");
  }

  const questions = await question.findOne({ EventId }).sort("createdAt");

  const totalQuestion = questions.Questions.length;

  if (totalQuestion < score) {
    throw new BadRequestError("Not possible");
  }

  const Result = await result.findOne({ EventId });

  if (!Result) {
    throw new BadRequestError("Event not found");
  }

  Result.Users.forEach((element) => {
    if (element.UserId == object_id) {
      throw new BadRequestError("User already exists");
    }
  });
  Result.Users.push({ UserId: object_id, Score: score });
  await Result.save();
  res.status(StatusCodes.CREATED).json({ Result });
  // res.status(StatusCodes.CREATED).json({ createResult });
};

const getResultByEventId = async (req, res) => {
  const { eventId } = req.body;

  // Validate event
  const eventExists = await Event.findById(eventId);
  if (!eventExists) {
    throw new BadRequestError("Invalid Event ID");
  }
  console.log(eventId);
  // Fetch result with populated user and event details
  const eventResult = await result
    .findOne({ EventId: eventId })
    .populate("Users.UserId", "name email")
    .populate("EventId", "event_name");

  if (!eventResult) {
    throw new NotFoundError("Result not found for this event");
  }

  // Fetch total number of questions for the event
  const questionDoc = await question.findOne({ EventId: eventId });
  const totalScore = questionDoc ? questionDoc.Questions.length : 0;

  res.status(StatusCodes.OK).json({
    eventResult,
    totalScore,
  });
};
module.exports = {
  createResult,
  getResultByEventId,
};
