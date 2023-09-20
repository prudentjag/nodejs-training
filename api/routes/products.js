const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const multer = require("multer");

const fileFIlter = (req, file, cb) => {
  // reject a file
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const image = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFIlter : fileFIlter
});

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id") //query seleector kinda thing
    .exec()
    .then((result) => {
      if (result.length > 0) {
        const response = {
          count: result.length,
          products: result.map((result) => {
            return {
              name: result.name,
              price: result.price,
              _id: result._id,

              requests: {
                type: "Get",
                url: "http://localhost:3000/products/" + result._id,
              },
            };
          }),
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", image.single("product_image"), (req, res, next) => {
  const product = new Product({
    //geting request from front end (forms etec),
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.productImage
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product created Successfully",
        products: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          Products: result,
          request: {
            type: "GET",
            description: "Get all products",
            url: "https://localhost:3000/products",
          },
        });
      } else {
        res.status(404).json({
          message: "No data found for this product",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;

  const updateFields = {
    name: req.body.name,
    price: req.body.price,
  };

  Product.findByIdAndUpdate(id, updateFields, { new: true })
    .select("name price _id")
    .then((updatedProduct) => {
      if (updatedProduct) {
        res.status(200).json({
          message: "Product updated successfully",
          newProducts: {
            products: updatedProduct,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + id,
            },
          },
        });
      } else {
        res.status(500).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount >= 0) {
        res.status(200).json({
          message: "Deleted Successfully",
          requests: {
            type: "GET",
            url: "http://localhost:3000/products",
            data: { name: string, price: number },
          },
        });
      } else {
        res.status(500).json({ error: "No ID Found" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
