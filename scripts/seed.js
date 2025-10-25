// Script to seed demo users into the database
// Run with: node scripts/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management';

// User schema (simplified version for seeding)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const demoUsers = [
  {
    name: 'Demo Organizer',
    email: 'organizer@example.com',
    password: 'password123',
    role: 'organizer',
  },
  {
    name: 'Demo Attendee',
    email: 'attendee@example.com',
    password: 'password123',
    role: 'attendee',
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing demo users
    console.log('Clearing existing demo users...');
    await User.deleteMany({ 
      email: { $in: demoUsers.map(u => u.email) } 
    });

    // Create demo users
    console.log('Creating demo users...');
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        ...userData,
        password: hashedPassword,
      });
      console.log(`✓ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('─────────────────────────────────────');
    demoUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log('');
    });
    
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

