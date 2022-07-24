const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// const flash = require("express-flash");
const passportConfig = require("./passport");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouther = require("./routes/auth");
const cartRouther = require("./routes/cart");
const orderRouther = require("./routes/order");
const productRouther = require("./routes/product");

const app = express();
const passport = require("passport");
passportConfig(passport);

app.use(logger("dev"));
app.use(express.json());
// app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(flash());
app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
  })
);
// passport

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouther);
app.use("/cart", cartRouther);
app.use("/order", orderRouther);
app.use("/product", productRouther);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
