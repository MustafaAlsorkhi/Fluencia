// userModel.js

const db = require("../models/db");

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async ( first_name,last_name,email,password ) => {
  const result = await db.query(
    'INSERT INTO users( first_name,last_name,email,password ) VALUES($1, $2, $3,$4) RETURNING *',
    [ first_name,last_name,email,password ]
  );
  return result.rows[0];
};

const checkEmail = async (email) => {
    
  const result = await db.query('SELECT * FROM users WHERE email = $1 ', [
    email,
  ]);
  return result.rows[0];
};
// const checkEmailandPassword = async (email, password) => {
//   const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2 LIMIT 1', [email, password]);
//   return result.rows.length > 0 ? result.rows[0] : null;
// };

//__________________________________________________________________________________________

const updateUser = async ( first_name, last_name, email, password,user_id) => {
    const queryText =
      "UPDATE users SET first_name = $2, last_name = $3, email = $4, password = $5 WHERE user_id = $1";
    const values = [user_id, first_name, last_name, email, password];
    return db.query(queryText, values);
  };


//__________________________________________________________________________________________

  const postOnCourse = async (user_id, course_id, description, url) => {
    const queryText = `
      INSERT INTO post_on_course (course_id, user_id, description, url)
      VALUES ($1, $2, $3, $4)
      RETURNING post_course_id
    `;
    const values = [course_id, user_id, description, url];
    return db.query(queryText, values);
  };
//__________________________________________________________________________________________

  const updatePostOnCourse = async (user_id, post_course_id, description, url) => {
    const queryText = `
      UPDATE post_on_course
      SET description = $1, url = $2
      WHERE post_course_id = $3 AND user_id = $4
      RETURNING post_course_id
    `;
    const values = [description, url, post_course_id, user_id];
    return db.query(queryText, values);
  };
  
//__________________________________________________________________________________________

  const deletePostOnCourse = async (user_id, post_course_id) => {
    const queryText = `
      UPDATE post_on_course
      SET deleted = true
      WHERE post_course_id = $1 AND user_id = $2
      RETURNING post_course_id
    `;
    const values = [post_course_id, user_id];
    return db.query(queryText, values);
  }; 
//__________________________________________________________________________________________

  const getPostsOnCourse = async (user_id) => {
    const queryText = `
      SELECT users.first_name, users.last_name, post_on_course.description, post_on_course.url
      FROM post_on_course 
      JOIN users ON post_on_course.user_id = users.user_id
      WHERE post_on_course.user_id = $1 AND post_on_course.deleted = false
    `;
    const values = [user_id];
    return db.query(queryText, values);
  }; 

//__________________________________________________________________________________________

const getAllPostsOnCourse = async (course_id) => {
  const queryText = `
    SELECT users.first_name, users.last_name, post_on_course.description, post_on_course.url
    FROM post_on_course 
    JOIN users ON post_on_course.user_id = users.user_id
    WHERE post_on_course.course_id = $1 AND post_on_course.deleted = false
  `;
  const values = [course_id];
  return db.query(queryText, values);
};


module.exports = {
  findByEmail,
  createUser,
  checkEmail,
  updateUser,
  postOnCourse,
  deletePostOnCourse,
  updatePostOnCourse,
  getPostsOnCourse,
  getAllPostsOnCourse
};