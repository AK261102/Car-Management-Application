const express = require('express');
const multer = require('multer');
const Car = require('../models/car');
const auth = require('../middleware/auth');

const router = express.Router();

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Create a new car
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  const { title, description, tags } = req.body;
  const images = req.files.map(file => file.path);

  try {
    const car = new Car({
      userId: req.user._id,
      title,
      description,
      tags,
      images
    });
    await car.save();
    res.send(car);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all cars of logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.user._id });
    res.send(cars);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Search for cars
router.get('/search', auth, async (req, res) => {
  const { keyword } = req.query;
  try {
    const cars = await Car.find({
      userId: req.user._id,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.send(cars);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update car
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  const { title, description, tags } = req.body;
  const images = req.files.map(file => file.path);

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

module.exports = router;
