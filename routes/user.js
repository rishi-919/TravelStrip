const express = require("express");
const router = express.Router();
const wrapAsync = require("../utiles/wrapAsync.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User=require("../models/users.js");
//  signup
router.get("/signup", async (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }

        req.flash("success", "Welcome To TravelStrip");

        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);

      res.redirect("/users/signup");
    }
  }),
);
//  login
router.get("/login", async (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome To TravelStrip!");
    res.redirect("/listings");
  },
);
// logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
});

module.exports = router; 