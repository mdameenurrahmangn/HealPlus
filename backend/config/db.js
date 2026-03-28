const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connection SUCCESS');
    } catch (error) {
        console.error('DATABASE CONNECTION ERROR FULL:', error);
    }
};

module.exports = connectDB;
