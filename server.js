// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Check your Mongo URI
console.log("MONGO_URI from .env:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Basic route
app.get('/', (req, res) => {
  res.send("Skill Swap Backend Running");
});

// Routes
const userRoutes = require('./routes/user');
const skillRoutes = require('./routes/skills');
const swapRoutes = require('./routes/swaps');

app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/swaps', swapRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
