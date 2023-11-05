const express = require("express");
const router = express.Router();

const {
  getEvent,
  createEvent,

  updateEvent,
} = require("../controllers/event");
const { adminAuth } = require("../middleware/authentication");

router.route("/").get(getEvent).post(adminAuth, createEvent);

router.route("/:id").delete(adminAuth).patch(adminAuth, updateEvent);

module.exports = router;
