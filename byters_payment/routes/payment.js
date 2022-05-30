const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This section will help you get a list of all the documents.
recordRoutes.route("/payments").get(async function (req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("payments")
    .find({}).limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching payments!");
     } else {
        res.json(result);
      }
    });
});

// This section will help you create a new document.
recordRoutes.route("/pyaments/add").post(function (req, res) {
    const dbConnect = dbo.getDb();
    const pDocument = {
      price: Number(req.body.price) ,
      method: req.body.method,
      address: req.body.address,
      cardNumber: Number(req.body.direction)
    };
  
    dbConnect
      .collection("payments")
      .insertOne(pDocument, function (err, result) {
        if (err) {
          res.status(400).send("Error inserting payments!");
        } else {
          console.log(`Added a new payment with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
  });

  // This section will help you update a document by id.
//recordRoutes.route("/payments/update").post(function (req, res) {
  //  const dbConnect = dbo.getDb();
    //const listingQuery = { _id: req.body.id };
    //const updates = {
     // $inc: {
       // likes: 1
      //}
    //};
  
   // dbConnect
     // .collection("listingsAndReviews")
      //.updateOne(listingQuery, updates, function (err, _result) {
       // if (err) {
        //  res.status(400).send(`Error updating likes on listing with id ${listingQuery.id}!`);
        //} else {
         // console.log("1 document updated");
        //}
      //});
  //});

  // This section will help you delete a record.
recordRoutes.route("/payments/delete/:id").delete((req, res) => {
    const dbConnect = dbo.getDb();
    const listingQuery = { _id: req.body._id };
  
    dbConnect
      .collection("payments")
      .deleteOne(listingQuery, function (err, _result) {
        if (err) {
          res.status(400).send(`Error deleting payment with id ${listingQuery.listing_id}!`);
        } else {
          console.log("1 document deleted");
        }
      });
  });