const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: false }, // Optional, add validation if needed
    address: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false },
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
