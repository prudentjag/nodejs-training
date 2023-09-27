const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check_auth");

const userController = require("../controllers/user");

router.post("/signup", userController.signUp);

router.post("/login" , userController.login)

router.delete("/:userId", checkAuth.authenticate, userController.deleteUser);

module.exports = router;
