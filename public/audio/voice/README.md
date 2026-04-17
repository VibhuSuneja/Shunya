# Voiceover Assets

Because of the strict cybersecurity requirements and the static script nature of the website, we use **pre-rendered** `.mp3` files generated via an AI TTS provider like **ElevenLabs** or **OpenAI TTS**.

## Required Files
You must generate these voice clips and place them in this folder with exactly these filenames so that the global `useVoiceover` hook can find and play them in sequence.

### Onboarding Flow (ob-*.mp3)
* `ob-who-is-reading-this.mp3` -> *"Who is reading this?"*
* `ob-that-which-is-asking.mp3` -> *"That which is asking — is the answer."*
* `ob-what-did-you-notice.mp3` -> *"What did you notice?"*
* `ob-yes-that-was-you.mp3` -> *"Yes. That was you."*
* `ob-shunya-sakshi-begins.mp3` -> *"शून्य... Your Sakshi begins."*

### Stage 2: Svapna (svapna-dayX-Y.mp3)
* `svapna-day8-1.mp3` -> *"You have sat in the cosmic silence for seven days."*
* `svapna-day8-2.mp3` -> *"The mind attempted to fill the void, as it always does."*
* `svapna-day8-3.mp3` -> *"The void was never empty. It is pregnant with the beginning of all things."*
* `svapna-day8-4.mp3` -> *"For the next fourteen days, we slow down further. The discomfort you feel in silence is simply withdrawal."*

---
*If an audio file is missing, the player will simply fail silently and gracefully (as designed) so that development is not blocked.*
