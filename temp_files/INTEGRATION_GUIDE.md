# Shunya — Phase 3 & 4 Integration Guide

## What's New in This Delivery

### New Components
| File | Purpose |
|---|---|
| `StageThreeSushupti.jsx` | Stage 3 (Days 22–45) — The Observer/Sakshi stage |
| `ObserverInquiry.jsx` | The sacred Sakshi question with Sanskrit echo |
| `PresenceField.jsx` | Collective stillness indicator — soft glowing dots |
| `StageFourTuriya.jsx` | Stage 4 (Days 46–90) — The Community Mirror |
| `ResonanceFeed.jsx` | One community observation + resonance pulse button |
| `ObservationShare.jsx` | Inner observation sharing with 24h delay design |
| `App.jsx` | Updated — integrates all 4 stages |

### CSS Additions
Copy everything in `additions-to-index.css` to the bottom of your `src/index.css`.

---

## Integration Steps

### 1. Drop component files into your project
```
src/components/
  ├── StageThreeSushupti.jsx   ← NEW
  ├── ObserverInquiry.jsx      ← NEW
  ├── PresenceField.jsx        ← NEW
  ├── StageFourTuriya.jsx      ← NEW
  ├── ResonanceFeed.jsx        ← NEW
  └── ObservationShare.jsx     ← NEW
```

### 2. Replace App.jsx
Replace your existing `src/App.jsx` with the new `App.jsx`.
The new one adds `StageThreeSushupti` and `StageFourTuriya` routing.

### 3. Update StageTwoSvapna
Your existing `StageTwoSvapna.jsx` doesn't call `advanceStage(3)` when done.
Add `onComplete` prop handling:

```jsx
// In StageTwoSvapna.jsx — handleSilenceComplete
const handleSilenceComplete = () => {
  playVoice('/audio/voice/svapna-day-integrated.mp3');
  if (day >= 21) {
    advanceStage(3); // Move to Sushupti
  } else {
    completeDay(day);
  }
  setPhase('done');
};
```

### 4. Add CSS additions
Append `additions-to-index.css` content to your `src/index.css`.

---

## Dev Mode Testing

URL params for fast testing:
```
?dev=true           — Disables daily lock, shortens all timers
?stage=3            — Jump directly to Stage 3 (Sushupti)
?stage=4            — Jump directly to Stage 4 (Turiya)
?stage=3&dev=true   — Stage 3 with fast timers (recommended for testing)
```

### Stage 3 Session Flow (with dev=true)
1. Arrival (5s) → Presence field + "enter the witness"
2. Inquiry (6s) → Observer question + Sanskrit साक्षी echo
3. Silence (8s) → Pure void with faint "sit with the question"
4. Reflection → Word-by-word truth reveal
5. Done → "The Witness witnessed."

### Stage 4 Session Flow (with dev=true)
1. Arrival (4s) → Presence field + "others have been sitting too"
2. Feed (8s) → Community observation + resonance button
3. Silence (8s) → Let it settle
4. Share → Observation textarea with 24h delay note
5. Done → "The mirror held."

---

## Architecture Notes

### Presence Count
`PresenceField` uses a time-seeded count that fluctuates gently.
In production → replace with a real API call:
```js
// Replace getBaseCount() with:
const { count } = await fetch('/api/presence/current').then(r => r.json());
```

### Community Observations
`ResonanceFeed` uses curated seed content (14 observations cycling by day).
In production → replace with:
```js
// Replace getDailyObservation() with:
const { observation } = await fetch('/api/feed/today').then(r => r.json());
```

### Local Storage Keys
```
shunya_journey_data     — Stage + day progress
shunya_resonances       — Queued resonance events (for backend sync)
shunya_observations     — Submitted observations (24h release queue)
```

### Stage Boundaries
| Stage | Days | Advance Condition |
|---|---|---|
| 0 | Onboarding | `handleOnboardingComplete()` → stage 1 |
| 1 — Jagrat | 1–7 | `day >= 7` → stage 2 |
| 2 — Svapna | 8–21 | `day >= 21` → stage 3 |
| 3 — Sushupti | 22–45 | `day >= 45` → stage 4 |
| 4 — Turiya | 46–90 | `day >= 90` → stage 5 (Graduation) |

---

## What's Next — Phase 5 (Graduation / Kevala)

Stage 5 will include:
- `StageKevala.jsx` — The 90-day graduation ceremony
- `GraduationCeremony.jsx` — Sacred farewell ritual
- `GuideInvitation.jsx` — Option to become a silent guide for Stage 1 newcomers
- Backend API routes for real community data
- MongoDB schemas for observations + resonances

---

*शून्य — Begin your Sakshi.*
