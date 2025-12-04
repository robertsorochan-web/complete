export const ghanaianProverbs = [
  {
    twi: "Dua koro gye mframa a, ebu",
    english: "One tree alone cannot stand the storm",
    meaning: "You need support from others",
    applies: ["socialInstance", "team"]
  },
  {
    twi: "Obra ye awowa",
    english: "Life is a journey",
    meaning: "Take it step by step, no rush",
    applies: ["general", "patience"]
  },
  {
    twi: "Aboa a onni dua, Nyame na opra ne ho",
    english: "God protects the tailless animal",
    meaning: "Even when you feel weak, there is hope",
    applies: ["bioHardware", "health"]
  },
  {
    twi: "Ti koro nko agyina",
    english: "One head does not make a council",
    meaning: "Get advice from others",
    applies: ["consciousUser", "awareness"]
  },
  {
    twi: "Wosua a sua kyerɛ",
    english: "When you learn, learn completely",
    meaning: "Take time to understand deeply",
    applies: ["internalOS", "learning"]
  },
  {
    twi: "Kyɛnkyɛn bia ne ne kwan",
    english: "Every crab has its own way of walking",
    meaning: "Your path is unique - don't compare",
    applies: ["culturalSoftware", "values"]
  },
  {
    twi: "Nea ɔpɛ dɛ ɔbɛda ne nkwan mu no, ɔno na ɔbɛtwa ne ho asu",
    english: "He who wants to drink from his own pot must fill it himself",
    meaning: "Take responsibility for your own progress",
    applies: ["personal", "responsibility"]
  },
  {
    twi: "Sɛ wo werɛ fi na wasan hu a, wonnyae",
    english: "If you remember what you forgot and return, you haven't lost",
    meaning: "It's never too late to start again",
    applies: ["general", "restart"]
  }
];

export const getProverbForLayer = (layerKey) => {
  const applicable = ghanaianProverbs.filter(p => 
    p.applies.includes(layerKey) || p.applies.includes('general')
  );
  return applicable.length > 0 
    ? applicable[Math.floor(Math.random() * applicable.length)]
    : ghanaianProverbs[Math.floor(Math.random() * ghanaianProverbs.length)];
};

export const getTwiGreetings = () => [
  { greeting: "Akwaaba!", meaning: "Welcome!" },
  { greeting: "Maakye!", meaning: "Good morning!" },
  { greeting: "Maaha!", meaning: "Good afternoon!" },
  { greeting: "Mema wo aha!", meaning: "I greet you!" }
];

export const ghanaExamples = {
  personal: {
    scenario: "Like Kwame wey dey work for bank but no dey sleep well",
    problem: "Kwame try coffee, try gym, try everything - but nothing work. Why? Because the real problem be stress from work, not sleep itself.",
    solution: "Akↄfa help am see say e need fix work stress first, then sleep go come."
  },
  team: {
    scenario: "Like office wey workers dey resign every month",
    problem: "Manager try salary increase, try team bonding - but people still dey leave. Why? Because trust spoil - people no dey feel safe to talk.",
    solution: "Akↄfa show say Team Spirit low. Fix trust first, then other things go follow."
  },
  business: {
    scenario: "Like Auntie Ama wey chop bar no dey profit",
    problem: "She try new menu, try social media - but sales no dey grow. Why? Because she no dey track her expenses proper.",
    solution: "Akↄfa show say Business Foundation (money tracking) be the wahala. Fix that, everything improve."
  },
  policy: {
    scenario: "Like village wey sanitation project fail",
    problem: "Government try new toilets, try education campaign - but people no dey use am. Why? Because community leaders no involve for planning.",
    solution: "Akↄfa show say 'Who Runs Things' score low. Involve chiefs first, then project go succeed."
  }
};

export const actionableTips = {
  bioHardware: {
    low: [
      "Wake up same time every day - even weekends. Na consistency dey help.",
      "Walk for 15 minutes after chop. Small small exercise be key.",
      "Drink water first thing for morning before you touch phone.",
      "No screen 1 hour before sleep. Read book or talk to family instead."
    ],
    medium: [
      "Add one more healthy meal per week. No need change everything at once.",
      "Try sleep 30 minutes earlier tonight.",
      "Take short break every 2 hours if you dey work."
    ]
  },
  internalOS: {
    low: [
      "Write 3 things wey you dey grateful for every morning.",
      "When negative thoughts come, ask yourself: 'This na fact or just fear?'",
      "Talk to one person you trust about how you dey feel.",
      "No compare your inside to other people outside."
    ],
    medium: [
      "Set one small goal for the week and celebrate when you achieve am.",
      "Learn one new thing this week - YouTube free!"
    ]
  },
  culturalSoftware: {
    low: [
      "Write down the 3 things wey matter most to you.",
      "Ask yourself: 'My daily actions match my values?'",
      "Connect with your roots - family history, traditions.",
      "Join one community activity this month."
    ],
    medium: [
      "Spend time with people wey share your values.",
      "Review your goals - they align with wetin truly matter to you?"
    ]
  },
  socialInstance: {
    low: [
      "Call or visit one friend or family member today.",
      "Join one group - church, WhatsApp group, community meeting.",
      "Ask for help with one thing you dey struggle with.",
      "Be the first to reach out - no wait for others."
    ],
    medium: [
      "Plan one outing with friends or family this week.",
      "Check on someone you no hear from for long time."
    ]
  },
  consciousUser: {
    low: [
      "Take 5 minutes every morning to sit quiet and think.",
      "Before big decision, sleep on am - no rush.",
      "Write down your thoughts - even small paper dey okay.",
      "Ask one trusted person for honest feedback about you."
    ],
    medium: [
      "Review your week every Sunday - wetin work, wetin no work?",
      "Practice saying 'let me think about am' before you answer big questions."
    ]
  }
};

export const getActionableTip = (layerKey, score) => {
  const tips = actionableTips[layerKey];
  if (!tips) return null;
  
  const category = score <= 4 ? 'low' : 'medium';
  const categoryTips = tips[category] || tips.low;
  return categoryTips[Math.floor(Math.random() * categoryTips.length)];
};
