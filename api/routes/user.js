const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const Users = require("../models/user");
const user = require("../models/user");

router.post("/signup", (req, res, next) => {
  Users.find({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result.length >= 1) {
        res.status(402).json({
          message: "Mail already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: "Password hashing failed: " + err.message,
            });
          } else {
            const user = new Users({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });

            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User Created Successfully",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: "User creation failed" + err.message,
                });
              });
          }
        });
      }
    });
});

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "loaded",
  });
});

router.post("/login" , (req, res, next ) => {
    Users.find({email : req.body.email})
    .then(user => {
        if(user.length < 1 ){
            return res.status(404).json({
                message : "Auth failed"
            })
        }
        bcrypt.compare(req.body.password, user[0].password , (err , response) => {
            if(err) {
                return res.status(401).json({
                    message : "Authenticatio failed"
                })
            }
            if(response) {
                const token = jwt.sign({
                    email : user[0].email,
                    userId : user[0]._id
                }, process.env.jwt_key,
                {
                    expiresIn : "1h"
                }
                )
                return res.status(200).json({
                    message : "Authentication succesfull",
                    token: token
                })
            }
        })
    })
    .catch(err => {
         res.status(500).json({
           message: "Error logging user" + err.message,
         });
    })
})

router.delete("/:userId", (req, res, next) => {
  Users.deleteOne({ _id: req.params.userId })
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "User deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error deleting user" + err.message,
      });
    });
});

module.exports = router;
