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

    # Stage 2: Svapna
    "svapna-day8-1.mp3": "You have sat in the cosmic silence for seven days.",
    "svapna-day8-2.mp3": "The mind attempted to fill the void, as it always does.",
    "svapna-day8-3.mp3": "The void was never empty. It is pregnant with the beginning of all things.",
    "svapna-day8-4.mp3": "For the next fourteen days, we slow down further. The discomfort you feel in silence is simply withdrawal.",
    "svapna-day-integrated.mp3": "Stillness witnessed. Return tomorrow for your next day.",

    # Ritual Lockout
    "lockout-wait.mp3": "The sun has not yet set on today's stillness. Return tomorrow."
}

OUTPUT_DIR = r"d:\Shunya\public\audio\voice"

async def generate_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating high-quality neural voiceover using: {VOICE}")
    
    for filename, text in ASSETS.items():
        filepath = os.path.join(OUTPUT_DIR, filename)
        print(f"-> Generating {filename}...")
        try:
            communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
            await communicate.save(filepath)
            print(f"   [SUCCESS] Saved {filename}")
        except Exception as e:
            print(f"   [ERROR] Failed to generate {filename}: {e}")

if __name__ == "__main__":
    asyncio.run(generate_all())
