const express = require("express");

const coordinatorRouter = express.Router();

const {
  getTeachers,
  getAddTeacher,
  postAddTeacher,
  getDeleteTeacher,
  postDeleteTeacher,
  getTeacherDetails,
  getTeacherReport,
  getLectureDetails,
} = require("../controllers/coordinatorController");

coordinatorRouter.get("/coordHome", getTeachers);

coordinatorRouter.get("/addTeacher", getAddTeacher);
coordinatorRouter.post("/coordHome", postAddTeacher);
coordinatorRouter.get("/deleteTeacher", getDeleteTeacher);
coordinatorRouter.post("/deleteTeacher", postDeleteTeacher);

coordinatorRouter.get("/teacherDetails/:id", getTeacherDetails);

coordinatorRouter.get("/report/:id", getTeacherReport);

coordinatorRouter.get("/lectureDetails/:id", getLectureDetails);

module.exports = coordinatorRouter;
