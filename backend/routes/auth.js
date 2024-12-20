const express = require('express');
const User = require('../models/user');
const Seller = require('../models/seller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Secret key for JWT signing and verification
const JWT_SECRET = 'your-secret-key'; 

// Signup route for User
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const userId = require('crypto').randomBytes(8).toString('hex'); // Generate unique user ID
    const hashedPassword = password;
    const user = new User({ name, email, password: hashedPassword, userId, phone });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '30d' });

    // Respond with token
    res.status(201).json({
      message: 'User registered successfully',
      userId: user.userId,
      token: token, // Send token in response
    });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login route for User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

  
// Generate JWT token
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '30d' });

    // Respond with token
    res.status(200).json({
      message: 'Login successful',
      userId: user.userId,
      token: token, // Send token in response
    });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Logout route for User
router.post('/logout', (req, res) => {
  res.json({ message: 'User logged out successfully' });
});

// Seller signup route
router.post('/seller/signup', async (req, res) => {
  try {
    const { phoneNumber, emailId, password, name, businessName, businessAddress, businessType } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email: emailId });
    if (existingSeller) {
      return res.status(400).json({ error: 'Seller already exists' });
    }

    // Generate unique seller ID
    let sellerId;
    let isUnique = false;
    while (!isUnique) {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      sellerId = `MBSLR${randomNum}`;
      const existingId = await Seller.findOne({ sellerId });
      if (!existingId) isUnique = true;
    }

    // Hash password
    const hashedPassword = password;

    // Create new seller
    const seller = new Seller({
      name,
      phoneNumber,
      email: emailId,
      password: hashedPassword,
      sellerId,
      businessName,
      businessAddress,
      businessType,
      emailVerified: false,
      phoneVerified: false,
    });
    await seller.save();

    // Generate JWT token
    const token = jwt.sign({ sellerId: seller.sellerId }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Seller registered successfully',
      sellerId,
      token: token, // Send token in response
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: 'Error registering seller' });
  }
});

// Seller login route
router.post('/seller/login', async (req, res) => {
  try {
    const { emailId, phone, password } = req.body;

    let seller;

    // Check if emailId is provided and find by emailId
    if (emailId) {
      seller = await Seller.findOne({ email: emailId });
    }

    // If email is not provided or no seller is found, check phone
    if (!seller && phone) {
      seller = await Seller.findOne({ phoneNumber: phone });
    }

    if (!seller) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ sellerId: seller.sellerId }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      message: 'Login successful',
      sellerId: seller.sellerId,
      token: token, // Send token in response
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Seller logout route
router.post('/seller/logout', (req, res) => {
  res.json({ message: 'Seller logged out successfully' });
});

router.get('/verify-token', (req, res) => {
  const token = req.headers['authorization']; // The token is passed directly in the header

  console.log("the token is ", token);

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  jwt.verify(token, JWT_SECRET, (err,user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(200).json({ message: 'Token is valid', user});
  });
});


module.exports = router;
