const Worker = require('../models/worker');

// Register Worker
exports.registerWorker = async (req, res) => {
  try {
    const { name, email, phone, password, supervisorId } = req.body;

    const existing = await Worker.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const newWorker = new Worker({
      name,
      email,
      phone,
      password,
      supervisorId
    });

    await newWorker.save();
    res.status(201).json({ message: 'Worker registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login Worker
exports.loginWorker = async (req, res) => {
  const { email, password } = req.body;

  const worker = await Worker.findOne({ email, password });
  if (!worker) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    message: 'Login successful',
    workerId: worker._id,
    supervisorId: worker.supervisorId
  });
};

