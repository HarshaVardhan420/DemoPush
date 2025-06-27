const Supervisor = require('../models/supervisor');
const Worker = require('../models/worker');
const csvtojson = require('csvtojson');
const nodemailer = require('nodemailer');

// Temporary in-memory store for OTPs (consider Redis or DB in production)
const otpStore = {};

// ✅ Register Supervisor
exports.registerSupervisor = async (req, res) => {
  try {
    const { name, email, password, phone, centerName } = req.body;

    const existing = await Supervisor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newSupervisor = new Supervisor({
      name,
      email,
      password,
      phone,
      centerName,
    });

    await newSupervisor.save();
    res.status(201).json({ message: 'Supervisor Registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login Supervisor
exports.loginSupervisor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const supervisor = await Supervisor.findOne({ email, password });

    if (!supervisor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      supervisorId: supervisor._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Forgot Password: Send OTP
  exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
  const supervisor = await Supervisor.findOne({ email });

   if (!supervisor) {
   return res.status(404).json({ message: 'Email not registered' });
  }

   const otp = Math.floor(100000 + Math.random() * 900000).toString();
   const expiresAt = Date.now() + 10 * 60 * 1000;

   otpStore[email] = { otp, expiresAt };

   const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
   user: 'harshavardhan0721@gmail.com',
   pass: 'ixqr aqcf fqwk esbo',
   },
  });

   await transporter.sendMail({
   from: 'NGO System <harshavardhan0721@gmail.com>',
   to: email,
   subject: 'OTP for Password Reset',
   html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 10 minutes.</p>`, // <-- FIX APPLIED HERE
   });

   res.status(200).json({ message: 'OTP sent to email' });
   } catch (err) {
   res.status(500).json({ error: err.message });
   }
  };
// ✅ Reset Password using OTP
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: 'No OTP found' });

    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const updated = await Supervisor.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );

    delete otpStore[email];

    if (!updated) return res.status(404).json({ message: 'Supervisor not found' });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add Worker (linked to supervisor via :id)
exports.addWorker = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const newWorker = new Worker({
      name,
      email,
      phone,
      supervisorId: req.params.id,
    });

    await newWorker.save();
    res.status(201).json({ message: 'Worker added', worker: newWorker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all workers under a specific supervisor
exports.getWorkersBySupervisor = async (req, res) => {
  try {
    const supervisorId = req.params.id;
    const workers = await Worker.find({ supervisorId });
    res.status(200).json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Worker
exports.updateWorker = async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.workerId,
      req.body,
      { new: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json(updatedWorker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Worker
exports.deleteWorker = async (req, res) => {
  try {
    const deleted = await Worker.findByIdAndDelete(req.params.workerId);

    if (!deleted) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({ message: 'Worker deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Bulk Insert Workers
exports.inserManyWorkers = async (workers, supervisorId) => {
  try {
    const formattedWorkers = workers.map(worker => ({
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      supervisorId: supervisorId
    }));

    await Worker.insertMany(formattedWorkers);
  } catch (error) {
    throw new Error('Error inserting workers: ' + error.message);
  }
};

// ✅ Upload CSV and Save Workers
exports.uploadWorkers = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const jsonArray = await csvtojson().fromString(req.file.buffer.toString());
    const supervisorId = req.body.supervisorId;

    await exports.inserManyWorkers(jsonArray, supervisorId);
    
    res.status(201).json({ message: 'Workers added successfully', workers: jsonArray });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
