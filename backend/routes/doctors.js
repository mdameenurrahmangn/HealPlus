const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const { specialization } = req.query;
        let query = {};
        if (specialization) {
            query.specialization = { $regex: specialization, $options: 'i' };
        }
        const doctors = await Doctor.find(query).populate('user', 'name profilePic email');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('user', 'name profilePic email');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get doctor profile (for the logged in doctor)
router.get('/profile/me', protect, authorize('doctor'), async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name profilePic email');
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// For doctors updating their profile
router.put('/profile', protect, authorize('doctor'), async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
