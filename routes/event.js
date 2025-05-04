const express = require("express");
const router = express.Router();

const {
  getEvent,
  createEvent,

  updateEvent,
} = require("../controllers/event");
const { adminAuth } = require("../middleware/authentication");
const { userAuth } = require("../middleware/authentication");

router.route("/").get(userAuth, getEvent).post(createEvent);

router.route("/:id").delete(adminAuth).patch(adminAuth, updateEvent);

module.exports = router;
