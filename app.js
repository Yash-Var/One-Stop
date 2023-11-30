require("dotenv").config();
require("express-async-errors");
const { compiler } = require("compilex");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const { userAuth, adminAuth } = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user_auth");
const productsRouter = require("./routes/products");
const eventRouter = require("./routes/event");
const event_regRouter = require("./routes/EventRegistration");
const resultRouter = require("./routes/result");

const questionRouter = require("./routes/question");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { verifyEmail } = require("./controllers/user_auth");
const { Compiler } = require("./controllers/complier");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send('<h1>products API</h1><a href="/api-docs">Documentation</a>');
});

// routes
// app.post("/compiler",Compiler)
app.use("/api/v1/admin", authRouter);
app.use("/api/v1/user", userRouter);

app.use("/api/v1/admin/event", eventRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/event_reg", event_regRouter);
app.use("/api/v1/result", resultRouter);
app.get("/email/:token", verifyEmail);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    //.log("yash" + process.env.JWT_SECRET);
    //.log(error);
  }
};

start();
