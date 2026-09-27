// utils/GameLogic.js

// HINT_TRIGGER_TURNS 不是計分參數，可以保留
export const HINT_TRIGGER_TURNS = [5, 7, 9];

// ▼▼▼ 新增：匯出所有計分參數 ▼▼▼
// 未來您只需要修改這裡，遊戲邏輯和規則頁面就會同步更新！
export const SCORING_PARAMETERS = {
   '3-easy':   { title: '三位數 簡單', hint: 5, guessLeast: 7, guessDeduct: 2.0, timeDeduct: 0.25 },
   '3-normal': { title: '三位數 普通', hint: 5, guessLeast: 6, guessDeduct: 2.5, timeDeduct: 0.20 },
   '3-hard':   { title: '三位數 困難', hint: 5, guessLeast: 5, guessDeduct: 2.5, timeDeduct: 0.20 },
   '4-easy':   { title: '四位數 簡單', hint: 5, guessLeast: 6, guessDeduct: 2.0, timeDeduct: 0.10 },
   '4-normal': { title: '四位數 普通', hint: 5, guessLeast: 5, guessDeduct: 2.2, timeDeduct: 0.07 },
   '4-hard':   { title: '四位數 困難', hint: 5, guessLeast: 5, guessDeduct: 2.2, timeDeduct: 0.06 },
};
// ▲▲▲

export class GuessNumberGame {
    constructor() {
       this.digitsCount = 4;
       this.difficulty = 'normal'; // 預設難度
       this.answer = [];
       this.score = 100;
       this.guessHistory = [];
       this.startTime = null;
       this.endTime = null;
       this.showAnswer = false;
       this.hintPenalty = 0;
       this.hintUsedCount = 0;
       this.hasStarted = false;
       this.isLuckWin = false;   // 標記是否為 2 次內的運氣勝利

     // ▼▼▼ 預設值 (會被 setScoringParameters 覆蓋) ▼▼▼
     this.hintPenaltyValue = 5;
     this.guessCountLeast = 3;
     this.guessPointDeducted = 2.5;
     this.timeDeducted = 0.08;
     // ▲▲▲
    }

   /**
    * 🚀 根據位數和難度，設定本局的計分規則
    */
   setScoringParameters() {
     const d = this.digitsCount;
     const diff = this.difficulty;

     // ▼▼▼ 修改：改為讀取 SCORING_PARAMETERS ▼▼▼
     let params;
     const key = `${d}-${diff}`;

     if (SCORING_PARAMETERS[key]) {
        params = SCORING_PARAMETERS[key];
     } else {
        // 預設 (fallback)
        params = { hint: 5, guessLeast: 3, guessDeduct: 2.5, timeDeduct: 0.08 };
     }

     this.hintPenaltyValue = params.hint;
     this.guessCountLeast = params.guessLeast;
     this.guessPointDeducted = params.guessDeduct;
     this.timeDeducted = params.timeDeduct;
     // ▲▲▲
   }

    generateAnswer() {
       const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
       this.answer = [];
       const firstDigitIndex = Math.floor(Math.random() * 9) + 1;
       this.answer.push(digits.splice(firstDigitIndex, 1)[0]);

       for (let i = 1; i < this.digitsCount; i++) {
          const randomIndex = Math.floor(Math.random() * digits.length);
          this.answer.push(digits.splice(randomIndex, 1)[0]);
       }
       console.log(`[DEBUG] The answer is: ${this.answer.join('')}`);
    }

    startGame(digitsCount, difficulty) {
       if (this.hasStarted) return;

     this.digitsCount = digitsCount;
     this.difficulty = difficulty || 'normal'; // 儲存難度
     this.setScoringParameters(); // 🚀 根據難度設定計分

       this.generateAnswer();
       this.score = 100;
       this.guessHistory = [];
       this.startTime = new Date();
       this.endTime = null;
       this.hintPenalty = 0;
       this.hintUsedCount = 0;
       this.hasStarted = true;
       this.isLuckWin = false;
    }

    restartGame(digitsCount = this.digitsCount) {
       this.hasStarted = false;
       this.startGame(digitsCount, this.difficulty); 
    }

    /**
   * 🧩 闖關模式專用：載入預設關卡
   * @param {string} answerStr - 正確答案字串 (e.g. "123")
   * @param {Array} historyData - 預設的歷史紀錄陣列
   * @param {number} digits - 位數
   * @param {string} difficulty - 難度 (通常固定為 normal 或 hard)
   */
  loadPredefinedLevel(answerStr, historyData, digits, difficulty) {
      // 1. 基礎重置
      this.hasStarted = false;
      this.startGame(digits, difficulty);

      // 2. 強制覆蓋答案
      // 將字串 "123" 轉為 ['1', '2', '3']
      this.answer = answerStr.split(''); 
      
      // 3. 強制覆蓋歷史紀錄
      // 注意：這裡假設傳進來的 historyData 格式已經正確
      this.guessHistory = JSON.parse(JSON.stringify(historyData)); 
      
      console.log(`[Level Mode] Level loaded. Answer: ${this.answer.join('')}`);
  }

    makeGuess(inputString) {
       const regex = new RegExp(`^\\d{${this.digitsCount}}$`);
       if (!regex.test(inputString)) {
          return { error: `請輸入${this.digitsCount}位數字` };
       }

       const guessArray = inputString.split('');
       const uniqueDigits = new Set(guessArray);
       if (uniqueDigits.size !== this.digitsCount) {
          return { error: `請輸入不重複的${this.digitsCount}位數字` };
       }

       let a = 0;
       let b = 0;
       for (let i = 0; i < this.digitsCount; i++) {
          if (guessArray[i] === this.answer[i]) {
             a++;
          } else if (this.answer.includes(guessArray[i])) {
             b++;
          }
       }

       const result = {
          guess: inputString,
          result: `${a}A${b}B`,
          isCorrect: a === this.digitsCount,
       };

       this.guessHistory.push(result);

       if (result.isCorrect) {
          this.endTime = new Date();
          // 運氣局邏輯：(電腦猜1 + 玩家猜2 = 總共3次)
          if (this.guessHistory.length <= 3) {
                 this.isLuckWin = true;
             }
          this.calculateFinalScore();
       }

       return result;
    }

    getDuration() {
       if (!this.startTime || !this.endTime) return "0 秒";
       const durationInSeconds = Math.round((this.endTime - this.startTime) / 1000);
       const minutes = Math.floor(durationInSeconds / 60);
       const seconds = durationInSeconds % 60;
       return `${minutes} 分 ${seconds} 秒`;
    }

    addHintPenalty() {
       this.hintPenalty += this.hintPenaltyValue; 
       this.hintUsedCount += 1;
    }

    calculateFinalScore() {
       const guessCount = this.guessHistory.length - 1; // -1 扣掉電腦猜的
       const durationInSeconds = (this.endTime - this.startTime) / 1000;

       const guessPenalty = guessCount > this.guessCountLeast
          ? (guessCount - this.guessCountLeast) * this.guessPointDeducted
          : 0;
       const timePenalty = durationInSeconds * this.timeDeducted;

       this.score = 100 - guessPenalty - timePenalty - this.hintPenalty;

       let rounded = Math.round(this.score * 100) / 100;
       this.score = Math.max(0, rounded);
    }

    toggleShowAnswer() {
       this.showAnswer = !this.showAnswer;
    }

    getAnswer() {
       if (this.showAnswer) {
          return this.answer.join('');
       } else {
          return null;
       }
    }

    getHint(position) {
       if (position < 1 || position > this.digitsCount) {
          return null;
       }
       return this.answer[position - 1];
    }

    generateGuessWithFixedResult(targetResult) {
       let guess, result;
       let tries = 0;
       do {
          guess = this.generateUniqueNumber();
          result = this.checkGuess(guess);
          tries++;
          if (tries > 10000) break; 
       } while (result !== targetResult);

       const guessRecord = {
          guess: guess.join(''),
          result,
          isCorrect: false,
          source: 'computer',
       };

       this.guessHistory.push(guessRecord);
       return guessRecord;
    }

    generateUniqueNumber() {
       const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
       const result = [];
       const firstIndex = Math.floor(Math.random() * 9) + 1;
       result.push(digits.splice(firstIndex, 1)[0]);
       for (let i = 1; i < this.digitsCount; i++) {
          const index = Math.floor(Math.random() * digits.length);
          result.push(digits.splice(index, 1)[0]);
       }
       return result;
    }

    checkGuess(inputGuessArray) {
       let a = 0;
       let b = 0;
       for (let i = 0; i < this.digitsCount; i++) {
          if (inputGuessArray[i] === this.answer[i]) {
             a++;
          } else if (this.answer.includes(inputGuessArray[i])) {
             b++;
          }
       }
       return `${a}A${b}B`;
    }
}

