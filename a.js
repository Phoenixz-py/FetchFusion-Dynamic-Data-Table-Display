// Import dependencies
const express = require("express");
const crossFetch = require("cross-fetch");
const mongoose = require("mongoose");
const openurl = require("openurl");
const cors = require("cors");
// Create Express application
const app = express();
app.use(cors());
// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const resultSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Result = mongoose.model("Result", resultSchema);

// Add this code to fetch results from WazirX API and insert them into MongoDB
app.get("/fetch-results", async (req, res) => {
  try {
    const response = await crossFetch("https://api.wazirx.com/api/v2/tickers");
    const data = await response.json();

    console.log("Data received:", data);

    const markets = Object.keys(data);
    console.log("Markets:", markets);

    const topResults = markets.slice(0, 10).map((market) => ({
      name: market,
      last: data[market].last,
      buy: data[market].buy,
      sell: data[market].sell,
      volume: data[market].volume,
      base_unit: data[market].base_unit,
    }));

    console.log("Top Results:", topResults);

    // Insert new results into MongoDB
    const insertResult = await Result.insertMany(topResults);

    console.log("Data inserted successfully:", insertResult);

    // Get results collection
    const results = await Result.find();
    console.log("HIOSDSAD")
    // Display results collection
    res.json(results);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching results.");
  }
});
// Route to get stored data from the database
app.get("/results", async (req, res) => {
  try {
    // Fetch results from MongoDB
    const results = await Result.find();

    // Send the results as a JSON response
    res.json(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching results.");
  }
});


// Start the Express server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

openurl.open("http://localhost:3000/fetch-results");

