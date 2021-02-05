const express = require('express')
require('dotenv').config()
require('mongodb')
const cors = require('cors');
const bodyParser = require('body-parser')
const objectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3vod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const port = 5000;


const app = express()


app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})


client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  console.log("Database Connected Successfully!!!")

  // post data to the database

  app.post('/add-product', (req, res) => {
    const product = req.body;
    console.log(product)
    productsCollection.insertOne(product)
      .then(result => {
        // console.log(result.insertedCount)
        res.send(result.insertedCount)
      })
  })


  // receive data from the database

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  // receive single data from database

  app.get('/products/:id', (req, res) => {
    productsCollection.find({ _id: objectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  // update data 

  app.patch('/update/:id', (req, res) => {
    console.log(req.body.price)
    productsCollection.updateOne({ _id: objectId(req.params.id) },
      {
        $set: { name: req.body.name, price: req.body.price, expiry: req.body.expiry }
      })
      .then(result => {
        // res.send("updated successfully!!!")
        res.send(result.modifiedCount > 0)
      })
  })

  // delete Data

  app.delete('/delete/:id', (req, res) => {
    // console.log(req.params.id)

    productsCollection.deleteOne({ _id: objectId(req.params.id) })
      .then(result => {
        // console.log(result)

        res.send(result.deletedCount > 0)
        // res.redirect('/')
      })
  })
});
app.listen(process.env.PORT || port)