const express = require("express");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("node:dns");
const { createRemoteJWKSet, jwtVerify } = require("jose");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const app = express();
const port = 5000;

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────
app.use(cors({ origin: "https://a-09-frontend.vercel.app", credentials: true }));
app.use(express.json());

// ──────────────────────────────────────────────
// Database Setup
// ──────────────────────────────────────────────
const client = new mongodb.MongoClient(process.env.MONGODB_URI);

// Main app database
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

// ──────────────────────────────────────────────
// JWT Verification (via Better Auth JWKS)
// ──────────────────────────────────────────────
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const JWKS = createRemoteJWKSet(new URL(`${BETTER_AUTH_URL}/api/auth/jwks`));

// Reusable auth middleware — verifies JWT and attaches req.user
const requireAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.substring(7);

    // Verify JWT against Better Auth's JWKS public keys
    const { payload } = await jwtVerify(token, JWKS);

    // Attach decoded user info from JWT payload to request
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      image: payload.image,
      ...payload,
    };

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    if (error.code === "ERR_JWT_EXPIRED") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }

    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// ──────────────────────────────────────────────
// Routes — Auth / Profile
// ──────────────────────────────────────────────
app.get("/users/me", requireAuth, (req, res) => {
  res.status(200).json(req.user);
});

app.get("/profile", requireAuth, (req, res) => {
  res.status(200).json(req.user);
});

// ──────────────────────────────────────────────
// Routes — Doctors
// ──────────────────────────────────────────────
app.get("/doctors", async (req, res) => {
  const allDoctors = await doctorsCollection.find({}).toArray();
  res.send(allDoctors);
});

app.get("/doctors/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const doctor = await doctorsCollection.findOne({
    _id: new mongodb.ObjectId(id),
  });
  res.send(doctor);
});

// ──────────────────────────────────────────────
// Routes — Appointments (user-scoped)
// ──────────────────────────────────────────────
app.get("/appointments", requireAuth, async (req, res) => {
  const userAppointments = await appointmentsCollection
    .find({ userId: req.user.id })
    .toArray();
  res.send(userAppointments);
});

app.post("/appointments", requireAuth, async (req, res) => {
  const appointment = {
    ...req.body,
    userId: req.user.id,
  };
  const result = await appointmentsCollection.insertOne(appointment);
  res.send(result);
});

app.delete("/appointments/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const result = await appointmentsCollection.deleteOne({
    _id: new mongodb.ObjectId(id),
    userId: req.user.id,
  });
  res.send(result);
});

app.patch("/appointments/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await appointmentsCollection.updateOne(
    { _id: new mongodb.ObjectId(id), userId: req.user.id },
    { $set: updatedData }
  );
  res.send(result);
});

// ──────────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────────
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// ──────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
