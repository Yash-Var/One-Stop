const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const Admin_Reg = await Admin.create({ ...req.body });
  const token = Admin_Reg.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ Admin: { name: Admin_Reg.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const Admin_log = await Admin.findOne({ email });
  if (!Admin_log) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await Admin_log.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = Admin_log.createJWT();
  res.status(StatusCodes.OK).json({ Admin: { name: Admin_log.name }, token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide email");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new BadRequestError("No account with that email exists");
  }

  const resetToken = admin.createPasswordResetToken();
  await admin.save({ validateBeforeSave: false });

  // TODO: Send reset token to user's email

  res.status(StatusCodes.OK).json({ message: "Reset token sent to email" });
};

module.exports = {
  register,
  login,
  forgotPassword,
};

module.exports = {
  register,
  login,
};
