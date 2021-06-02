var createError = require("http-errors");
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var configDB = require("./config/db.config");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// main route
var indexRouter = require("./routes/index");

// doc route
var indexDocRouter = require("./routes/documentation/index.doc.routes");
var filesDocRouter = require("./routes/documentation/files.doc.routes");
var lecturesDocRouter = require("./routes/documentation/lectures.doc.routes");
var pagesDocRouter = require("./routes/documentation/pages.doc.routes");
var usersDocRouter = require("./routes/documentation/users.doc.routes");

// api route
var filesAPIRouter = require("./routes/api/files/files.routes");
var lecturesAPIRouter = require("./routes/api/lectures/lectures.routes");
var pagesAPIRouter = require("./routes/api/pages/pages.routes");
var usersAPIRouter = require("./routes/api/users/users.routes");

var app = express();

//Set up default mongoose connection
var mongoDB = `mongodb+srv://${configDB.username}:${configDB.password}@${configDB.host}/${configDB.db}?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// main
app.use("/", indexRouter);

// doc
app.use("/doc", indexDocRouter);
app.use("/doc", filesDocRouter);
app.use("/doc", lecturesDocRouter);
app.use("/doc", pagesDocRouter);
app.use("/doc", usersDocRouter);

// api
app.use("/api/v1/files", filesAPIRouter);
app.use("/api/v1/lectures", lecturesAPIRouter);
app.use("/api/v1/pages", pagesAPIRouter);
app.use("/api/v1/users", usersAPIRouter);

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
