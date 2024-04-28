// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Initialize express app
const app = express();
// Set the server port from environment or use 5000 as default
const port = process.env.PORT || 5000;

// Middleware to enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// MongoDB connection URI from environment variables
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bvaa0x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a new MongoClient instance with server API settings
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Async function to test MongoDB connection
const dbConnect = async () => {
    try {
        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
};
dbConnect();  // Call the dbConnect function to connect to the database

// Define MongoDB collections
const touristSpotCollection = client.db("TravelDB").collection("TouristSpot");
const userCollection = client.db("TravelDB").collection("user");
const countriesCollection = client.db("TravelDB").collection("countries");

// API endpoint to add a new tourist spot
app.post('/touristSpot', async (req, res) => {
    const newSpot = req.body;
    console.log(newSpot);
    const result = await touristSpotCollection.insertOne(newSpot);
    res.send(result);
});

// API endpoint to retrieve all tourist spots
app.get('/touristSpot', async (req, res) => {
    const cursor = touristSpotCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
});

// API endpoint to delete a tourist spot by ID
app.delete('/touristSpot/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await touristSpotCollection.deleteOne(query);
    res.send(result);
});

// API endpoint to add a new user
app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log(newUser);
    const result = await userCollection.insertOne(newUser);
    res.send(result);
});

// API endpoint to retrieve all users
app.get('/users', async (req, res) => {
    const cursor = userCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
});

// API endpoint to add a new country
app.post('/country', async (req, res) => {
    const newCountry = req.body;
    console.log(newCountry);
    const result = await countriesCollection.insertOne(newCountry);
    res.send(result);
});

// API endpoint to retrieve all countries
app.get('/country', async (req, res) => {
    const cursor = countriesCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
});

// Root endpoint to check server status
app.get('/', async (req, res) => {
    res.send('Travel Europe server is running');
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Travel Europe server is running on ${port}`);
});
