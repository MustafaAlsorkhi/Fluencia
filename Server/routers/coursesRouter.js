const express = require("express");
const coursesController = require("../controllers/coursesController");
const router = express.Router();

router.post("/addCourse/:admin_id",coursesController.addCourse);

router.put("/UpdateCourse/:course_id",coursesController.UpdateCourse);

router.delete("/SoftdeleteCourse/:course_id",coursesController.SoftdeleteCourse);

router.put("/RestoreCourse/:course_id",coursesController.RestoreCourse);

router.get("/GetCourses",coursesController.GetCourses);

router.get("/GetCoursedeleted",coursesController.GetCoursedeleted);


module.exports = router;