const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check_auth");
const images = require("../middleware/fileupload");

const Product = require("../models/product");

const productController = require("../controllers/product");

router.get("/", productController.getProducts);

router.post(
  "/",
  checkAuth.authenticate,
  checkAuth.restrict('admin'),
  images.single("productImage"),
  productController.addProducts
);

router.get("/:productId", productController.getSingleProduct);

router.patch(
  "/:productId",
  checkAuth.authenticate,
  checkAuth.restrict("admin"),
  productController.updateProduct
);

router.delete(
  "/:productId",
  checkAuth.authenticate,
  checkAuth.restrict("admin"),
  productController.deleteProducts
);

module.exports = router;
