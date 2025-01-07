const mongoose = require('mongoose');

const AddSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  details: {
    type: String,
  },
  
  
  
}, { timestamps: true });

module.exports = mongoose.model('User', AddSchema);
