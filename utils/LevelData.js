// utils/LevelData.js

export const LEVELS = [
  {
    id: 1,
    title: "新手題：排除法",
    digits: 3,
    answer: "780",
    // ▼ 新增這行：限制玩家只能猜 2 次
    maxGuesses: 2, 
    history: [
      { guess: "123", result: "0A0B", isCorrect: false },
      { guess: "456", result: "0A0B", isCorrect: false },
      { guess: "789", result: "2A0B", isCorrect: false },
    ],
  },
  {
    id: 2,
    title: "新手題：位置",
    digits: 3,
    answer: "147",
    // ▼ 新增這行：這關比較難，或許給 3 次？
    maxGuesses: 2,
    history: [
      { guess: "123", result: "1A0B", isCorrect: false },
      { guess: "145", result: "2A0B", isCorrect: false },
      { guess: "146", result: "2A0B", isCorrect: false },
    ],
    hint: "從146得之2A0B後可繼續猜14多少。",
  },
  {
    id: 3,
    title: "新手題：位置",
    digits: 3,
    answer: "138",
    maxGuesses: 2,
    history: [
      { guess: "123", result: "1A1B", isCorrect: false },
      { guess: "134", result: "2A0B", isCorrect: false },
      { guess: "135", result: "2A0B", isCorrect: false },
      { guess: "136", result: "2A0B", isCorrect: false },
    ],
  },
];