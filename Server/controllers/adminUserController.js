const db = require("../models/db");


const adminCreate = (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;
  
    db.query(
      'INSERT INTO admin (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, email, password, role],
      (error, results) => {
        if (error) {
          console.error('Error creating admin:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(201).json(results.rows[0] );
      }
    );
  };
  

  //_________________________________________________________________________


const SoftdeleteUser = async (req, res) => {
    const user_id = req.params.id;
    try {
      const queryText = "UPDATE users SET deleted = TRUE WHERE user_id = $1";
      const values = [user_id];
      const result = await db.query(queryText, values);
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Soft delete failed" });
    }
  };


  //______________________________________________________________________


  const RestoreUser = async (req, res) => {
    const user_id = req.params.id;
  
    try {
      const queryText = "UPDATE users SET deleted = FALSE WHERE user_id = $1";
      const result = await db.query(queryText, [user_id]);
      
        res.status(200).json({ message: "User restored successfully", user: result.rows[0] });
    
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to restore user" });
    }
  };

//_____________________________________________________________________________


async function GetUsers (req, res) {
    // const { email, password } = req.body;
  
    try {
      const checkQuery = "SELECT first_name,last_name,email FROM users WHERE deleted=false";
       const Result = await db.query(checkQuery);
  
       
        res.status(200).json(Result.rows);
      
    } catch (error) {
      console.error("Can't get of users: ", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  }
  

  //__________________________________________________________________________

  async function getUserById(req, res) {
    const user_id = req.params.id;
  
    try {
      const queryText = "SELECT first_name, last_name, email FROM users WHERE user_id = $1 AND deleted = false";
      const result = await db.query(queryText, [user_id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get user" });
    }
  }

  //__________________________________________________________________________

  async function GetDeletedUsers (req, res) {
  
    try {
      const checkQuery = "SELECT first_name,last_name,email FROM users WHERE deleted=true";
       const Result = await db.query(checkQuery);
  
       
        res.status(200).json(Result.rows);
      
    } catch (error) {
      console.error("Can't get of users: ", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  }

  //__________________________________________________________________________

  async function addCoursetoUser(req, res) {
    try {
      const admin_id = req.params.admin_id;
      const user_id = req.params.user_id;
      const course_id = req.params.course_id;
      const { notes } = req.body;
  
      const checkUserCourse = await db.query('SELECT * FROM courses_user WHERE user_id = $1 AND course_id = $2', [user_id, course_id]);
  
      if (checkUserCourse.rows.length > 0) {
        res.status(400).json({ message: 'The user is already in this course' });
      } else {
        const result = await db.query('INSERT INTO courses_user(course_id, user_id, admin_id, notes) VALUES($1, $2, $3, $4) RETURNING course_user_id', [course_id, user_id, admin_id, notes]);
        const addedCourseId = result.rows[0].course_user_id;
        res.status(200).json({ message: 'The course has been added to the user successfully', addedCourseId });
      }
    }catch (error) {
          console.error('An error occurred while adding the course for the user', error);
          res.status(500).json({ error: 'An error occurred while adding the course for the user'});
        }
  }
  
  //__________________________________________________________________________

  async function updateCoursetoUser(req, res) {
    try {
      const course_user_id = req.params.course_user_id; 
      const { notes } = req.body;
  
      await db.query('UPDATE courses_user SET notes = $1 WHERE course_user_id = $2', [notes, course_user_id]);
  
      res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
      console.error('An error occurred while updating', error);
      res.status(500).json({ error: 'An error occurred while updating' });
    }
  }

//__________________________________________________________________________

  async function deleteCourseForUser(req, res) {
    try {
      const course_user_id = req.params.course_user_id; // تفاعل مع معرّف السجل الذي تريد حذفه
  
      // حذف السجل من جدول courses_user باستخدام course_user_id
      await db.query('UPDATE courses_user SET deleted = TRUE WHERE course_user_id = $1', [course_user_id]);
  
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error('An error occurred while deleting', error);
      res.status(500).json({ error: 'An error occurred while deleting' });
    }
  }

//__________________________________________________________________________

  async function restoreCourseForUser(req, res) {
    try {
      const course_user_id = req.params.course_user_id; 
  
      await db.query('UPDATE courses_user SET deleted = FALSE WHERE course_user_id = $1', [course_user_id]);
  
      res.status(200).json({ message: 'Restored successfully' });
    } catch (error) {
      console.error('An error occurred while restoring', error);
      res.status(500).json({ error: 'An error occurred while restoring' });
    }
  }

//__________________________________________________________________________


  async function getCoursesForUser(req, res) {
    try {
      const user_id = req.params.user_id;
  
      const result = await db.query(`
        SELECT courses.course_id, courses.course_name,courses_user.notes
        FROM courses_user 
        JOIN courses  ON courses_user.course_id = courses.course_id
        WHERE courses_user.user_id = $1
      `, [user_id]);
  
      const userCourses = result.rows;
      
      res.status(200).json({ userCourses });
    } catch (error) {
      console.error('An error occurred while obtaining courses', error);
      res.status(500).json({ error: 'An error occurred while obtaining courses' });
    }
  }

//__________________________________________________________________________


async function addTasktoUser(req, res) {
  try {
    const user_id = req.params.user_id;
    const task_id = req.params.task_id;
    const admin_id = req.params.admin_id; // قد يحتاج هذا إلى توفيره في الطلب أو قراءته من الجلسة أو أي مكان آخر تعتمد عليه

    const { start_date, end_date, notes } = req.body;

    const result = await db.query(`
      INSERT INTO users_task(user_id, task_id, admin_id, start_date, end_date, notes)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING users_task_id
    `, [user_id, task_id, admin_id, start_date, end_date, notes]);

    const addedTaskId = result.rows[0].users_task_id;
    res.status(200).json({ message: 'تمت إضافة المهمة للمستخدم بنجاح', addedTaskId });
  } catch (error) {
    console.error('حدث خطأ أثناء إضافة المهمة للمستخدم:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة المهمة للمستخدم' });
  }
}




  module.exports = {
    adminCreate,

    SoftdeleteUser,
    RestoreUser,

    GetUsers,
    getUserById,
    GetDeletedUsers,

    getCoursesForUser,


    addCoursetoUser,
    updateCoursetoUser,
    deleteCourseForUser,
    restoreCourseForUser,



    addTasktoUser,
  };
  