# MyGymApp
A minimalist strength training tracker for Android. The app automatically calculates your working weight for each session based on your 1RM and progresses through a 2-stage × 4-week cycle.

---

## How It Works

You enter a one-rep max (1RM) for each exercise and pick an intensity level. The app figures out the weight and reps for today's session and gradually increases the load each week.

### Progression Cycle

Each exercise follows a cycle of **2 stages × 4 weeks**. Weight increases week by week using the following formula:

| | Stage 1 | Stage 2 |
|---|---|---|
| **Week 1** | base % of 1RM | base % + 5 kg |
| **Week 2** | +5% to weight | +5% to weight |
| **Week 3** | +10% to weight | +10% to weight |
| **Week 4** | +15% to weight, −1 set | +15% to weight, −1 set |

When the cycle finishes, the app prompts you to update your 1RM and start again.

### Intensity Levels

| | Base (% of 1RM) | Sets × Reps |
|---|---|---|
| **Light** | 70% | 4 × 8→2 |
| **Medium** | 60% | 3 × 12→6 |
| **Heavy** | 50% | 3 × 16→10 |

---

## Features

- **Auto weight calculation** — enter your 1RM once, the app handles the math every session
- **1RM Calculator** — built-in calculator using the Epley formula: `1RM = (M × k) / 30 + M`
- **Up to 7 training days** — flexible split for any program
- **Progress bars** — see exactly where you are in the cycle (week and stage)
- **Step back button** — had a bad session? Roll back one week for any exercise
- **4 languages** — English, Русский, Українська, Eesti
- **Offline** — all data is stored locally, no internet required

---

## Tech Stack

- **React Native** + **Expo**
- **React Native Reanimated** — animations
- **AsyncStorage** — local data persistence
- **react-native-safe-area-context** — correct insets on Android

---

## Data Storage

All data is stored in AsyncStorage under three keys:

| Key | Contents |
|---|---|
| appLanguage | Selected language (ru / ua / en / ee) |
| daysStructure | JSON array of training days |
| exercises | JSON array of exercises with their progress |

Saves are debounced at 700 ms (350 ms for the Done and Step Back buttons).
