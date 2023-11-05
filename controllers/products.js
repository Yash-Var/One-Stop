const product = require("../models/products");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllproducts = async (req, res) => {
  const products = await product.find().sort("createdAt");
  res.status(StatusCodes.OK).json({ products, count: products.length });
};
const getproduct = async (req, res) => {
  const {
    params: { id: productId },
  } = req;

  const Product = await product.findOne({
    _id: productId,
  });
  if (!Product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ Product });
};

const createproduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const Product = await product.create(req.body);
  res.status(StatusCodes.CREATED).json({ Product });
};

const updateproduct = async (req, res) => {
  const {
    body: { name, cloudinaryImageId, locality, areaName, cuisines, avgRating },
    user: { userId },
    params: { id: productId },
  } = req;

  if (
    name === "" ||
    cloudinaryImageId === "" ||
    locality === "" ||
    areaName === "" ||
    cuisines === "" ||
    avgRating === ""
  ) {
    throw new BadRequestError(
      "Name or cloudinaryImageId or locality or areaName or cuisines or avgRating must be provided"
    );
  }
  const Product = await product.findByIdAndUpdate(
    { _id: productId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!Product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ Product });
};

const deleteproduct = async (req, res) => {
  const {
    params: { id: productId },
  } = req;

  const Product = await product.findByIdAndRemove({
    _id: productId,
  });
  if (!Product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).send("product deleted successfully");
};

module.exports = {
  createproduct,
  deleteproduct,
  getAllproducts,
  updateproduct,
  getproduct,
};
