
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
// const jwt = require('jsonwebtoken');


const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.00oqpy6.mongodb.net/?retryWrites=true&w=majority";
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.00oqpy6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("summerCampSchool").collection("schoolUser");
    const allClassesCollection = client.db("summerCampSchool").collection("allClasses");


    //..............users related API................................

                //insert user into the database 
    app.post('/users', async (req, res) => {
        const user = req.body;
        const query = { email: user.email }
        const existingUser = await usersCollection.findOne(query);
  
        if (existingUser) {
          return res.send({ message: 'user already exists' })
        }
  
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });
                //get users from database
      app.get('/users', async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
      });

                //make admin 
                app.patch('/users/admin/:id', async (req, res) => {
                    const id = req.params.id;
                    console.log(id);
                    const filter = { _id: new ObjectId(id) };
                    const updateDoc = {
                      $set: {
                        role: 'admin'
                      },
                    };
              
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.send(result);
              
                  })

                //   make instructor
                app.patch('/users/instructor/:id', async (req, res) => {
                    const id = req.params.id;
                    console.log(id);
                    const filter = { _id: new ObjectId(id) };
                    const updateDoc = {
                      $set: {
                        role: 'instructor'
                      },
                    };
              
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.send(result);
              
                  })

                //instructor page data
                const query = { role: 'instructor' };
                app.get('/instructors', async (req, res) => {
                    const result = await usersCollection.find(query).toArray();
                    res.send(result);
                  });

                //user email query
                app.get('/users/check/:email', async (req, res) => {
                  const email = req.params.email;
                  const result = await usersCollection.findOne({ email: email });
                  res.send(result);
                  });

                  // add a class 

                  app.post('/allClasses', async (req, res) => {
                    const newClass = req.body;
                    const result = await allClassesCollection.insertOne(newClass);
                    res.send(result);
                  });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',  (req, res) => {
    console.log(`Simple crud is running on port, ${port}`);
    res.send('school is running');
});

app.listen(port, () => {
    console.log(`assignment 12 is sitting on port  ${port}`);
  })



