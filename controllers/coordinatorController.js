const fakeTeachers = require("../models/fakeTeachers");

const getTeachers = (req, res, next) => {
  const teachers = [
    // fake teacher
    {
      id: 1,
      name: "Ronald Richards",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  ];

  res.render("coordinator/coordHome", {
    teachers,
    currentPage: "coordHome",
    locale: req.getLocale(),
  });
};

const getAddTeacher = (req, res, next) => {
  res.render("coordinator/addTeacher", {
    currentPage: "addTeacher",
    locale: req.getLocale(),
  });
};

const postAddTeacher = (req, res, next) => {
  res.redirect("/coordinator/coordHome");
};

const getDeleteTeacher = (req, res, next) => {
  res.render("coordinator/deleteTeacher", {
    currentPage: "deleteTeacher",
    teachers: fakeTeachers.teachers,
    locale: req.getLocale(),
  });
};

const postDeleteTeacher = (req, res, next) => {
  const { id } = req.body;
  console.log("Received ID:", id);
  console.log("Before Deletion:", fakeTeachers.teachers);

  const parsedId = parseInt(id);

  // Find and remove teacher by ID
  const initialLength = fakeTeachers.teachers.length;
  fakeTeachers.teachers = fakeTeachers.teachers.filter(
    (teacher) => teacher.id !== parsedId
  );

  // Check if a teacher was actually deleted
  if (fakeTeachers.teachers.length < initialLength) {
    res.json({ success: true, message: "Teacher deleted successfully" });
  } else {
    res.json({ success: false, message: "Teacher not found" });
  }
};

const getTeacherDetails = (req, res) => {
  const teacherId = req.params.id;

  // Generate fake teacher data dynamically //update later using proper details in mongodb
  const fakeTeacher = {
    id: teacherId,
    name: `Ronald Richards`,
    lectures: [
      {
        lecId: 1,
        date: "2025-02-12",
        time: "10:00 AM",
        address: "Signal Shala, Pune",
        studentsPresent: Math.floor(Math.random() * 30) + 10, // Random student count
        activity: "Taught Mathematics and Science",
        entryImage: "/images/entryImg.png",
        exitImage: "/images/exitImg.png",
      },
      {
        lecId: 2,
        date: "2025-02-11",
        time: "2:00 PM",
        address: "Signal Shala, Mumbai",
        studentsPresent: Math.floor(Math.random() * 30) + 10,
        activity: "Conducted a quiz on English Literature",
        entryImage: "/images/entryImg.png",
        exitImage: "/images/exitImg.png",
      },
    ],
  };

  res.render("coordinator/teacherDetails", {
    teacher: fakeTeacher,
    lectures: fakeTeacher.lectures,
    currentPage: "teacherDetails",
    locale: req.getLocale(),
  });
};

const getTeacherReport = (req, res) => {
  const teacherId = req.params.id;
  const fakeTeacher = {
    id: teacherId,
    name: "Abejeet Thakur",
  };
  // fake details
  const fakeLectures = [
    {
      id: 1,
      date: "2024-04-29",
      address: "Santoshi Mata Mandir Pada",
      studentsPresent: 16,
    },
    {
      id: 2,
      date: "2024-04-22",
      address: "Rupa Devi Mandir Parisar",
      studentsPresent: 18,
    },
    {
      id: 3,
      date: "2024-04-17",
      address: "Manesh Shaka",
      studentsPresent: 20,
    },
    {
      id: 4,
      date: "2024-04-10",
      address: "RypaDevi Tekdi",
      studentsPresent: 17,
    },
    {
      id: 5,
      date: "2024-04-03",
      address: "New Jay Bhavani Nagar",
      studentsPresent: 20,
    },
    {
      id: 6,
      date: "2024-03-25",
      address: "Old Shala Area",
      studentsPresent: 15,
    },
    {
      id: 7,
      date: "2024-03-18",
      address: "Another Area",
      studentsPresent: 22,
    },
  ];

  // Group by month and sort by latest date first
  const groupedLectures = fakeLectures.reduce((acc, lecture) => {
    const month = new Date(lecture.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[month]) acc[month] = [];
    acc[month].push(lecture);
    return acc;
  }, {});
  // Sorting each month's lectures in descending order
  for (let month in groupedLectures) {
    groupedLectures[month].sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  res.render("coordinator/report", {
    teacher: fakeTeacher,
    groupedLectures,
    currentPage: "teacherReport",
    locale: req.getLocale(),
  });
};

getLectureDetails = (req, res) => {
  const { id } = req.params;
  console.log("Lecture ID received:", id);
  // Fake lecture details (Replace with database fetch)
  const lecture = {
    id,
    date: "2025-02-12",
    time: "10:00 AM",
    address: "Signal Shala, Pune",
    studentsPresent: Math.floor(Math.random() * 30) + 10, // Random student count
    activity: "Taught Mathematics and Science",
    entryImage: "/images/entryImg.png",
    exitImage: "/images/exitImg.png",
  };

  res.render("coordinator/lectureDetails", {
    lecture,
    currentPage: "lectureDetails",
    locale: req.getLocale(),
  });
};

exports.getTeachers = getTeachers;
exports.getAddTeacher = getAddTeacher;
exports.postAddTeacher = postAddTeacher;
exports.getTeacherDetails = getTeacherDetails;
exports.getTeacherReport = getTeacherReport;
exports.getLectureDetails = getLectureDetails;
exports.getDeleteTeacher = getDeleteTeacher;
exports.postDeleteTeacher = postDeleteTeacher;
