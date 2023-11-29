const express = require("express");
const router = express.Router();

const {
  getAllquestions,
  getquestion,
  createquestion,
  updatequestion,
  checkquestion,
} = require("../controllers/question");
const { adminAuth, eventAuth } = require("../middleware/authentication");
const { userAuth } = require("../middleware/authentication");

router.route("/").post(adminAuth, createquestion);

router
  .route("/:id")
  .get(adminAuth, getquestion)
  .patch(adminAuth, updatequestion);

router.route("/:event_id/:object_id").get(userAuth, getAllquestions);
router.route("/check/:event_id/:object_id").get(userAuth, checkquestion);

module.exports = router;
