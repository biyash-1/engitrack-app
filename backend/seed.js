require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Project = require('./src/models/Project');

async function seed() {
  console.log('Connecting to MongoDB...');
  
  const connString = process.env.MONGODB_URI;
  if (!connString || connString.includes('<db_password>')) {
    console.error('\n❌ ERROR: Invalid or missing MONGODB_URI in your backend/.env file!');
    console.error('Please make sure you have added your real MongoDB connection string.\n');
    process.exit(1);
  }

  await mongoose.connect(connString);
  console.log('✅ Connected to MongoDB. Clearing database for seeding...');

  // Clear existing collections
  await User.deleteMany({});
  await Project.deleteMany({});

  console.log('🌱 Seeding database with initial users and projects...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 12);
  const engineerPassword = await bcrypt.hash('engineer123', 12);
  const viewerPassword = await bcrypt.hash('viewer123', 12);

  const trialExpiry = new Date();
  trialExpiry.setDate(trialExpiry.getDate() + 14);

  // 1. Create Users
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@engitrack.com',
    password: adminPassword,
    role: 'admin',
    subscription: 'enterprise',
    subscription_expires_at: null,
  });

  const engineer = await User.create({
    name: 'John Engineer',
    email: 'engineer@engitrack.com',
    password: engineerPassword,
    role: 'engineer',
    subscription: 'professional',
    subscription_expires_at: null,
  });

  const viewer = await User.create({
    name: 'Jane Viewer',
    email: 'viewer@engitrack.com',
    password: viewerPassword,
    role: 'viewer',
    subscription: 'free_trial',
    subscription_expires_at: trialExpiry,
  });

  // 2. Create Projects
  await Project.create([
    {
      name: 'Highway Bridge Design',
      type: 'infrastructure',
      description: 'Structural analysis and design for a 200m highway bridge crossing.',
      creator_id: engineer._id,
    },
    {
      name: 'Residential Complex A',
      type: 'residential',
      description: '15-story residential building with underground parking.',
      creator_id: engineer._id,
    },
    {
      name: 'Commercial Plaza',
      type: 'commercial',
      description: 'Multi-use commercial plaza with retail and office spaces.',
      creator_id: admin._id,
    }
  ]);

  console.log('\n🎉 Seeding complete successfully!\n');
  console.log('=== Test Accounts ===');
  console.log('👑 Admin:    admin@engitrack.com / admin123');
  console.log('🏗️ Engineer: engineer@engitrack.com / engineer123');
  console.log('👁️ Viewer:   viewer@engitrack.com / viewer123');
  console.log('=====================\n');

  mongoose.connection.close();
}

seed().catch((err) => {
  console.error('\n❌ Seeding error:', err);
  mongoose.connection.close();
  process.exit(1);
});
