const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cartmodel');
const Order = require('../models/order'); // Replace with correct path
const User = require('../models/user'); // Replace with correct path
const Product = require('../models/product'); // Replace with correct path
const nodemailer = require('nodemailer');
require('dotenv').config();

const generateOrderEmail = require('./emailTemplate');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: `pecommerce8@gmail.com`,
    pass: `rqrdabxuzpaecigz`
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Add to Cart Route
router.post('/addtocart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.productsInCart.push({ productId, quantity });
      await cart.save();
    } else {
      cart = new Cart({ userId, productsInCart: [{ productId, quantity }] });
      await cart.save();
    }

    res.status(200).json({ success: true, message: 'Product added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding product to cart', error: error.message });
  }
});

// Get Cart by User ID Route
router.post('/get-cart', async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found for this user' });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
});

router.put('/update-quantity', async (req, res) => {
  const { userId, productId, productQty } = req.body;

  if (!userId || !productId || typeof productQty !== 'number') {
    return res.status(400).json({ message: 'userId, productId, and a valid productQty are required.' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const product = cart.productsInCart.find(item => item.productId === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found in the cart.' });
    }

    product.productQty = productQty;
    await cart.save();

    res.status(200).json({ message: 'Quantity updated successfully.' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'An error occurred while updating the quantity.' });
  }
});
// Delete Item from Cart Route
router.post('/delete-items', async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId and productId are required.' });
  }

  try {
    const result = await Cart.updateOne(
      { userId },
      { $pull: { productsInCart: { productId } } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Item deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found in the cart.' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'An error occurred while deleting the item.' });
  }
});

// Route to update quantity

// Place Order Route
// Place Order Route
// Place Order Route
// Place Order Route
router.post('/place-order', async (req, res) => {
  try {
    const { userId, date, time, address, price, productsOrdered } = req.body;

    console.log("Received request body:", req.body); // Log the incoming request body

    // Validate userId
    if (!userId) {
      console.log("Missing userId in request");
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    console.log("User ID:", userId); // Log userId

    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const trackingId = Math.random().toString(36).substring(2, 14).toUpperCase();

  
    const user = await User.findOne({ userId });
    if (!user) {
      console.log("User not found for userId:", userId);
      throw new Error('User not found');
    }

    console.log("User found:", user); // Log user details

    // Validate productsOrdered
    if (!Array.isArray(productsOrdered) || productsOrdered.length === 0) {
      console.log("Invalid or empty productsOrdered");
      return res.status(400).json({
        success: false,
        message: 'productsOrdered is required and must be an array'
      });
    }

    // Extract productIds and quantities from the request body
    const productIds = productsOrdered.map(item => item.productId);
    console.log("Product IDs to fetch:", productIds); // Log product IDs

    // Fetch product details based on the productIds
    const productDetails = await Product.find({ _id: { $in: productIds } });
    console.log("Fetched product details:", productDetails); // Log product details

    if (productDetails.length !== productsOrdered.length) {
      console.log("Some products not found for productIds:", productIds);
      throw new Error('Some products not found');
    }

    // Create a new order object
    const order = new Order({
      userId: user._id,
      orderId,
      date,
      time,
      address,
      email: user.email,
      name: user.name,
      productsOrdered,  // Directly store the productsOrdered array with productId and quantity
      trackingId,
      price
    });

    console.log("Order to be saved:", order); // Log the order object

    // Save the order to the database
    await order.save();
    console.log("Order saved to the database successfully"); // Log save success

    // Send email confirmation to the user
    const emailHtml = generateOrderEmail(user, orderId, trackingId, date, time, address, price, productsOrdered); // Simplified for brevity

    await transporter.sendMail({
      from: 'pecommerce8@gmail.com',
      to: user.email,
      subject: 'Order Confirmation',
      html: emailHtml
    });
    console.log("Email sent successfully to:", user.email); // Log email success

    res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      orderId,
      trackingId
    });
  } catch (error) {
    console.error('Error placing order:', error); // Log the error
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
});



module.exports = router;