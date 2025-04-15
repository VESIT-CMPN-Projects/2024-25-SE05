const express = require("express");
const cloudinary = require("cloudinary").v2;

const headRouter = express.Router();
const {
  getCoordinators,
  getAddCoordinator,
  postAddCoordinator,
  getCoordinatorReport,
  getLectureDetails,
} = require("../controllers/headController");

const {CoordinatorStorage} = require("../cloudConfig.js");
const multer = require('multer');
const upload = multer({storage: CoordinatorStorage}); 

const Head = require("../models/head.js");
const Coordinator = require("../models/coordinator.js");
const TeacherReport = require("../models/teacherReport.js");
const CoordReport = require("../models/coordinatorReport.js");

// Add authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user.constructor.modelName === 'Head') {
      return next();
  }
  res.redirect("/auth/login/head");
};

// Apply middleware to all coordinator routes
headRouter.use(isAuthenticated);

headRouter.get("/headHome", async (req, res) => {
  const {username} = req.user;
  const currUser = await Head.findOne({username}).populate("coordinators");
  res.render("head/headHome", { currUser, currentPage: "headHome" });
});

headRouter.get("/addCoordinator", (req, res) => {
  res.render("head/addCoordinator", { currentPage: "addCoordinator" });
});

headRouter.post("/addCoordinator", upload.single('photo'), async (req, res) => {
  const currUser = req.user;
  let {coordinatorName, password} = req.body;
  let {path, fieldname} = req.file;
  try {
    const newCoord = new Coordinator({picture: {path, fieldname}, username: coordinatorName});
    const registeredCoord = await Coordinator.register(newCoord, password);
    currUser.coordinators.push(registeredCoord);
    await currUser.save();
    res.redirect("/head/headHome");
  } catch (error) {
    res.send(error);
  }
});

headRouter.get("/delete/:id", async (req, res) => {
  try {
    const coordId = req.params.id;
    const currUser = req.user;

    // Remove coordinator reference from coordinator's teachers array
    currUser.coordinators = currUser.coordinators.filter(
      (coordinator) => coordinator.toString() != coordId
    );
    const newUser = await currUser.save();

    if(newUser) {
      // Delete the teacher
      const delCoord = await Coordinator.findByIdAndDelete(coordId);
      if(delCoord && delCoord.picture) {
        // Delete image from Cloudinary
        const publicId = delCoord.picture.path.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`Coordinators/${publicId}`);

        // Delete the respective CoordinatorReports
        const delReports = await CoordReport.deleteMany({coordinator: delCoord._id});
      }
    }  

    res.redirect("/head/headHome");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting Coordinator");
  }
});

headRouter.get("/coordinatorReport/:id", async (req, res) => {
  const currUser = req.user;
  const coordinatorId = req.params.id;

  const currCoord = await Coordinator.findById(coordinatorId);

  const coordReports = await CoordReport.find({coordinator: coordinatorId})
  .populate({
    path: 'teacherReports',
    populate: {
      path: 'teacher'
    }
  });

  res.render("head/coordinatorReport", {
    currUser,
    coordReports,
    currCoord,
    currentPage: "coordinatorReport",
  });
});

headRouter.get("/lectureDetails/:id", async (req, res) => {
  const currUser = req.user;
  const lectureId = req.params.id;
  const lecture = await TeacherReport.findById(lectureId).populate("teacher");

  res.render("head/lectureDetails", {
    currUser,
    lecture,
    currentPage: "HeadLectureDetails",
  });
});

module.exports = headRouter;
