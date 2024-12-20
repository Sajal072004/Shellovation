const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  address: String
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
