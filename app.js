const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Global variable
app.locals.authUser = '';

// MongoDB connection
const DB_URI = process.env.MONGO_ATLAST_URI;
if (!DB_URI) {
console.error('❌ Missing Mongo URI! Add MONGO_ATLAST_URI to your .env file.');
process.exit(1);
}

mongoose.connect(DB_URI)
.then(() => {
console.log('✅ MongoDB connected');
app.listen(PORT, () => {
console.log(🚀 Server running on port ${PORT});
});
})
.catch(err => {
console.error('❌ MongoDB connection failed:', err.message);
process.exit(1);
});

// Set public directory for static files
const publicDirectory = path.join(__dirname, 'public');
app.use(express.static(publicDirectory));

// Template engine setup
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use(authRoutes);
app.use(taskRoutes);

// Fallback route
app.get('*', (req, res) => {
res.redirect('/login');
});
