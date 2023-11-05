const express = require("express");
const router = express.Router();

const {
  getAllquestions,
  getquestion,
  createquestion,
  updatequestion,
} = require("../controllers/question");
const { adminAuth, eventAuth } = require("../middleware/authentication");
const { userAuth } = require("../middleware/authentication");

router
  .route("/")
  .post(eventAuth, getAllquestions)
  .post(adminAuth, createquestion);

router
  .route("/:id")
  .get(adminAuth, getquestion)
  .patch(adminAuth, updatequestion);

module.exports = router;
