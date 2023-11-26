const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const {
    name,
    email,
    password,
    course,
    department,
    year,
    universityRollno,
    collegeId,
  } = req.body;
  // //(req.body);
  console.log(req.body);
  if (
    !name ||
    !email ||
    !password ||
    !course ||
    !department ||
    !year ||
    !universityRollno ||
    !collegeId
  ) {
    throw new BadRequestError("Please provide all the details");
  }

  const User_Reg = await User.create({
    ...req.body,
  });

  const token = User_Reg.createJWT();
  // //(User_Reg);

  // send a email to the user with the token to verify the email address

  const verificationToken = User_Reg.createVerificationToken();

  // //(process.env.VERIFY_EMAIL_URL);
  // VERIFY_EMAIL_URL=http://yourdomain.com/verify-email
  const verificationUrl = `http://localhost:3000/email/${verificationToken}`;
  // //(verificationUrl);
  const emailTemplate = `<h3>Please click on the below link to verify your email address</h3>
    <p>${verificationUrl}</p>
    `;
  try {
    // //("Sending email");
    // await sendEmail({
    //   to: User_Reg.email,
    //   subject: "Email Verification",
    //   text: emailTemplate,
    // });
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Set to true if using SSL/TLS
      auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.PASSWORD, // Your email password or an application-specific password
      },
    });

    // Define the mail options
    const mailOptions = {
      from: "varshneyyash7011@gmail.com",
      to: User_Reg.email,
      subject: "Test Email",
      text: emailTemplate,
      // You can also include HTML content by adding the 'html' property.
      // html: "<h1>This is HTML content</h1>",
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.error("Error sending email:", error.message);
      } else {
        // //("Email sent successfully:", info.response);
      }

      // Close the transporter to release resources
      transporter.close();
    });
    // //("Email sent");
    res.status(StatusCodes.OK).json({ msg: "Verification email sent" });
  } catch (error) {
    // //(error);
    User_Reg.verificationToken = undefined;
    User_Reg.verificationTokenExpires = undefined;
    await User_Reg.save();
    throw new Error("Email could not be sent");
  }
  // send a token to the user

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

  //(User_log);
  const isPasswordCorrect = await User_log.comparePassword(password);
  if (!isPasswordCorrect) {
    //("password not correct");
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isVerified = User_log.isVerfied; // Fix the typo here
  if (!isVerified) {
    throw new UnauthenticatedError("Please verify your email");
  }

  const token = await User_log.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ User: { name: User_log.name, Object_id: User_log._id }, token });
};

const updateUserVerification = async (userId) => {
  try {
    // Update the user's verification status in the database
    await User.findByIdAndUpdate(userId, { $set: { isVerfied: true } });
    //(`User with ID ${userId} has been verified.`);
  } catch (error) {
    console.error("Error updating user verification:", error);
    throw error; // You may want to handle this error appropriately in your application
  }
};
const verifyToken = (token) => {
  try {
    // Verify the token and extract the user ID
    //(token);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_VERIFICATION); // Replace 'your-secret-key' with your actual secret key
    return decodedToken.userId;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error; // You may want to handle this error appropriately in your application
  }
};
const verifyEmail = async (req, res) => {
  try {
    // Assuming the token is passed as a query parameter
    const token = req.params.token;

    // Here you might want to verify the token, decode it, and extract the user ID
    // For simplicity, I'll assume you have a function verifyToken that returns the user ID
    const userId = verifyToken(token);

    // Now update the user's verification status
    await updateUserVerification(userId);

    // Send a success response
    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    // Handle any errors that occur during the verification process
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
};
