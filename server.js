const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const morgan = require('morgan'); // Logging middleware

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Middleware for serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging Middleware
app.use(morgan('dev'));

// CORS Configuration
const corsOptions = {
  origin: [
    'https://frontend-cap-deploy-q58m.vercel.app',
    'https://frontend-cap-deploy-git-37609a-ashish-kumars-projects-51868c6a.vercel.app',
    'https://frontend-cap-deploy-q58m-lytgcf1jp.vercel.app',
    'http://localhost:3000' // For local testing
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests


// JSON Parsing Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Swagger Documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Management API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png)'));
  }
};
const upload = multer({ storage, fileFilter });

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/cars', require('./routes/cars'));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
