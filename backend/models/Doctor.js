const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    bio: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    consultationAddress: {
        type: String,
        default: ''
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    fees: {
        type: Number,
        required: true
    },
    ratings: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    availability: [
        {
            day: String, // 'Monday', 'Tuesday', etc.
            slots: [String] // '09:00', '10:00', etc.
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
