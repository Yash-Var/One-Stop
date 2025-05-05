const express = require("express");
const router = express.Router();

const {
  getAllquestions,
  getquestion,
  getquestions,
  createquestion,
  updatequestion,
  checkquestion,
  deletequestion,
} = require("../controllers/question");
const { adminAuth, eventAuth } = require("../middleware/authentication");
const { userAuth } = require("../middleware/authentication");

router.route("/").post(createquestion);
router.route("/getquestions/:event_id").get(getquestions)
router.route("/:event_id/:object_id").get(userAuth, getAllquestions);
router.route("/check/:event_id/:object_id").get(userAuth, checkquestion);
router
  .route("/:id")
  .get( getquestion)
  .patch( updatequestion)
  .delete( deletequestion);



module.exports = router;
