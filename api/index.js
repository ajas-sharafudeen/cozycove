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
const cloudinary = require('cloudinary').v2;
const port = process.env.PORT || 4000;

require('dotenv').config();
const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'hwsrdfserwwdf36g';
mongoose.connect(process.env.MONGO_URL);
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
}));

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
}

app.get('/test', (req, res) => {
  res.json('test successful');
});

app.post('/register', async (req, res) => {
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

app.get('/profile', (req, res) => {
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
  const tempPath = '/tmp/' + newName;
  try {

    // Download the image to a temporary location
    await imageDownloader.image({
      url: link,
      dest: tempPath
    });

    // Upload the downloaded image to Cloudinary
    const result = await cloudinary.uploader
      .upload(tempPath, {
        resource_type: 'auto',
        public_id: `booking-app/${newName}`,
        overwrite: true,
      });
    console.log(tempPath);
    // Delete the temporary file
    fs.unlinkSync(tempPath);
    // Return the Cloudinary URL of the uploaded image
    res.json(result.secure_url);
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to download or upload image using link');
  }
});

const photosMiddleware = multer({ dest: '/tmp' })
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  try {
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];

      // Upload each file to Cloudinary
      const result = await cloudinary.uploader
        .upload(path, {
          resource_type: 'auto',
          public_id: `booking-app/${originalname}`,
          overwrite: true,
        });

      // Add the URL to the list of uploaded files
      uploadedFiles.push(result.secure_url);

      // Delete the temporary file
      fs.unlinkSync(path);
    }

    // Respond with the list of uploaded file URLs
    res.json(uploadedFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload images from device' });
  }
});

app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const {
    title, address, photos,
    description, perks, extraInfo,
    checkIn, checkOut, maxGuests, price
  } = req.body;
  // new code
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    try {
      // const userData = await getUserDataFromReq(req);
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
  })
});

app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  // new code
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    id, title, address, photos,
    description, perks, extraInfo,
    checkIn, checkOut, maxGuests, price
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
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
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
  } = req.body;
  Booking.create({
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
    user: userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
