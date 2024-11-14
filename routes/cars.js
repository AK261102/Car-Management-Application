const express = require('express');
const multer = require('multer');
const path = require('path');
const Car = require('../models/car');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create a new car
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  const { title, description, tags } = req.body;
  const images = req.files.map(file => `uploads/${file.filename}`);  // Ensure the correct folder

  try {
    const car = new Car({
      userId: req.user._id,
      title,
      description,
      tags,
      images: images.map(imagePath => `${req.protocol}://${req.get('host')}/${imagePath}`),
    });
    await car.save();
    res.send(car);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get a single car by ID
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid car ID');
  }

  try {
    const car = await Car.findById(id);
    if (!car) return res.status(404).send('Car not found');
    
    car.images = car.images.map(imagePath => `${req.protocol}://${req.get('host')}/${imagePath}`);
    res.send(car);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all cars of logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.user._id });
    cars.forEach(car => {
      car.images = car.images.map(imagePath => `${req.protocol}://${req.get('host')}/${imagePath}`);
    });
    res.send(cars);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Search for cars by title
router.get('/search', auth, async (req, res) => {
  const keyword = req.query;

  // Log the incoming keyword for debugging purposes
  console.log('Received keyword:', keyword);

  // Validate keyword
  if (!keyword || keyword.trim() === '') {
    console.log('Invalid search keyword received:', keyword);
    return res.status(400).json({ message: 'Invalid search keyword. Please enter a valid keyword.' });
  }

  try {
    // Find cars by title using case-insensitive search
    const cars = await Car.find({
      userId: req.user._id,
      title: keyword.trim(),
    });

    cars.forEach(car => {
      car.images = car.images.map(imagePath => `${req.protocol}://${req.get('host')}/${imagePath}`);
    });

    console.log('Cars found:', cars);
    return res.status(200).json(cars);
  } catch (err) {
    console.error('Error during car search:', err);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});



// Update car
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  const { title, description, tags } = req.body;
  const images = req.files ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`) : [];

  try {
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { title, description, tags, images } },
      { new: true }
    );
    if (!car) return res.status(404).send('Car not found');
    res.send(car);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete car
router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!car) return res.status(404).send('Car not found');
    res.send('Car deleted');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Log out route
router.post('/logout', auth, async (req, res) => {
  try {
    // Optionally, implement token invalidation logic here (e.g., blacklisting)
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
