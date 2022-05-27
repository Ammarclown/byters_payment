require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { mongoClient } = require('./mongo');
const req = require('express/lib/request');

const app = express();
app.use(express.json());

const stripe= require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([[
  1,{priceInCents:10000, name:'Pantene shampoo'}],
  [2, {priceInCents:20000, name:'coffee'}]
])

app.post('/create-checkout-session',async (req,res) => {
  try{
const session =await stripe.checkout.sessions.create({
payment_method_types:['card'],
mode:'payment',
line_items:req.body.items.map(item => {
  const storeItems= storeItems.get(item.id)
  return{
    price_data:{
      currency: 'usd',
      product_data:{
        name:storeItems.name
      },
      unit_amount: storeItems.priceInCents
    },
    quantity:item.quantity,
  }
}),
success_url:`${process.env.SERVER_URL}/success.html`,
cancel_url:`${process.env.SERVER_URL}/cancel.html`
})
res.json({url: session.url})
  }catch(e){
    res.status(500).json({error: e.message})
  }
 
})
app.get('/', async (req,res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send('Systems Unavailable');

  const { data } = await axios.get('https://goweather.herokuapp.com/weather/california');
  await db.collection('myFirstDatabase').insertOne(data);

  return res.send(data);
});

app.listen(3000);
