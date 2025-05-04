const express = require("express");
const router = express.Router();

const { createResult, getResultByEventId } = require("../controllers/result");
const { adminAuth, eventAuth } = require("../middleware/authentication");
const { userAuth } = require("../middleware/authentication");

router.route("/").post(createResult);
router.route("/all").post(getResultByEventId);

module.exports = router;
