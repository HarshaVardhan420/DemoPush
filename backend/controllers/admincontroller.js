const Supervisor = require('../models/supervisor');
const Worker = require('../models/worker');
const nodemailer = require('nodemailer');

// 🔒 Hardcoded admin credentials
const adminEmail = "admin@gmail.com";
const adminPassword = "admin";

// ✅ Admin Login
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email === adminEmail && password === adminPassword) {
    return res.status(200).json({ message: "Admin Login Successful" });
  }

  return res.status(401).json({ error: "Invalid Credentials" });
};

// ✅ Create Supervisor
exports.addSupervisor = async (req, res) => {
  try {
    const { name, email, phone, centerName, password } = req.body;

    const existing = await Supervisor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newSupervisor = new Supervisor({ name, email, phone, centerName, password });
    await newSupervisor.save();

    res.status(201).json({ message: "Supervisor added", supervisor: newSupervisor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Read All Supervisors
exports.getSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find();
    res.status(200).json(supervisors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Supervisor
exports.updateSupervisor = async (req, res) => {
  try {
    const updated = await Supervisor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    res.status(200).json({ message: "Supervisor updated", supervisor: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Supervisor
exports.deleteSupervisor = async (req, res) => {
  try {
    const deleted = await Supervisor.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Stats for chart
exports.getStats = async (req, res) => {
  try {
    const supervisorCount = await Supervisor.countDocuments();
    const workerCount = await Worker.countDocuments();

    res.json({ supervisorCount, workerCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Send OTP to Email
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const supervisor = await Supervisor.findOne({ email });

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 min

    supervisor.otp = otp;
    supervisor.otpExpiry = expiry;
    await supervisor.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'harshavardhan0721@gmail.com', // Replace
        pass: 'lzlu okpl yrrr gftr'     // Use App Password
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: "OTP sent to email" });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Reset Password Using OTP
exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const supervisor = await Supervisor.findOne({ email });

    if (!supervisor || supervisor.otp !== otp || supervisor.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    supervisor.password = newPassword;
    supervisor.otp = undefined;
    supervisor.otpExpiry = undefined;
    await supervisor.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
