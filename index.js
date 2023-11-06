const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
/* app.use(cors());
app.use(express.json());
app.use(cookieParser()); */
// medalwore
app.use(cors());
app.use(express.json());
// satup the mongodb in the server site

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wjgws1x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // todo : deploy korar somay commint kore dita hove nicer code gulo
    //  await client.connect();
    //  await client.db("admin").command({ ping: 1 });

    // start the mongodb code
    await client.connect();
    // Send a ping to confirm a successful connection
    const catagoryCollection = client.db("appliction_job").collection("catagory");
    const myBidsCollection = client.db("appliction_job").collection("My_Bids");

    // catagory collection code start
    app.get("/catagory/:type", async (req, res) => {
      try {
        const type = req.params.type;
        const filter = { type: type };
        const result = await catagoryCollection.find(filter).toArray();
        res.send(result);
      } catch {
        (error) => {
          res.status(500).send("Internal Server Error");
        };
      }
    });
    app.get("/catagorys/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await catagoryCollection.findOne(filter);
        res.send(result);
      } catch {
        (error) => {
          res.status(500).send("Internal Server Error");
        };
      }
    });
    
    app.get('/catagory', async(req, res) =>{
      try {
        const query = req.query.email;
        const filter = {email: query}
        const result = await catagoryCollection.find(filter).toArray();
        res.send(result)
      } catch {
        (error) => {
          res.status(500).send("Internal Server Error");
        };
      }
    })
    // updated my post job 
    app.put('/catagory/updated', async(req, res) =>{
      try {
        const id = req.query.id;
        const filter = {_id: new ObjectId(id)}
        const body = req.body;
        const updateDoc = {
          $set: {
            job_title:body.job_title,
            email:body.email,
            deadline:body.deadline,
            description: body.description,
            category: body.category,
            type: body.type,
            minimum_price: body.minimum_price,
            maximum_price: body.maximum_price,
          },
        };
        const result = await catagoryCollection.updateOne(filter, updateDoc);
        res.send(result)
      } catch {
        (error) => {
          res.status(500).send("Internal Server Error");
        };
      }
    })
    // delete my job 
    app.delete('/catagory/delete', async(req, res) =>{
      try {
        const id = req.query.id;
        const filter = {_id: new ObjectId(id)}
        const result = await catagoryCollection.deleteOne(filter);
        res.send(result) 
      } catch {
        (error) => {
          res.status(500).send("Internal Server Error");
        };
      }
    })
    // added the job post
    app.post('/catagory', async(req, res) =>{
      try {
        const body = req.body;
        const result = await catagoryCollection.insertOne(body);
        res.send(result);
      } catch {
        (error) => {
          res.status(500).send("Internal Server Error");
        };
      }
    })
    // catagory collection code end

    // my bids collection code start
    app.get('/myBids', async(req, res)=>{
      try {
        const result = await myBidsCollection.find().toArray()
        res.send(result)
      } catch {
        (error) => {
          res.status(500).send("Internal Server Error");
        };
      }
    })
    app.post('/myBids', async(req, res) =>{
      try {
        const body = req.body;
        const result = await myBidsCollection.insertOne(body);
        res.send(result);
      } catch {
        (error) => {
          res.status(500).send("Internal Server Error");
        };
      }
    })
    // my bids collection code end
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// start the server site in the port
app.get("/", async (req, res) => {
  res.send("start the assignament 11 projact");
});
app.listen(port, () => {
  console.log(`server site run the port ${port}`);
});
