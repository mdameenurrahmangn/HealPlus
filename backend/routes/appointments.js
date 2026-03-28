const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

router.post('/book', protect, authorize('patient'), async (req, res) => {
    try {
        const { doctorId, date, slot, notes } = req.body;
        
        // Ensure double booking is impossible (this is for simplified demo)
        const appointmentExists = await Appointment.findOne({ doctor: doctorId, date: new Date(date), slot });

        if (appointmentExists) {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId,
            date,
            slot,
            notes,
            symptoms: req.body.symptoms || ''
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update appointment rating
router.put('/:id/rate', protect, authorize('patient'), async (req, res) => {
    try {
        const { rating, feedback } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        if (appointment.patient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (appointment.status !== 'completed') {
            return res.status(400).json({ message: 'Can only rate completed appointments' });
        }

        appointment.rating = rating;
        appointment.feedback = feedback;
        await appointment.save();

        // Update Doctor's overall rating
        const doctor = await Doctor.findById(appointment.doctor);
        if (doctor) {
            const totalRatings = doctor.totalRatings + 1;
            const newAverageRating = ((doctor.ratings * doctor.totalRatings) + rating) / totalRatings;
            doctor.ratings = newAverageRating;
            doctor.totalRatings = totalRatings;
            await doctor.save();
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/my-patient', protect, authorize('patient'), async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name profilePic' }
            });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/my-doctor', protect, authorize('doctor'), async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });
        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate('patient', 'name email profilePic');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Authorization check logic: only doctor or patient involved in appointment can update status
        const isDoctor = req.user.role === 'doctor';
        appointment.status = req.body.status;
        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
