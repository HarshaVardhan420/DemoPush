const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workercontroller');

// Register and Login routes
router.post('/register', workerController.registerWorker);
router.post('/login', workerController.loginWorker);

module.exports = router;
