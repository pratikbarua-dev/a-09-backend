const express = require("express");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Database Setup
const client = new mongodb.MongoClient(process.env.MONGODB_URI);
const database = client.db("doctorsapp");
const doctorsCollection = database.collection("doctors");
const appointmentsCollection = database.collection("appointements");

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

connectDB();

// Routes — Doctors
app.get("/doctors", async (req, res) => {
  const allDoctors = await doctorsCollection.find({}).toArray();
  res.send(allDoctors);
});

app.get("/doctors/:id", async (req, res) => {
  const id = req.params.id;
  const doctor = await doctorsCollection.findOne({
    _id: new mongodb.ObjectId(id),
  });
  res.send(doctor);
});

// Routes — Appointments
app.get("/appointments", async (req, res) => {
  const allAppointments = await appointmentsCollection.find({}).toArray();
  res.send(allAppointments);
});

app.post("/appointments", async (req, res) => {
  const appointment = req.body;
  const result = await appointmentsCollection.insertOne(appointment);
  res.send(result);
});

app.delete("/appointments/:id", async (req, res) => {
  const id = req.params.id;
  const result = await appointmentsCollection.deleteOne({
    _id: new mongodb.ObjectId(id),
  });
  res.send(result);
});

app.patch("/appointments/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await appointmentsCollection.updateOne(
    { _id: new mongodb.ObjectId(id) },
    { $set: updatedData }
  );
  res.send(result);
});

// Health Check
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
