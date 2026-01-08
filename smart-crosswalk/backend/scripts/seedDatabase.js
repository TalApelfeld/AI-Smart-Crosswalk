import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Camera, LED, Crosswalk, Alert } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create sample cameras
    console.log('\n📷 Creating cameras...');
    const camera1 = await Camera.create({ status: 'active' });
    const camera2 = await Camera.create({ status: 'active' });
    const camera3 = await Camera.create({ status: 'inactive' });
    console.log(`   ✅ Created ${3} cameras`);

    // Create sample LEDs
    console.log('\n💡 Creating LEDs...');
    const led1 = await LED.create({});
    const led2 = await LED.create({});
    const led3 = await LED.create({});
    console.log(`   ✅ Created ${3} LEDs`);

    // Create sample crosswalks
    console.log('\n🚶 Creating crosswalks...');
    const crosswalk1 = await Crosswalk.create({
      location: {
        city: 'תל אביב',
        street: 'דיזנגוף',
        number: '50'
      },
      cameraId: camera1._id,
      ledId: led1._id
    });

    const crosswalk2 = await Crosswalk.create({
      location: {
        city: 'תל אביב',
        street: 'אבן גבירול',
        number: '123'
      },
      cameraId: camera2._id,
      ledId: led2._id
    });

    const crosswalk3 = await Crosswalk.create({
      location: {
        city: 'ירושלים',
        street: 'יפו',
        number: '234'
      },
      cameraId: camera3._id,
      ledId: led3._id
    });
    console.log(`   ✅ Created ${3} crosswalks`);

    // Create sample alerts
    console.log('\n⚠️  Creating alerts...');
    await Alert.create({
      crosswalkId: crosswalk1._id,
      dangerLevel: 'HIGH',
      detectionPhoto: {
        url: 'https://example.com/photos/alert1.jpg'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    });

    await Alert.create({
      crosswalkId: crosswalk1._id,
      dangerLevel: 'MEDIUM',
      detectionPhoto: {
        url: 'https://example.com/photos/alert2.jpg'
      },
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
    });

    await Alert.create({
      crosswalkId: crosswalk2._id,
      dangerLevel: 'LOW',
      detectionPhoto: {
        url: 'https://example.com/photos/alert3.jpg'
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    });

    await Alert.create({
      crosswalkId: crosswalk2._id,
      dangerLevel: 'HIGH',
      detectionPhoto: {
        url: 'https://example.com/photos/alert4.jpg'
      },
      timestamp: new Date()
    });
    console.log(`   ✅ Created ${4} alerts`);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Cameras: 3');
    console.log('   - LEDs: 3');
    console.log('   - Crosswalks: 3');
    console.log('   - Alerts: 4');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

seedDatabase();
