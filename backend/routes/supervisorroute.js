const express = require('express');
const router = express.Router();
const supervisorcontroller = require('../controllers/supervisorcontroller');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register', supervisorcontroller.registerSupervisor);
router.post('/login', supervisorcontroller.loginSupervisor);

router.post('/:id/workers', supervisorcontroller.addWorker);
router.get('/:id/workers', supervisorcontroller.getWorkersBySupervisor);
router.put('/workers/:workerId', supervisorcontroller.updateWorker);
router.delete('/workers/:workerId', supervisorcontroller.deleteWorker);

router.post('/upload', upload.single('file'), supervisorcontroller.uploadWorkers);

router.post('/forgot', supervisorcontroller.forgotPassword);
router.post('/reset-password', supervisorcontroller.resetPassword);

module.exports = router;

