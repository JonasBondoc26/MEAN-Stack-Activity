const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());

const CONNECTION_STRING = "mongodb://localhost:27017";
const DATABASENAME = "MyDb";
let database;

console.log("Starting API...");
console.log("Connecting to MongoDB...");

// Connect to MongoDB
async function start() {
  try {
    const client = new MongoClient(CONNECTION_STRING, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    database = client.db(DATABASENAME);

    console.log("Yay! Now connected to Cluster");
    
    app.listen(5038, () => {
      console.log("Server running at http://localhost:5038");
    });

  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  }
}

start();


// =============================
// ROUTES
// =============================

// Get All Books
app.get("/api/books/GetBooks", async (req, res) => {
  try {
    const result = await database.collection("Books").find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});


// Get Book By ID
app.get("/api/books/GetBookById", async (req, res) => {
  try {
    const result = await database.collection("Books")
      .findOne({ id: req.query.id });

    res.json(result);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});


// Add Book
app.post("/api/books/AddBook", multer().none(), async (req, res) => {
  try {

    await database.collection("Books").insertOne({
      id: new Date().getTime().toString(), // unique ID
      title: req.body.title,
      desc: req.body.description,
      price: Number(req.body.price) || 0,
      author: req.body.author,
      genre: req.body.genre
    });

    res.json("Added Successfully!");

  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
});


// Update Book
app.put("/api/books/UpdateBook", multer().none(), async (req, res) => {
  try {

    await database.collection("Books").updateOne(
      { id: req.body.id },
      {
        $set: {
          title: req.body.title,
          desc: req.body.description,
          price: Number(req.body.price) || 0,
          author: req.body.author,
          genre: req.body.genre
        }
      }
    );

    res.json("Updated Successfully!");

  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
});


// Delete Book
app.delete("/api/books/DeleteBook", async (req, res) => {
  try {

    await database.collection("Books")
      .deleteOne({ id: req.query.id });

    res.json("Deleted Successfully!");

  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});