const express = require("express");
const adminController = require("../controllers/adminUserController");
const router = express.Router();

router.post("/adminCreate",adminController.adminCreate );


router.delete("/SoftdeleteUser/:id",adminController.SoftdeleteUser );
router.put("/RestoreUser/:id",adminController.RestoreUser );

router.get("/GetUsers/",adminController.GetUsers );
router.get("/getUserById/:id",adminController.getUserById );
router.get("/GetDeletedUsers",adminController.GetDeletedUsers );


router.post("/addCoursetoUser/:admin_id/:user_id/:course_id",adminController.addCoursetoUser );
router.put("/updateCoursetoUser/:course_user_id",adminController.updateCoursetoUser );
router.delete("/deleteCourseForUser/:course_user_id",adminController.deleteCourseForUser );
router.put("/restoreCourseForUser/:course_user_id",adminController.restoreCourseForUser );
router.get("/getCoursesForUser/:user_id",adminController.getCoursesForUser );

router.post("/addTasktoUser/:admin_id/:user_id/:task_id ",adminController.addTasktoUser );


module.exports = router;