if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dburl =
  "mongodb+srv://hugeppkaeya:7Mnc2xu6tyAKwLnv@cluster0.vsgbwfo.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const Teacher = require("./models/teacher");
const Coordinator = require("./models/coordinator");
const Head = require("./models/head");

const mongoose = require("mongoose");

mongoose
  .connect(dburl)
  .then(() => console.log("Mongoose connected successfully!"))
  .catch((err) => console.log(err));

const session = require("express-session");
const MongoStore = require("connect-mongo");

const authRouter = require("./routes/authRouter");
const teacherRouter = require("./routes/teacherRouter");
const headRouter = require("./routes/headRouter");
const coordinatorRouter = require("./routes/coordinatorRouter");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET || "temporarySecret",
  },
  touchAfter: 24 * 3600,
});

const retryConnection = () => {
  setTimeout(() => {
    // Logic to reconnect the store
    console.log("Retrying connection...");
  }, 5000); // Retry after 5 seconds
};

store.on("error", (err) => {
  console.error("Error in connecting MongoSession Store: ", err);
  retryConnection();
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "temporarySecret",
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use("teacher", new LocalStrategy(Teacher.authenticate()));
passport.use("coordinator", new LocalStrategy(Coordinator.authenticate()));
passport.use("head", new LocalStrategy(Head.authenticate()));

// Passport configuration for multiple user types
passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.constructor.modelName });
});

passport.deserializeUser(async (data, done) => {
  try {
    let user;
    switch (data.role) {
      case "Teacher":
        user = await Teacher.findById(data.id);
        break;
      case "Coordinator":
        user = await Coordinator.findById(data.id);
        break;
      case "Head":
        user = await Head.findById(data.id);
        break;
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use("/auth", authRouter); // Add the authentication routes
app.use("/teacher", teacherRouter);
app.use("/head", headRouter);
app.use("/coordinator", coordinatorRouter);

// Default route
app.use((req, res) => {
  res.render("index", { currentPage: "index" });
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
