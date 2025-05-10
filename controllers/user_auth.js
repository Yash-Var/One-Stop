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
  const emailTemplate = `
    <html>
      <head>
        <style>
          /* Add your custom CSS styles here */
          body {
            font-family: Arial, sans-serif;
          }
          h3 {
            color: #333;
          }
          p {
            color: #777;
          }
          .verification-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <h3>Please click on the below link to verify your email address</h3>
        <p>Click the button or copy the link below into your browser:</p>
        <p><a class="verification-link" href="${verificationUrl}">Verify Email</a></p>
      </body>
    </html>
  `;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Define the mail options
    const mailOptions = {
      from: "varshneyyash7011@gmail.com",
      to: User_Reg.email,
      subject: "Test Email",
      html: emailTemplate, // Set the email template as HTML content
    };
    console.log(mailOptions)

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("kush")
      } else {
        console.log("yash")
      }
      transporter.close();
    });

    res.status(StatusCodes.OK).json({ msg: "Verification email sent" });
  } catch (error) {
    User_Reg.verificationToken = undefined;
    User_Reg.verificationTokenExpires = undefined;
    await User_Reg.save();
    throw new Error("Email could not be sent");
  }
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

  const isVerified = User_log.isVerfied;
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
    await User.findByIdAndUpdate(userId, { $set: { isVerfied: true } });
  } catch (error) {
    console.error("Error updating user verification:", error);
    throw error;
  }
};
const verifyToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_VERIFICATION);
    return decodedToken.userId;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    const userId = verifyToken(token);

    await updateUserVerification(userId);

    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
};
