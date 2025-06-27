const mongoose = require('mongoose');

const SupervisorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  centerName: String,
  password: String,
  otp: String,
  otpExpiry: Date
});

module.exports = mongoose.model('Supervisor', SupervisorSchema);
