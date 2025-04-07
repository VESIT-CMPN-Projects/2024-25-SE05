const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const i18n = require("i18n");

const authRouter = require("./routes/authRouter");
const teacherRouter = require("./routes/teacherRouter");
const headRouter = require("./routes/headRouter");
const coordinatorRouter = require("./routes/coordinatorRouter");
const indexRouter = require("./routes/index");

const app = express();

i18n.configure({
  locales: ["en", "hi"],
  defaultLocale: "en",
  directory: path.join(__dirname, "locales"),
  queryParameter: "lang",
  cookie: "locale",
  autoReload: true,
  syncFiles: true,
});

app.use(cookieParser());
app.use(i18n.init);

app.use((req, res, next) => {
  res.locals.__ = res.__;
  res.locals.locale = req.getLocale();
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRouter);
app.use("/teacher", teacherRouter);
app.use("/head", headRouter);
app.use("/coordinator", coordinatorRouter);
app.use("/", indexRouter);

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
