const express = require("express");
const paymentController = require("../controllers/paymentController");
const router = express.Router();
const path = require('path');

const bodyparser= require('body-parser')

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));


// router.set('view engine','ejs');
// router.set('views',path.join(__dirname, '../views'));

// router.post("/create-customer",paymentController.createCustomer);
// router.post("/add-card",paymentController.addNewCard);
// router.post("/create-charges",paymentController.createCharges);


router.get('/', paymentController.renderBuyPage);
// router.get('/create-checkout-session', paymentController.payment);
router.get('/success', paymentController.success);
router.get('/failure', paymentController.failure);






module.exports = router;





//------------------------------------------------------------













