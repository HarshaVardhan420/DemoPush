const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supervisor',
  }
});

module.exports = mongoose.model('Worker', WorkerSchema);
