const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../model/User");
const secret = require("../../config/db").jwtSecret;

const router = express.Router();

// @route GET /api/users
// @desc Users test
// @Access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users works" });
});

//@route GET users/register
//@desc Register Users
//@Access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: "Email already exists." });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "mm",
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

//@route GET users/Login
//@desc Login Users
//@Access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(">>>>", email, password);
  User.findOne({ email }).then((user) => {
    // console.log(">>>", user);
    if (user) {
      //Authenticate user
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // res.status(200).json({ msg: "Success" });
          const payload = { id: user.id, email: user.email, name: user.name };
          jwt.sign(payload, secret, { expiresIn: 600 }, (err, token) => {
            if (err) throw err;
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
        } else {
          res.status(400).json({ msg: "username and password is incorrect" });
        }
      });
    } else {
      return res.status(404).json({ email: "User not found" });
    }
  });
});

// @route GET /api/users/current
// @desc Return current User
// @Access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
