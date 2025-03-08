const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Model', ModelSchema);
