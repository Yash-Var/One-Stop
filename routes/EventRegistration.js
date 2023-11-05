const express = require("express");
const router = express.Router();
const {
  registerEvent,
  event_login,
} = require("../controllers/event_registrations");
const { userAuth } = require("../middleware/authentication");
router.route("/register").post(userAuth, registerEvent);

module.exports = router;
