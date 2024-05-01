// index.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to your API");
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pm1hwnw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("projectNexusDashboard"); // Specify the database name
    const projectCollection = database.collection("projects");
    const taskCollection = database.collection("tasks");

    app.get("/projects", async (req, res) => {
      try {
        const cursor = projectCollection.find({}).sort({ _id: -1 }); // Sort by _id in descending order
        const projects = await cursor.toArray();
        res.send(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    const { ObjectId } = require("mongodb");

    app.get("/project/:id", async (req, res) => {
      const projectId = req.params.id;

      // Validate the format of projectId
      if (!ObjectId.isValid(projectId)) {
        return res.status(400).json({ error: "Invalid project ID format" });
      }

      const projectObjectId = new ObjectId(projectId);
      const project = await projectCollection.findOne({
        _id: projectObjectId,
      });

      res.send(project);
    });

    app.post("/projects", async (req, res) => {
      const project = req.body;
      try {
        const result = await projectCollection.insertOne(project);
        res.send(result);
      } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.delete("/projects/:id", async (req, res) => {
      const projectId = req.params.id;
      const projectObjectId = new ObjectId(projectId);

      // Delete the project from the database using the ObjectId
      const result = await projectCollection.deleteOne({
        _id: projectObjectId,
      });
      res.send(result);
    });

    app.patch("/projects/:id", async (req, res) => {
      const projectId = req.params.id;
      const project = req.body;
      const projectObjectId = new ObjectId(projectId);
      const result = await projectCollection.updateOne(
        { _id: projectObjectId },
        { $set: project }
      );
      res.send(result);
    });

    app.get("/tasks", async (req, res) => {
      try {
        const cursor = taskCollection.find({}).sort({ _id: -1 }); // Sort by _id in descending order
        const tasks = await cursor.toArray();
        res.send(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      try {
        const result = await taskCollection.insertOne(task);
        res.send(result);
      } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.delete("/task/:id", async (req, res) => {
      const taskId = req.params.id;
      const taskObjectId = new ObjectId(taskId);

      // Delete the project from the database using the ObjectId
      const result = await taskCollection.deleteOne({
        _id: taskObjectId,
      });
      res.send(result);
    });
    app.patch("/task/:id", async (req, res) => {
      const taskId = req.params.id;
      const task = req.body;
      const taskObjectId = new ObjectId(taskId);
      const result = await taskCollection.updateOne(
        { _id: taskObjectId },
        { $set: task }
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
