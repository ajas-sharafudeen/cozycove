const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'hwsrdfserwwdf36g';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
}

app.get('/test', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json('test successful');
});

app.post('/register', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email: userDoc.email,
        id: userDoc._id,
      }, jwtSecret, {}, (err, token) => {
        if (err) return res.status(500).json('Failed to sign token');
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('Password is incorrect');
    }
  } else {
    res.status(404).json('User not found');
  }
});

app.get('/profile', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, async (err, userData) => {
      if (err) return res.status(401).json('Unauthorized');
      try {
        const { name, email, _id } = await User.findById(userData.id);
        res.json({ name, email, _id });
      } catch (e) {
        res.status(500).json('Failed to fetch user data');
      }
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  try {
    await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + newName
    });
    res.json(newName);
  } catch (e) {
    res.status(500).json('Failed to download image');
  }
});

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/', ''));
  }
  res.json(uploadedFiles);
});

app.post('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    title, address, photos,
    description, perks, extraInfo,
    checkIn, checkOut, maxGuests, price
  } = req.body;
  try {
    const userData = await getUserDataFromReq(req);
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos,
      description, perks, extraInfo,
      checkIn, checkOut, maxGuests, price,
    });
    res.json(placeDoc);
  } catch (e) {
    res.status(500).json('Failed to create place');
  }
});

app.get('/user-places', async (req, res) => {
  const { token } = req.cookies;
  try {
    const userData = await getUserDataFromReq(req);
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  } catch (e) {
    res.status(500).json('Failed to fetch user places');
  }
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    res.json(place);
  } catch (e) {
    res.status(500).json('Failed to fetch place');
  }
});

app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    id, title, address, photos,
    description, perks, extraInfo,
    checkIn, checkOut, maxGuests, price
  } = req.body;


  try {
    const userData = await getUserDataFromReq(req);
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests, price,
      });
      await placeDoc.save();
      res.json('ok');
    } else {
      res.status(403).json('Unauthorized');
    }
  } catch (e) {
    res.status(500).json('Failed to update place');
  }
});

app.get('/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (e) {
    res.status(500).json('Failed to fetch places');
  }
});

app.post('/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      place, checkIn, checkOut, numberOfGuests,
      name, phone, price
    } = req.body;
    const booking = await Booking.create({
      place, checkIn, checkOut, numberOfGuests,
      name, phone, price, user: userData.id
    });
    res.json(booking);
  } catch (e) {
    res.status(500).json('Failed to create booking');
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    res.json(bookings);
  } catch (e) {
    res.status(500).json('Failed to fetch bookings');
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
