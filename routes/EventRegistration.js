const express = require("express");
const router = express.Router();
const {
  registerEvent,
  loginEvent,
} = require("../controllers/event_registrations");
const { userAuth } = require("../middleware/authentication");
router.route("/register").post(userAuth, registerEvent);
router.route("/login").post(userAuth, loginEvent);
module.exports = router;
