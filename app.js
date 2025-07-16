const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Global variable
app.locals.authUser = '';

// Set static pages
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Template Engine
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
app.use(authRoutes);
app.use(taskRoutes);

// MongoDB Connection
const DB_URI = process.env.MONGO_ATLAST_URI;
if (!DB_URI) {
  console.error("❌ Mongo URI not found. Please set MONGO_ATLAST_URI in .env");
  process.exit(1);
}

mongoose.connect(DB_URI)
  .then(() => {
    console.log("✅ MongoDB connected.");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

// Optional: fallback 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});
