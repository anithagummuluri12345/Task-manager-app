const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config(); // This works only locally

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Global variable
app.locals.authUser = '';

// === MongoDB Connection ===
const DB_URI = process.env.MONGO_ATLAST_URI;

console.log("MONGO URI from env:", DB_URI);

if (!DB_URI) {
  throw new Error("❌ MONGO_ATLAST_URI is not defined. Check your environment variables.");
}

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((error) => {
  console.error("❌ MongoDB connection error:", error.message);
  process.exit(1);
});

// Static files
app.use(express.static(path.join(__dirname, './public')));

// Template engine
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
app.use(authRoutes);
app.use(taskRoutes);

// Fallback route
app.get('*', (req, res) => {
  res.redirect('/login');
});
