const express = require("express");
const { adminAuth } = require("../middleware/authentication");
const router = express.Router();
const {
  createproduct,
  deleteproduct,
  getAllproducts,
  updateproduct,
  getproduct,
} = require("../controllers/products");

router.route("/").post(adminAuth, createproduct).get(getAllproducts);

router
  .route("/:id")
  .get(getproduct)
  .delete(adminAuth, deleteproduct)
  .patch(adminAuth, updateproduct);

module.exports = router;
