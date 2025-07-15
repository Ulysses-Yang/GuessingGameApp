// GameLogic.js
class GuessNumberGame {
  constructor() {
    this.answer = [];
    this.score = 100;
    this.guessHistory = [];
    this.startTime = null;
    this.endTime = null;
    this.generateAnswer();
  }
  generateAnswer() {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.answer = [];
    const firstDigitIndex = Math.floor(Math.random() * 9) + 1;
    this.answer.push(digits.splice(firstDigitIndex, 1)[0]);
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      this.answer.push(digits.splice(randomIndex, 1)[0]);
    }
    console.log(`[DEBUG] The answer is: ${this.answer.join('')}`);
  }
  startGame() {
    this.generateAnswer();
    this.score = 100;
    this.guessHistory = [];
    this.startTime = new Date();
    this.endTime = null;
  }
  makeGuess(inputString) {
    if (!/^\d{4}$/.test(inputString)) {
      return { error: '請輸入四位數字' };
    }
    const guessArray = inputString.split('');
    const uniqueDigits = new Set(guessArray);
    if (uniqueDigits.size !== 4) {
      return { error: '請輸入不重複的四位數字' };
    }
    let a = 0;
    let b = 0;
    for (let i = 0; i < 4; i++) {
      if (guessArray[i] === this.answer[i]) {
        a++;
      } else if (this.answer.includes(guessArray[i])) {
        b++;
      }
    }
    const result = {
      guess: inputString,
      result: `${a}A${b}B`,
      isCorrect: a === 4,
    };
    this.guessHistory.push(result);
    if (result.isCorrect) {
      this.endTime = new Date();
      this.calculateFinalScore();
    }
    return result;
  }
  calculateFinalScore() {
    const guessCount = this.guessHistory.length;
    if (guessCount > 3) {
      this.score -= (guessCount - 3) * 5;
    }
    if (this.score < 0) {
      this.score = 0;
    }
  }
  getDuration() {
    if (!this.startTime || !this.endTime) return "0 秒";
    const durationInSeconds = Math.round((this.endTime - this.startTime) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes} 分 ${seconds} 秒`;
  }
}
export default GuessNumberGame;