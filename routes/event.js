const express = require("express");
const router = express.Router();

const {
  getEvent,
  createEvent,
  getid,
  updateEvent,
} = require("../controllers/event");
const { adminAuth } = require("../middleware/authentication");
const { userAuth } = require("../middleware/authentication");

router.route("/").get(getEvent).post(createEvent);
router.route("/all").get(getid);

router.route("/:id").delete(adminAuth).patch(adminAuth, updateEvent);

module.exports = router;
