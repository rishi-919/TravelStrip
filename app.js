if(process.envNode_ENV !="production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews");

const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");
const wrapAsync = require("./utiles/wrapAsync.js");
const ExpressError = require("./utiles/ExpressError.js");

const { listingSchema, reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const { getMaxListeners } = require("cluster");

const { isLoggedIn, isOwner } = require("./middleware.js");
const { isReviewAuthor } = require("./middleware.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users=require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// session-cookies
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//  flash
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.user);
  res.locals.currentUser = req.user;
  next();
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

main()
  .then(() => {
    console.log("Connection establish with mongoose");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/users",users);



// // login
//  app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"demouser@gmail.com",
//         username:"demouser1"

//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
//  });


// route not match
app.all("/{*path}", (req, res, next) => {
  console.log(req.path);
  next(new ExpressError(404, "page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something error occured" } = err;
  // res.render("listings/error.ejs",{message});
  res.status(404).render("listings/error.ejs", { message });
  console.log(err);
});

app.listen(8080, () => {
  console.log("app is listening at port 8080");
});
