const express = require("express");
const router = express.Router();

const { createResult } = require("../controllers/result");
const { adminAuth, eventAuth } = require("../middleware/authentication");
const { userAuth } = require("../middleware/authentication");

router.route("/").post(userAuth, createResult);

module.exports = router;
