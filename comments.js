// Create web server  
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const uri =
  "mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("commentsDB");
    const commentsCollection = database.collection("comments");

    // Create a comment
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      const result = await commentsCollection.insertOne(comment);
      res.status(201).json(result);
    });

    // Get all comments
    app.get("/comments", async (req, res) => {
      const cursor = commentsCollection.find({});
      const comments = await cursor.toArray();
      res.status(200).json(comments);
    });

    // Update a comment
    app.put("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const updatedComment = req.body;
      const result = await commentsCollection.updateOne(
        { _id: id },
        { $set: updatedComment }
      );
      res.status(200).json(result);
    });

    // Delete a comment
    app.delete("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const result = await commentsCollection.deleteOne({ _id: id });
      res.status(200).json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
