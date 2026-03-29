const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { protect, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Use a fixed mock secret for signing simulated payments (synchronized with frontend)
const MOCK_PAYMENT_SECRET = 'HealPlus_Mock_Secret_2024';

// @desc    Create Mock Order
// @route   POST /api/payments/order
router.post('/order', protect, authorize('patient'), async (req, res) => {
    try {
        const { fees } = req.body;
        
        // Generate a mock order ID
        const mockOrderId = `order_${Math.random().toString(36).slice(2, 11)}`;
        
        const order = {
            id: mockOrderId,
            amount: fees,
            currency: "INR",
            status: 'created'
        };

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Verify Mock Payment & Create Appointment
// @route   POST /api/payments/verify
router.post('/verify', protect, authorize('patient'), async (req, res) => {
    try {
        const { 
            mock_order_id, 
            mock_payment_id, 
            mock_signature,
            appointmentData 
        } = req.body;

        // Verify dummy signature (simple hash of order_id + payment_id + secret)
        const expectedSignature = crypto.createHmac('sha256', MOCK_PAYMENT_SECRET)
            .update(`${mock_order_id}|${mock_payment_id}`)
            .digest('hex');

        if (mock_signature !== expectedSignature) {
            return res.status(400).json({ status: 'failure', message: 'Mock payment signature mismatch!' });
        }

        // Check for duplicate booking
        const { doctorId, date, slot, notes, symptoms } = appointmentData;
        const appointmentExists = await Appointment.findOne({ 
            doctor: doctorId, 
            date: new Date(date), 
            slot,
            paymentStatus: 'success' 
        });

        if (appointmentExists) {
            return res.status(400).json({ message: 'Slot already booked while processing payment!' });
        }

        const doctor = await Doctor.findById(doctorId).populate('user', 'name');

        // Create Appointment
        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId,
            doctorName: doctor?.user?.name || 'Dr. Unknown',
            date,
            slot,
            time: slot,
            notes,
            symptoms: symptoms || '',
            paymentStatus: 'success',
            paymentId: mock_payment_id,
            razorpayOrderId: mock_order_id, // Keep field name for compatibility
            status: 'confirmed'
        });

        res.json({ 
            status: 'success', 
            message: 'Payment verified and appointment confirmed.',
            appointment 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
