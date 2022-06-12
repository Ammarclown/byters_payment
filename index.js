require('dotenv').config();
const express = require('express');
const axios = require('axios');
//const { MongoClient } = require('./mongo');
const req = require('express/lib/request');
var bodyParser = require('body-parser')
//const cors= require('cors');
const { header } = require('express/lib/request');
const port=3000 
const app = express();
//var whitelist = ['http://example1.com', 'http://example2.com']


const stripe= require('stripe')('sk_test_51L2vu2FhZzaRvloxWe1usDutRKmio1kpgOIkRMZA2501HbOBg2OdKd7XnuYesH8V1WUSf1Un3LeW9eVdU1a9xnnN00HDr5xCei')
app.use(express.json())
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   // Pass to next layer of middleware
//   next();
// });
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.get('/', async (req,res) => {
  // console.log(stripe)
   //const db = await MongoClient();
   //if (!db) res.status(500).send('Systems Unavailable');
   //console.log(stripe)
   //const { data } = await axios.get('');
   //await db.collection('myFirstDatabase').insertOne(data);
   //return res.send(data);
   const session = await stripe.checkout.sessions.create({
     line_items: [
       {
         price_data: {
           currency: 'usd',
           product_data: {
             name: "eggs",
           },
           unit_amount: (5*40*20),
         },
         quantity: 5,
       },]
     ,
     mode: 'payment',
     success_url: 'https://byters-shipping-microservice.vercel.app/shipments/4/',
     cancel_url: 'http://localhost:3000/error/',
   });
   res.redirect(session.url)
 });

 
app.post('/payment',async (req,res) => {
    // try{
    //   const email=req.body.email
    //   const charge= await stripe.charges.create({
    //     amount: req.body.amount,
    //     currency:'usd',
    //     source:'tok_mastercard',
    //     description: 'Rabbit checkout'
    //   });
    //   return res.status(200).json({
    //     success: true,
    //     message:'payment successfull',
    //     id: charge.id,
    //    notification: await axios.post("",{
    //     email,
    //     text:"payment successfull"
    //    })
    //   });
    // }catch(error){
    //   console.log("Error",error)
    //   return res.status(200).json({
    //     success:false,
    //     message:'payment failed'
    //   })
    // }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: req.body.name,
            },
            unit_amount: (req.body.quantity*req.body.unit_amount*20),
          },
          quantity: req.body.quantity,
        },]
      ,
      mode: 'payment',
      success_url: 'https://byters-shipping-microservice.vercel.app/shipments/4',
      cancel_url: 'http://localhost:3000/error/',
    });
    
   // res.redirect(session.url)
res.json({url: session.url})
  });

app.get('/trial', async (req,res) => {
  // console.log(stripe)
   //const db = await MongoClient();
   //if (!db) res.status(500).send('Systems Unavailable');
   //console.log(stripe)
   //const { data } = await axios.get('');
   //await db.collection('myFirstDatabase').insertOne(data);
   //return res.send(data);
   return res.send("success")
 });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});    