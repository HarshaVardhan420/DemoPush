const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');

router.post('/login', adminController.adminLogin);
router.post('/supervisors', adminController.addSupervisor);
router.get('/supervisors', adminController.getSupervisors);
router.put('/supervisors/:id', adminController.updateSupervisor);
router.delete('/supervisors/:id', adminController.deleteSupervisor);

router.get('/stats', adminController.getStats); 

router.post('/send-otp', adminController.sendOtp);
router.post('/reset-password-otp', adminController.resetPasswordWithOtp);
module.exports = router;
