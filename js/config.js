// Reward configuration

const CONFIG = {
  dailyHabitReward: 5,
  dailyFullBonus: 15,
  dontBonus: 10,

  weeklyReward: 40,
  biweeklyReward: 80,

  streakMultipliers: [
    { min: 1, max: 6, value: 1 },
    { min: 7, max: 13, value: 1.1 },
    { min: 14, max: 29, value: 1.25 },
    { min: 30, max: 59, value: 1.5 },
    { min: 60, max: Infinity, value: 1.75 }
  ],

  penalties: {
    streakBreak: 20,
    consecutiveMiss: 20,
    dontBreak: 15,
    allDontBreak: 20,
    weeklyMiss: 25
  },

  dailyHabits: [
    { id: "wake", label: "Wake up at 7:15", type: "boolean", frequency: "daily", reward: 5 },
    { id: "water", label: "Drink water bottles", type: "count", frequency: "daily", reward: 2 },
    { id: "brush", label: "Brush twice", type: "boolean", frequency: "daily", reward: 3 },
    { id: "learn", label: "Learn 1 code topic", type: "boolean", frequency: "daily", reward: 10 },
    { id: "revise", label: "Revise previous code", type: "boolean", frequency: "daily", reward: 8 }
  ],

  weeklyHabits: [
    { id: "crochet", label: "Crochet 2 hrs", type: "boolean", frequency: "weekly", reward: 25 },
    { id: "restroom", label: "Clean restroom 3x", type: "boolean", frequency: "weekly", reward: 40 }
  ],

  biweeklyHabits: [
    { id: "cook", label: "Cook a dish", type: "boolean", frequency: "biweekly", reward: 30 }
  ],

  dontHabits: [
    { id: "touch", label: "No touch", penalty: 15 },
    { id: "social", label: "No unnecessary social media", penalty: 15 },
    { id: "badTalk", label: "No bad talk / thoughts", penalty: 15 }
  ]
};
