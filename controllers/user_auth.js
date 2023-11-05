const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const User_Reg = await User.create({ ...req.body });
  const token = User_Reg.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ User: { name: User_Reg.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const User_log = await User.findOne({ email });
  if (!User_log) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await User_log.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = User_log.createJWT();
  res.status(StatusCodes.OK).json({ User: { name: User_log.name }, token });
};

module.exports = {
  register,
  login,
};
