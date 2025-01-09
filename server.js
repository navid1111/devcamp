// server.js

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const bootcampRoutes = require('./routes/bootcamps');
const errorHandler = require('./middleware/error');
const asyncHandler = require('./middleware/async');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();
// Body parser


// Middleware to parse JSON bodies
app.use(express.json());


// Logging middleware (use morgan in development mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use(asyncHandler)

app.use(errorHandler);

// Custom error handler middleware


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
