const db = require("../models/db");
const CourseModel = require('../models/courseModel');


async function addCourse(req, res) {
  const admin_id = req.params.admin_id;
  const { course_name, course_description, start_date } = req.body;

  try {
    const newCourseId = await CourseModel.addCourse(admin_id, course_name, course_description, start_date);

    res.status(201).json({ message: "Course added successfully", course_id: newCourseId });
  } catch (error) {
    console.error("Failed to add course in the controller: ", error);
    res.status(500).json({ error: "Failed to add course" });
  }
}

//____________________________________________________________________________________

  async function UpdateCourse(req, res) {
    const course_id = req.params.course_id;
    const { course_name, course_description, start_date } = req.body;
  
    try {
      await CourseModel.UpdateCourse(course_id, course_name, course_description, start_date);
  
      res.status(200).json({ message: "Course updated successfully" });
    } catch (error) {
      console.error("Failed to update course in the controller: ", error);
      res.status(500).json({ error: "Failed to update course" });
    }
  }

//______________________________________________________________________________________________

  async function SoftdeleteCourse(req, res) {
    const course_id = req.params.course_id;
  
    try {
      await CourseModel.SoftdeleteCourse(course_id);
  
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Failed to soft delete course in the controller: ", error);
      res.status(500).json({ error: "Failed to soft delete course" });
    }
  }
//______________________________________________________________________________________________

async function RestoreCourse(req, res) {
  const course_id = req.params.course_id;

  try {
    await CourseModel.RestoreCourse(course_id);

    res.status(200).json({ message: "Course restored successfully" });
  } catch (error) {
    console.error("Failed to restore course in the controller: ", error);
    res.status(500).json({ error: "Failed to restore course" });
  }
}

//______________________________________________________________________________________________

async function GetCourses (req, res) {
  try {
    const courses = await CourseModel.GetCourses ();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Failed to get courses in the controller: ", error);
    res.status(500).json({ error: "Failed to get courses" });
  }
}
//______________________________________________________________________________________________

async function GetCoursedeleted(req, res) {
  try {
    const deletedCourses = await CourseModel.GetCoursedeleted();
    res.status(200).json(deletedCourses);
  } catch (error) {
    console.error("Failed to get deleted courses in the controller: ", error);
    res.status(500).json({ error: "Failed to get deleted courses" });
  }
}





  module.exports = {
    addCourse  ,
    UpdateCourse ,
    SoftdeleteCourse,
    RestoreCourse,
    GetCourses,
    GetCoursedeleted
  };