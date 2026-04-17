import asyncio
import edge_tts
import os

# Microsoft Azure Neural TTS Voice
VOICE = "en-GB-RyanNeural"  # A calm, soothing British male voice
RATE = "-15%"               # Slowed down by 15% for a meditative, unhurried cadence

# The exact files and text required by the application
ASSETS = {
    # Onboarding Flow
    "ob-who-is-reading-this.mp3": "Who is reading this?",
    "ob-that-which-is-asking.mp3": "That which is asking, is the answer.",
    "ob-what-did-you-notice.mp3": "What did you notice?",
    "ob-yes-that-was-you.mp3": "Yes. That was you.",
    "ob-shunya-sakshi-begins.mp3": "Shoon-yah. Your Sakshi begins.",
    
    # Stage 1: Jagrat
    "jagrat-q1.mp3": "If you disappeared right now — what would actually be lost?",
    "jagrat-q2.mp3": "Who were you before you had a name?",
    "jagrat-q3.mp3": "Are you breathing, or are you being breathed?",
    "jagrat-q4.mp3": "What is the space between your thoughts?",
    "jagrat-day-integrated.mp3": "Day integrated. Return tomorrow to continue the Sakshi.",

    # Stage 2: Svapna (Days 8-21)
    "svapna-day8-1.mp3": "You have sat in the cosmic silence for seven days. The mind attempted to fill the void, as it always does.",
    "svapna-day8-2.mp3": "The void was never empty. It is pregnant with the beginning of all things.",
    "svapna-day8-3.mp3": "For the next fourteen days, we slow down further. The discomfort you feel in silence is simply withdrawal.",
    
    "svapna-day9-1.mp3": "Awareness is not something you do. It is what you are.",
    "svapna-day9-2.mp3": "The 'I' that is tired is just a thought being observed by the 'I' that is forever awake. Watch the fatigue as if it were a cloud passing over a mountain peak.",
    
    "svapna-day10-1.mp3": "Your brain is starving for the noise it used to have. The dopamine ghost is calling.",
    "svapna-day10-2.mp3": "Do not feed it. Sit with the hunger. The hunger is the work.",
    
    "svapna-day11-1.mp3": "Thoughts are like guests. Let them come, let them go. But do not serve them tea.",
    "svapna-day11-2.mp3": "You are the house. The guests do not change the architecture of the host.",
    
    "svapna-day12-1.mp3": "The gap between your inhale and exhale. That is Shunya.",
    "svapna-day12-2.mp3": "Notice that small pause. That which is still in the pause, is always still.",
    
    "svapna-day13-1.mp3": "Resistance is not an obstacle. It is the compass.",
    "svapna-day13-2.mp3": "The part of you that wants to quit is the part that is being transformed.",
    
    "svapna-day14-1.mp3": "Boredom is the last defense of the ego. It wants you to do something, anything, to avoid being.",
    "svapna-day14-2.mp3": "Be bored deeply. Be bored until boredom itself becomes interesting.",
    
    "svapna-day15-1.mp3": "You have walked halfway through the gateway of dreams.",
    "svapna-day15-2.mp3": "Recall your first day. The noise has not changed, but your relationship to it has.",
    
    "svapna-day16-1.mp3": "There is a voice in your head that never stops talking. It is narrating your life to you.",
    "svapna-day16-2.mp3": "Stop. Notice that you are the one hearing it. You are not the narrator.",
    
    "svapna-day17-1.mp3": "The body is a collection of sensations. A cloud of points in the dark.",
    "svapna-day17-2.mp3": "Where exactly does 'you' begin? Investigate the edges of your skin.",
    
    "svapna-day18-1.mp3": "Sound is just vibration. Meaning is a layer you add later.",
    "svapna-day18-2.mp3": "Strip the meaning. Hear the world as raw resonance.",
    
    "svapna-day19-1.mp3": "The silence is getting louder. Do not try to quiet the mind.",
    "svapna-day19-2.mp3": "Trying to quiet the mind is like trying to flatten ripples with a flat iron. Just step away from the pool.",
    
    "svapna-day20-1.mp3": "Tomorrow we enter Sushupti. Deep sleep while awake.",
    "svapna-day20-2.mp3": "Prepare to drop even the observer. Prepare for the absence of presence.",
    
    "svapna-day21-1.mp3": "Twenty-one days of witnessing. You are no longer the one who walked in.",
    "svapna-day21-2.mp3": "The door is open. Walk into the deep sleep.",
    
    "svapna-day-integrated.mp3": "Stillness witnessed. Return tomorrow for your next day.",

    # Stage 3: Sushupti (Days 22-45)
    "sushupti-22-inquiry.mp3": "Right now. Are you the thought, or the one watching the thought?",
    "sushupti-22-reflection.mp3": "The one who noticed the thought... was never the thought.",
    "sushupti-23-inquiry.mp3": "When you feel anxious. Who is aware of the anxiety?",
    "sushupti-23-reflection.mp3": "Awareness itself is never anxious. It simply holds.",
    "sushupti-24-inquiry.mp3": "Can the eye see itself? Can the mind know itself directly?",
    "sushupti-24-reflection.mp3": "The Knower cannot be the known. And yet. It knows.",
    "sushupti-25-inquiry.mp3": "Where do your thoughts come from? And where do they go?",
    "sushupti-25-reflection.mp3": "Between each thought. A gap. That gap is what you are.",
    "sushupti-26-inquiry.mp3": "Are you having an experience, or are you the space in which experience happens?",
    "sushupti-26-reflection.mp3": "The screen does not become the movie. Yet without it. No movie.",
    "sushupti-27-inquiry.mp3": "When you sleep deeply. No thoughts, no self. Who sleeps?",
    "sushupti-27-reflection.mp3": "Something persists through all three states. The ever-present Sakshi.",
    "sushupti-28-inquiry.mp3": "If you lost all your memories tonight. Would you still exist?",
    "sushupti-28-reflection.mp3": "Existence does not depend on the story of the one who exists.",
    
    # Stage 3: Sushupti (Days 29-45)
    "sushupti-29-inquiry.mp3": "The Gita says you are neither the body nor the mind. Then. What are you?",
    "sushupti-29-reflection.mp3": "That which cannot be cut by weapons, burned by fire, or drowned by water.",
    "sushupti-30-inquiry.mp3": "You have been breathing all day without trying. Who breathes?",
    "sushupti-30-reflection.mp3": "The universe breathes through what you call yourself. You are the breath.",
    "sushupti-31-inquiry.mp3": "In this moment. Are you reading, or is reading happening through you?",
    "sushupti-31-reflection.mp3": "The river does not flow. Flow is what the river is.",
    "sushupti-32-inquiry.mp3": "Buddha said there is no fixed self. Ramana said there is only Self. Are they contradicting?",
    "sushupti-32-reflection.mp3": "The fixed 'me' is empty. The vast 'I AM' is everything. Both point to one truth.",
    "sushupti-33-inquiry.mp3": "When you say 'I am tired'. Which part is tired? Is the 'I' also tired?",
    "sushupti-33-reflection.mp3": "The witness is never tired. It simply witnesses tiredness, as the sun witnesses clouds.",
    "sushupti-34-inquiry.mp3": "What if the sense of being a separate self is itself just another thought being observed?",
    "sushupti-34-reflection.mp3": "The cage is made of the same light as the bird. Look closely.",
    "sushupti-35-inquiry.mp3": "Can you find the boundary where 'you' end and the rest of the world begins?",
    "sushupti-35-reflection.mp3": "The skin is a meeting point. Not a wall. You are more porous than you think.",
    "sushupti-36-inquiry.mp3": "Right now. Notice the noticing. Who notices the noticer?",
    "sushupti-36-reflection.mp3": "The regression stops. The final noticer is not an object. It is the subject itself.",
    "sushupti-37-inquiry.mp3": "The universe is 13.8 billion years old. You are made of its matter. How old are you, really?",
    "sushupti-37-reflection.mp3": "Your atoms have been stars. Stars have been your atoms. The universe is experiencing itself through you.",
    "sushupti-38-inquiry.mp3": "When you are in deep flow. Who is there?",
    "sushupti-38-reflection.mp3": "Flow is what happens when the separate self dissolves into the doing. That is Sakshi in action.",
    "sushupti-39-inquiry.mp3": "If all your thoughts are objects in awareness. What is awareness itself?",
    "sushupti-39-reflection.mp3": "Awareness has no shape, no color, no weight. And yet it is the most intimate thing you know.",
    "sushupti-40-inquiry.mp3": "Is there a single moment, right now, when you are not aware?",
    "sushupti-40-reflection.mp3": "Awareness is the one constant. Even in the awareness of sleep. Awareness persists.",

    # Stage 4: Turiya (Generic phrases)
    "turiya-arrival.mp3": "Others have been sitting too.",
    "turiya-feed-transition.mp3": "Resonate with the inner silence of another.",
    "turiya-silence-start.mp3": "Let it settle.",
    "turiya-share-prompt.mp3": "If you wish. Share one word from your silence.",
    "turiya-done.mp3": "The mirror held. Your Sakshi continues.",

    # Stage 4: Resonance Observations (Seed Content)
    "res-obs-0.mp3": "I noticed I was afraid of silence today. Not the silence itself — but what might surface in it.",
    "res-obs-1.mp3": "I caught myself performing even when alone. Composing sentences no one will ever read. For an imaginary audience.",
    "res-obs-2.mp3": "The gap between my thoughts was longer today. For a moment — I couldn't find where 'I' was. It was not frightening. It was vast.",
    "res-obs-3.mp3": "I am learning that boredom is just withdrawal. The body demanding its dopamine tax. I sat with it until it dissolved.",
    "res-obs-4.mp3": "Something shifted in week three. I stopped fighting the silence. I started listening to it.",
    "res-obs-5.mp3": "I realized my loneliness was not about being alone. It was about not knowing how to be with myself.",
    "res-obs-6.mp3": "My mind kept pulling toward my phone. Each time I noticed — something deepened. The noticing itself became the practice.",
    "res-obs-7.mp3": "Today the question landed differently: who is tired? I looked. The witness was not tired. The witness was watching tiredness.",
    "res-obs-8.mp3": "I felt the collective stillness today. Knowing others are sitting — somewhere — it changed something in my chest.",
    "res-obs-9.mp3": "I stopped trying to feel peaceful. The moment I stopped trying — something like peace arrived on its own.",
    "res-obs-10.mp3": "Three weeks in. I don't scroll in bed anymore. The craving is still there, but quieter. Like a radio losing signal.",
    "res-obs-11.mp3": "I noticed I narrate my life to myself constantly. A running commentary. Today I turned it off for seven minutes. Seven minutes of just — being.",
    "res-obs-12.mp3": "The observer has no face. No history. No anxiety. I've started to suspect that's what I actually am.",
    "res-obs-13.mp3": "Being with people feels different now. Less performance. More presence. They notice something has changed. I don't explain.",

    # Ritual Lockout
    "lockout-wait.mp3": "The sun has not yet set on today's stillness. Return tomorrow.",

    # Stage 5: Kevala (Days 90+)
    "kevala-arrival.mp3": "The 90 days have dissolved. The journey and the journal were just scaffolds. Now they fall away.",
    "kevala-stateless.mp3": "You are no longer practicing stillness. You are the stillness. You are Kevala. Alone. Whole. Infinite.",
    "kevala-sakshi-eternal.mp3": "Go now. Be the witness in every breath. Every word. Every silence."
}

OUTPUT_DIR = os.path.join(os.getcwd(), "public", "audio", "voice")

async def generate_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating high-quality neural voiceover using: {VOICE}")
    
    for filename, text in ASSETS.items():
        filepath = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(filepath):
            print(f"-> Skipping {filename} (already exists)")
            continue
            
        print(f"-> Generating {filename}...")
        try:
            communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
            await communicate.save(filepath)
            print(f"   [SUCCESS] Saved {filename}")
        except Exception as e:
            print(f"   [ERROR] Failed to generate {filename}: {e}")

if __name__ == "__main__":
    asyncio.run(generate_all())
