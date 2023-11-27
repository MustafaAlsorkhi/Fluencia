// // require("dotenv").config();

// // const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

// // const stripe = require('stripe')(STRIPE_SECRET_KEY)

// // const createCustomer = async(req,res)=>{
// //     console.log("dfghjkl;lkjhgf")

// //     try {

// //         const customer = await stripe.customers.create({
// //             name:req.body.name,
// //             email:req.body.email,
// //         });
// //         console.log(customer)

// //         res.status(200).send(customer);
// //     } catch (error) {
// //         res.status(400).send({success:false,msg:error.message});
// //         console.log("dfghjkl;lkjhgf")

// //     }

// // }
    
// // const addNewCard = async(req,res)=>{

// //     try {

// //         const {
// //             customer_id,
// //             card_Name,
// //             card_ExpYear,
// //             card_ExpMonth,
// //             card_Number,
// //             card_CVC,
// //         } = req.body;

// //         const card_token = await stripe.tokens.create({
// //             card:{
// //                 name: card_Name,
// //                 number: card_Number,
// //                 exp_year: card_ExpYear,
// //                 exp_month: card_ExpMonth,
// //                 cvc: card_CVC
// //             }
// //         });

// //         const card = await stripe.customers.createSource(customer_id, {
// //             source: `${card_token.id}`
// //         });

// //         res.status(200).send({ card: card.id });

// //     } catch (error) {
// //         res.status(400).send({success:false,msg:error.message});
// //     }

// // }




// // const createCharges = async(req,res)=>{

// //     try {

// //         const createCharge = await stripe.charges.create({
// //             receipt_email: 'tester@gmail.com',
// //             amount: parseInt(req.body.amount)*100, //amount*100
// //             currency:'INR',
// //             card: req.body.card_id,
// //             customer: req.body.customer_id
// //         });

// //         res.status(200).send(createCharge);

// //     } catch (error) {
// //         res.status(400).send({success:false,msg:error.message});
// //     }

// // }


// // module.exports = {
// //     createCustomer,
// //     addNewCard,
// //     createCharges
// // }









const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY} = process.env;
const Stripe = require('stripe');

// // const stripe = require('stripe')(STRIPE_SECRET_KEY)
// // const stripe = Stripe(process.env.STRIPE_SECRET_KEY,process.env.STRIPE_PUBLISHABLE_KEY);

 
const renderBuyPage = async(req,res)=>{

    try {
        
        res.render('buy', {
            key: STRIPE_PUBLISHABLE_KEY,
            amount:25
         })

    } catch (error) {
        console.log(error.message);
    }

}

const payment = async(req,res)=>{

    try {

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Sandeep Sharma',
        address: {
            line1: '115, Vikas Nagar',
            postal_code: '281001',
            city: 'Mathura',
            state: 'Uttar Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: req.body.amount,     // amount will be amount*100
            description: req.body.productName,
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.redirect("/success")
    })
    .catch((err) => {
        res.redirect("/failure")
    });


    } catch (error) {
        console.log(error.message);
    }

}

const success = async(req,res)=>{

    try {
        
        res.render('success');

    } catch (error) {
        console.log(error.message);
    }

}

const failure = async(req,res)=>{

    try {
        
        res.render('failure');

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    renderBuyPage,
    payment,
    success,
    failure
}


















// const Stripe = require('stripe')
// require("dotenv").config();

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
// const payment= async (req, res) => {
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//             price_data: {
//                 currency: "usd",
//                 product_data: {
//                   name: "T_shirt",
//                 },
//                 unit_amount:2000,
//             },
//                 quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/checkout-success`,
//     cancel_url: `${process.env.CLIENT_URL}/cart`,
//     });
  
//     res.send({ url: session.url });
//   };







// module.exports = {
 
//     payment,
   
// }


