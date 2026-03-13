MyGymApp

A minimalist strength training tracker for Android. The app automatically calculates the working weight for each workout based on your 1RM (one-repetition maximum) and progresses in a 2-stage x 4-week cycle.

---

How it works

You enter your one-repetition maximum (1RM) for each exercise and select the intensity. The app automatically calculates the weight and number of reps to work with today, and increases the load slightly each week.

Progression Cycle

Each exercise follows a cycle: 2 stages of 4 weeks. Within each week, the weight and reps change according to the formula:

| | Stage 1 | Stage 2 |
|---|---|---|
| **Week 1** | Base % of 1RM | Base % + 5 kg |
| **Week 2** | +5% to weight | +5% to weight |
| **Week 3** | +10% to weight | +10% bodyweight |
| **Week 4** | +15% bodyweight, -1 set | +15% bodyweight, -1 set |

At the end of the cycle, the app prompts you to reset your 1RM and start over.

Intensities

| | Base (% of 1RM) | Sets × Reps |
|---|---|---|
| **Light** | 70% | 4 × 8→2 |
| **Moderate** | 60% | 3 × 12→6 |
| **Heavy** | 50% | 3 × 16→10 |

---

Features

-*Automatic weight calculation — enter your 1RM once, and the app calculates your weight for each workout automatically.
- 1RM calculator — built-in calculator based on Epley's formula: 1RM = (M × k) / 30 + M
- Up to 7 training days — flexible splits for any program
- Progress bars — visually show where you are in the cycle (week and stage)
- "Step back" button — if a workout isn't going well, roll back to a week.
- 4 languages ​​— Russian, Ukrainian, English, Estonian
- Offline — everything is stored locally, no internet connection required.

---

Stack

- React Native + Expo
- React Native Reanimated — animations
- AsyncStorage — local data storage
- react-native-safe-area-context — correct indentation on Android

---

Storage Data

Data is stored in AsyncStorage under three keys:

| appLanguage | Selected language (ru / ua / en / ee) |
| daysStructure | JSON array of training days |
| exercises | JSON array of exercises with progress |

Data is stored with a 700ms debounce (350ms for the "Done" and "Step Back" buttons).
