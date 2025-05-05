const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const question = require("../models/question");
const { BadRequestError, NotFoundError } = require("../errors");
const result = require("../models/Result");

const createEvent = async (req, res) => {
  // if the number of event is greater than 5 then throw error
  const count = await Event.countDocuments();

  //.log(count);

  const createEvent = await Event.create(req.body);

  const Question = await question.create({ EventId: createEvent._id });
  const Result = await result.create({ EventId: createEvent._id });
  res.status(StatusCodes.CREATED).json({ createEvent });
};

const getEvent = async (req, res) => {
  //   //.log(Event.countDocuments()); how to find the count of event

  const getEvent = await Event.find();
  res.status(StatusCodes.OK).json({ getEvent });
};
const getid = async (req, res) => {
  const events = await Event.find({}, { _id: 1, event_name: 1 , key:1}); // Only select _id and name
  res.status(StatusCodes.OK).json({ events });
};

const updateEvent = async (req, res) => {
  const {
    body: { event_name, start_date, end_date, maxRegsitration },
    params: { id: eventId },
  } = req;

  if (
    event_name === "" ||
    start_date === "" ||
    end_date === "" ||
    maxRegsitration === ""
  ) {
    throw new BadRequestError(
      "event_name or start_date or end_date or maxRegsitration must be provided"
    );
  }
  const upadteEvent = await Event.findByIdAndUpdate(
    { _id: eventId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!Event) {
    throw new NotFoundError(`No Event with id ${eventId}`);
  }
  res.status(StatusCodes.OK).json({ updateEvent });
};

module.exports = {
  createEvent,
  getEvent,
  updateEvent,
  getid,
};

// const eventRegistration = await EventRegistration.create({ ...req.body });
// const token = eventRegistration.createJWT();
// res
//   .status(StatusCodes.CREATED)
//   .json({ EventRegistration: { name: eventRegistration.name }, token });
