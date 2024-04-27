require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// connect to mongo db 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bvaa0x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbConnect = async () => {
    try {
        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error)

    }
}
dbConnect()

const touristSpotCollection = client.db("TravelDB").collection("TouristSpot")
const userCollection = client.db("TravelDB").collection("user")


// TouristSpot related api

app.post('/touristSpot', async (req, res) => {
    const newSpot = req.body;
    console.log(newSpot);
    const result = await touristSpotCollection.insertOne(newSpot)
    res.send(result)
})

app.get('/touristSpot', async (req, res) => {
    const find = touristSpotCollection.find()
    const result = await find.toArray()
    res.send(result)
})



// user related api

app.post('/users', async (req, res) => {
    const newUser = req.body
    console.log(newUser);
    const result = await userCollection.insertOne(newUser)
    res.send(result)
})

app.get('/users', async (req, res) => {
    const findUser = userCollection.find()
    const result = await findUser.toArray()
    res.send(result)
})






app.get('/', async (req, res) => {
    res.send('Travel Europe server in running')
})

app.listen(port, () => {
    console.log((`Travel Europe server in running on ${port}`));
})