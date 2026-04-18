import mongoose from 'mongoose';

const observationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  authorClerkId: { type: String, required: false }, // Optional for anonymous seed data
  day: { type: Number, required: true },
  resonances: { type: Number, default: 0 },
  resonatedBy: [{ type: String }] // Array of clerkIds who resonated
}, { timestamps: true });

export default mongoose.model('Observation', observationSchema);
