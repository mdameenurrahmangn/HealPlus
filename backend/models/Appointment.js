const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    time: {
        type: String
    },
    doctorName: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    notes: {
        type: String
    },
    symptoms: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    paymentId: {
        type: String
    },
    razorpayOrderId: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
