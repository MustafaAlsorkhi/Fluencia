const express = require("express");
const userController = require("../controllers/usersController");
const router = express.Router();

 const verify= require('../middlewares/verify')

router.post("/signup",userController.signup);
router.post("/login",verify.verifyJWT,userController.login );
router.put("/updateUser/:id",userController.updateUser );



module.exports = router;