const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  isVerfied: {
    type: Boolean,
    default: false,
  },
  course: {
    type: String,
    required: [true, "Please provide course"],
  },
  department: {
    type: String,
    required: [true, "Please provide department"],
  },
  year: {
    type: String,
    required: [true, "Please provide year"],
  },
  universityRollno: {
    type: String,
    required: [true, "Please provide universityRollno"],
  },
  collegeId: {
    type: String,
    required: [true, "Please provide collegeId"],
  },
  verificationToken: String,
});

UserSchema.methods.createVerificationToken = function () {
  const token = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET_VERIFICATION,
    { expiresIn: "30d" }
  );

  // Set the verification token and expiration date
  this.verificationToken = token;

  // Return the generated token
  return token;
};

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

let User = "user";

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { role: User, userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);

  //(isMatch);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
