const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const EventRegistration = require("../models/Result");

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    if (payload.role !== "admin") {
      throw new UnauthorizedError(
        "You are not authorized to access this route"
      );
    }

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "user") {
      throw new UnauthorizedError(
        "You are not authorized to access this route"
      );
    }

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const eventAuth = async (req, res, next) => {
  // check header
  //.log("yash");
  console.log("yash");
  const { email } = req.body;
  const eventRegistration = await EventRegistration.findOne({ email });
  if (!eventRegistration) {
    throw new UnauthenticatedError("You does not have the access.");
  }
  const token = eventRegistration.createJWT();
  //.log(token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_EVENT);
    // check if the user is a user
    //.log(payload);
    if (payload.role !== "user_event") {
      //.log("yash");
      throw new UnauthorizedError(
        "You are not authorized to access this route"
      );
    }

    // attach the user to the user routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    //.log(error);
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = { userAuth, adminAuth, eventAuth };
