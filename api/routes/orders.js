const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

// handles incoming get request /orders
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product","name")
    .exec()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        orders: result.map((order) => {
          return {
            _id: order._id,
            product: order.product,
            quantity: order.quantity,
            requests: {
              type: "GET",
              url: "https://localhost:3000/orders/" + result._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: "An error occurred while fetching orders: " + err.message,
      });
    });
});

router.post("/", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.productid)) {
    return res.status(400).json({
      message: "Invalid ObjectId for productid",
    });
  }

  Product.findById(req.body.productid)
  .populate("Product", "name")
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Invalid Product",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productid,
        quantity: req.body.quantity,
      });

      return order.save();
    })
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "Orders successfully Created",
          orderscreated: {
            _id: result._id,
            product: result.productid,
            quantity: result.quantity,
          },
          requests: {
            type: "GET",
            url: "https://localhost:3000/orders/" + result._id,
          },
        });
      } else {
        res.status(500).json({
          message: "Error Placing orders",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("_id product quantity")
    .populate("product", "name") // more like key refernceing in mysql
    .exec()
    .then((result) => {
      res.status(200).json({
        Orders: result,
        requests: {
          type: "GET",
          url: "https://localhost:3000/orders/",
        },
      });
    })
    .catch((err) => {
      req.status(500).json({
        error: err,
      });
    });
});

router.patch("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Update order here",
    id: req.params.orderId,
  });
});
router.delete("/:orderId", (req, res, next) => {
  Order.deleteOne({ _id : req.params.orderId})
  .exec()
  .then( result => {
    res.status(200).json({
        message : "Order has been deleted",
        requests : {
            type : "POST",
            url : "https://localhost:300/orders"
        }
    })
  })
  .catch(err => {
    res.status(500).json({
        error : err
    })
  })
});

module.exports = router;
