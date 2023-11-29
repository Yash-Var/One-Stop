const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const Event = require("../models/Event");
const User = require("../models/User");
const { use } = require("express/lib/router");

const registerEvent = async (req, res) => {
  //.log(req.body);
  console.log(req.body);
  const _id = req.body?.Object_id;

  const Event_Object_id = req.body?.Event_Object_id;
  const { password } = req.body;
  const User_log = await User.findOne({ _id });
  console.log(User_log);
  console.log(_id);
  if (!User_log) {
    throw new UnauthenticatedError("User not found");
  }
  console.log(User_log);
  console.log("yash varshney");
  const isPasswordCorrect = await User_log.comparePassword(password);

  if (!isPasswordCorrect) {
    //("password not correct");
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const event = await Event.findOne({ _id: Event_Object_id });

  if (!event) {
    throw new BadRequestError("Event not found");
  }

  console.log(event);

  const isUserRegistered = event.registrations.includes(User_log._id);
  // console.log(User_log._id);

  // console.log(event.registrations.includes(User_log._id));
  if (!isUserRegistered) {
    event.registrations.push(User_log._id);
  } else {
    throw new BadRequestError("User already registered");
  }

  await event.save();

  res.status(StatusCodes.OK).json({ message: "Event registered successfully" });
};

const loginEvent = async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  console.log("yash varshney");
  const _id = req.body?.Object_id;
  const Event_Object_id = req.body?.Event_Object_id;
  const event = await Event.findOne({ _id: Event_Object_id });
  if (!event) {
    throw new BadRequestError("Event not found");
  }

  const User_log = await User.findOne({ _id });
  if (!User_log) {
    throw new UnauthenticatedError("User not found");
  }
  const isUserRegistered = event.registrations.includes(User_log._id);
  if (!isUserRegistered) {
    res.status(StatusCodes.OK).json({ msg: "User not registered" });
  } else {
    res.status(StatusCodes.OK).json({ msg: "User  registered" });
  }
  // res.status(StatusCodes.OK).json({ msg: "User not registered" });
};

module.exports = {
  registerEvent,
  loginEvent,
};
