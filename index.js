const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.utzce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("travelAgency");
    const planCollection = database.collection("plans");
    const bookingCollection = client.db("travelAgency").collection("bookings");
    //GET API
    app.get("/plans", async (req, res) => {
      const cursor = planCollection.find({});
      const plans = await cursor.toArray();
      res.send(plans);
    });
    //POST API
    app.post("/addPlan", async (req, res) => {
      const plan = req.body;
      const result = await planCollection.insertOne(plan);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //GET booking
    app.get("/booking/:email", async (req, res) => {
      // console.log(req.params.email);
      const result = await bookingCollection
        .find({ email: req.params.email })
        .toArray();
      res.json(result);
    });

    //POST addBooking
    app.post("/addBooking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking).toArray();
      res.send(result);
    });

    //delete
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Travel Agency");
});

app.listen(port, () => {
  console.log("running on port", port);
});
