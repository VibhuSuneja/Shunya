import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

import User from './models/User.js';
import Observation from './models/Observation.js';

dotenv.config({ path: '../.env' }); // Make sure we load the parent ENV

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shunya')
.then(() => console.log('MongoDB connected to shunya'))
.catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 1. GET User State
app.get('/api/journey/state', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({ clerkId });
    }

    // Determine lock
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const now = Date.now();
    let isLocked = false;
    
    if (user.lastSessionTimestamp) {
      const lastTime = new Date(user.lastSessionTimestamp).getTime();
      isLocked = (now - lastTime) < twentyFourHours;
    }

    res.json({
      stage: user.stage,
      lastCompletedDay: user.lastCompletedDay,
      lastSessionTimestamp: user.lastSessionTimestamp,
      isLocked
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. POST Advance/Complete Day
app.post('/api/journey/advance', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { nextStage, dayIndex } = req.body;
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({ clerkId });
    }

    if (nextStage !== undefined) {
      user.stage = nextStage;
    }
    
    if (dayIndex !== undefined) {
      user.lastCompletedDay = Math.max(user.lastCompletedDay, dayIndex);
      user.lastSessionTimestamp = new Date();
    } else if (req.body.reset) {
      user.stage = 0;
      user.lastCompletedDay = 0;
      user.lastSessionTimestamp = null;
    }

    await user.save();
    
    res.json({
      stage: user.stage,
      lastCompletedDay: user.lastCompletedDay,
      lastSessionTimestamp: user.lastSessionTimestamp
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET Observations for a Specific Day
app.get('/api/resonance/feed', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { day } = req.query;
    // Try finding one in DB
    let observation = await Observation.findOne({ day: Number(day) }).sort({ createdAt: -1 });
    
    // Fallback seed data
    if (!observation) {
      const SEED_OBSERVATIONS = [
        "I noticed I was afraid of silence today. Not the silence itself — but what might surface in it.",
        "I caught myself performing even when alone. Composing sentences no one will ever read. For an imaginary audience.",
        "The gap between my thoughts was longer today. For a moment — I couldn't find where 'I' was. It was not frightening. It was vast.",
        "I am learning that boredom is just withdrawal. The body demanding its dopamine tax. I sat with it until it dissolved.",
        "Something shifted in week three. I stopped fighting the silence. I started listening to it.",
        "I realized my loneliness was not about being alone. It was about not knowing how to be with myself.",
        "My mind kept pulling toward my phone. Each time I noticed — something deepened. The noticing itself became the practice.",
        "Today the question landed differently: who is tired? I looked. The witness was not tired. The witness was watching tiredness.",
        "I felt the collective stillness today. Knowing others are sitting — somewhere — it changed something in my chest.",
        "I stopped trying to feel peaceful. The moment I stopped trying — something like peace arrived on its own.",
        "Three weeks in. I don't scroll in bed anymore. The craving is still there, but quieter. Like a radio losing signal.",
        "I noticed I narrate my life to myself constantly. A running commentary. Today I turned it off for seven minutes. Seven minutes of just — being.",
        "The observer has no face. No history. No anxiety. I've started to suspect that's what I actually am.",
        "Being with people feels different now. Less performance. More presence. They notice something has changed. I don't explain.",
      ];
      const text = SEED_OBSERVATIONS[Number(day) % SEED_OBSERVATIONS.length] || SEED_OBSERVATIONS[0];
      
      // Auto-create seed in DB
      observation = await Observation.create({
        text,
        authorClerkId: 'seed',
        day: Number(day),
        resonances: Math.floor(Math.random() * 40) + 12
      });
    }

    res.json({ observation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. POST Add Resonance
app.post('/api/resonance/:id/pulse', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const clerkId = req.auth.userId;

    const observation = await Observation.findById(id);
    if (!observation) {
      return res.status(404).json({ error: 'Observation not found' });
    }

    if (!observation.resonatedBy.includes(clerkId)) {
      observation.resonatedBy.push(clerkId);
      observation.resonances += 1;
      await observation.save();
    }

    res.json({ success: true, resonances: observation.resonances });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

app.listen(port, () => {
  console.log(`Shunya Backend listening on port ${port}`);
});
