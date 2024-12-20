const mongoose = require('mongoose');

// Define the schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  productsOrdered: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  trackingId: { type: String, required: true, unique: true },
  price: { type: Number, required: true }
});


// Prevent model overwrite if already declared
const Order =  mongoose.model('Order', orderSchema);

module.exports = Order;
