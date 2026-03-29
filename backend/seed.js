const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

dotenv.config();

const doctors = [
  {
    name: "Sarah Williams",
    email: "sarah@heart.com",
    password: "password123",
    role: "doctor",
    specialization: "Cardiology",
    experience: 12,
    location: "Chicago Medical Center",
    fees: 1200,
    bio: "Specializing in cardiovascular health and surgery."
  },
  {
    name: "James Miller",
    email: "james@skin.com",
    password: "password123",
    role: "doctor",
    specialization: "Dermatology",
    experience: 8,
    location: "New York Dermatology Clinic",
    fees: 800,
    bio: "Skincare expert focused on clinical dermatology."
  },
  {
    name: "Elena Rodriguez",
    email: "elena@brain.com",
    password: "password123",
    role: "doctor",
    specialization: "Neurology",
    experience: 15,
    location: "Metropolis Neurological Institute",
    fees: 1500,
    bio: "Expert in neurological disorders and brain health."
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    console.log("Deleting existing data...");
    await User.deleteMany();
    await Doctor.deleteMany();
    console.log("Data deleted. Starting seeding...");

    for (const d of doctors) {
      console.log(`Creating user: ${d.name}`);
      const { name, email, password, role, ...details } = d;
      const user = await User.create({ name, email, password, role });
      console.log(`User created. Creating doctor profile for: ${name}`);
      await Doctor.create({ user: user._id, ...details });
      console.log(`Seeded: Dr. ${name}`);
    }

    console.log("Seeding complete!");
    process.exit();
    } catch (error) {
    console.error("SEED ERROR:", error.message);
    if (error.errors) console.error("VALIDATION ERRORS:", error.errors);
    process.exit(1);
    }
};

seedData();
