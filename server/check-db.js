import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Assuming running from root directory
dotenv.config({ path: path.join(process.cwd(), '../.env') });

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  stage: { type: Number, default: 0 },
  lastCompletedDay: { type: Number, default: 0 },
  lastSessionTimestamp: { type: Date }
}, { timestamps: true });

const ObservationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  authorClerkId: { type: String, required: false },
  day: { type: Number, required: true },
  resonances: { type: Number, default: 0 },
  resonatedBy: [{ type: String }]
}, { timestamps: true });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  const Observation = mongoose.models.Observation || mongoose.model('Observation', ObservationSchema);

  const users = await User.find().sort({ lastSessionTimestamp: -1 }).limit(1);
  console.log('--- LATEST USER ---');
  console.log(users[0]);

  // Find an observation that has been resonated with by a real user (not just seed)
  const latestResonated = await Observation.find({ resonatedBy: { $exists: true, $not: { $size: 0 } } }).sort({ updatedAt: -1 }).limit(1);
  console.log('--- LATEST USER-RESONATED OBSERVATION ---');
  console.log(latestResonated[0]);
  
  const obsCount = await Observation.countDocuments();
  console.log(`Total Observations: ${obsCount}`);

  process.exit(0);
}

check().catch(console.error);
