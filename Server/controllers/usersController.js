const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const UserModel = require('../models/userModel');
// const cookies = require("js-cookie");


const signup = async (req, res) => {
  const {  first_name,last_name,email,password } = req.body;

  try {
    // Check if email is already taken
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const schema = joi.object({
              first_name: joi.string().alphanum().min(3).max(20).required(),
              last_name: joi.string().alphanum().min(3).max(20).required(),
            email: joi
              .string()
              .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
              .required(),
            password: joi
              .string()
              .pattern(
                new RegExp(
                  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&^#]{6,30}$"
                )
              )
          });
          const validate = schema.validate({
              first_name,
              last_name,
            email,
            password,
          });
          if (validate.error) {
            res.status(405).json({ error: validate.error.details });
          }
          else{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser( first_name,last_name,email,hashedPassword );

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  }
 }
 catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//____________________________________________________________________________________________________


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
     const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.checkEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }
   const storedHashedPassword = hashedPassword;
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);
    if (!passwordMatch) {
      res.status(400).json({ message: "Email or password is invalid" });
      return;
  }

    // Include user information in the token payload
    const payload = {
       user_id: user.user_id,
      email: user.email,
    };

    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });

    res.status(200).json({
      message: 'User signed in successfully',
      token: token,
      user_id: user.user_id,
    });
    console.log(token);
    console.log(user.user_id);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



//_______________________________________________________________________________________________

const updateUser = async (req, res) => {
  const user_id = req.params.id;
  const { first_name, last_name, email, password } = req.body;

  try {
    const schema = joi.object({
      first_name: joi.string().alphanum().min(3).max(20).required(),
      last_name: joi.string().alphanum().min(3).max(20).required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&^#]{6,30}$"
          )
        ),
    });

    const { error } = schema.validate({
      first_name,
      last_name,
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const result = await UserModel.updateUser(user_id, first_name, last_name, email, hashedPassword);

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Update user failed" });
  }
};


module.exports = {
  signup,
  login,
  updateUser,
};
