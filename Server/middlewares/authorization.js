const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authorize(req, res, next) {
  try {
    const token = req.cookies.token; // Corrected from res.cookies.token to req.cookies.token
    if (token == null) {
      res.clearCookie("token");
      return res.status(401).json("You need to login first");
    } else {
      const user = jwt.verify(token, process.env.SECRET_KEY);
      if (!user.id) {
        return res.status(401).json("Unauthorized");
      }
      req.user = user;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}

module.exports = {
  authorize,
};
