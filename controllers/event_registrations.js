const EventRegistration = require("../models/Event_registrations");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const registerEvent = async (req, res) => {
  //.log(req.body);
  const eventRegistration = await EventRegistration.create({ ...req.body });
  const token = eventRegistration.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ EventRegistration: { name: eventRegistration.name }, token });
};

const loginEvent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const eventRegistration = await EventRegistration.findOne({ email });
  if (!eventRegistration) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await eventRegistration.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = eventRegistration.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ EventRegistration: { name: eventRegistration.name }, token });
};

module.exports = {
  registerEvent,
  loginEvent,
};
