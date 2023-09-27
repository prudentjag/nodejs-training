const express = require("express");

const router = express.Router();

const checkAuth = require("../middleware/check_auth");

const orderFunction = require("../controllers/order");

// handles incoming get request /orders
router.get(
  "/",
  checkAuth.authenticate,
  checkAuth.restricts(["admin", "user"]),
  orderFunction.allOrders
);

router.post(
  "/",
  checkAuth.authenticate,
  checkAuth.restricts(["admin", "user"]),
  orderFunction.addOrder
);

router.get(
  "/:orderId",
  checkAuth.authenticate,
  checkAuth.restricts(["admin", "user"]),
  orderFunction.getAOrder
);

router.patch("/:orderId", checkAuth, (req, res, next) => {
  res.status(200).json({
    message: "Update order here",
    id: req.params.orderId,
  });
});
router.delete(
  "/:orderId",
  checkAuth.authenticate,
  checkAuth.restricts(["admin", "user"]),
  orderFunction.deleteOrder
);

module.exports = router;
