import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  stage: { type: Number, default: 0 },
  lastCompletedDay: { type: Number, default: 0 },
  lastSessionTimestamp: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
