const EventRegistration = require("../models/Event_registrations");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const Event = require("../models/Event");
const User = require("../models/User");
const { use } = require("express/lib/router");

const registerEvent = async (req, res) => {
  //.log(req.body);
  const _id = req.body?.Object_id;

  const Event_Object_id = req.body?.Event_Object_id;
  const { password } = req.body;
  const User_log = await User.findOne({ _id });
  console.log(User_log);
  console.log("yash varshney");
  const isPasswordCorrect = await User_log.comparePassword(password);

  if (!isPasswordCorrect) {
    //("password not correct");
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const event = await Event.findOne({ _id: Event_Object_id });

  if (!event) {
    throw new BadRequestError("Invalid Event");
  }

  console.log(event);
  const isUserRegistered = event.registrations.includes(User_log._id);
  console.log(User_log._id);

  console.log(event.registrations.includes(User_log._id));
  if (!isUserRegistered) {
    event.registrations.push(User_log._id);
  }

  await event.save();

  res.status(StatusCodes.OK).json({ message: "Event registered successfully" });
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
