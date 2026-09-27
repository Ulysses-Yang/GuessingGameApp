// GuessingGame/GameResult.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GameResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 使用 ref 來儲存當前遊戲的 timestamp
  const currentTimestampRef = useRef(new Date().toISOString());

  // ▼▼▼ 新增：接收結果狀態與正確答案 ▼▼▼
  const resultStatus = params.result || 'win'; // 預設為 win (相容舊版)
  const isFail = resultStatus === 'fail';
  const correctAnswer = params.correctAnswer || '???';
  // ▲▲▲

  const isHistoryView = params.isHistoryView === 'true';
  const isLevelMode = params.isLevelMode === 'true';

  const digits = params.digits ? Number(params.digits) : 0;
  const difficulty = params.difficulty || 'unknown';
  const isLuckWin = params.isLuckWin === 'true';

  const guess = params.guess || '';
  const guessCount = params.guessCount ? Number(params.guessCount) : 0;
  const duration = params.duration || '';
  const score = params.score ? Number(params.score) : 0;
  const hintUsedCount = params.hintUsedCount ? Number(params.hintUsedCount) : 0;
  const history = params.history ? JSON.parse(params.history) : [];

  const [detailedHistory, setDetailedHistory] = useState(history);
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    // ▼▼▼ 修改：如果是歷史檢視、闖關模式、或是失敗狀態，都不執行儲存動作
    if (!isHistoryView && !isLevelMode && !isFail) {
      const saveHistory = async () => {
        const timestamp = new Date().toISOString();
        currentTimestampRef.current = timestamp;

        const existing = await AsyncStorage.getItem('scoreHistory');
        const parsed = existing ? JSON.parse(existing) : [];

        const newEntry = {
          guess,
          guessCount,
          duration,
          score,
          hintUsedCount,
          history: detailedHistory,
          digits,
          difficulty,
          isLuckWin,
          timestamp,
        };

        parsed.push(newEntry);
        await AsyncStorage.setItem('scoreHistory', JSON.stringify(parsed));

        if (!isLuckWin) {
          // 計算排名邏輯 (僅限經典模式)
          const categoryScores = parsed.filter(item => 
            item.digits === digits && 
            item.difficulty === difficulty &&
            !item.isLuckWin 
          );

          const sorted = [...categoryScores].sort((a, b) => b.score - a.score);
          const rank = sorted.findIndex(item => item.timestamp === timestamp) + 1;
          setRanking(rank);
        }
      };

      saveHistory();
    }
  }, []);

  // ▼▼▼ 修改：根據成功或失敗顯示不同訊息 ▼▼▼
  const message = isFail
    ? `很遺憾，次數用盡！\n請重新挑戰！` // <--- 這裡不再顯示正確答案
    : `恭喜！答案是 ${guess}！\n` +
      `您一共猜了 ${guessCount} 次。\n` + 
      `共使用提示 ${hintUsedCount} 次。\n` +
      `總耗時：${duration}`;

  // 根據狀態改變訊息框顏色
  const messageStyle = isFail 
    ? [styles.finalMessage, { backgroundColor: '#ffe6e6', borderColor: '#ffcccc' }]
    : styles.finalMessage;
  // ▲▲▲

  const handleRestartLevel = () => {
    router.replace({
      pathname: '/GuessingGame/game',
      params: {
        // 把原本傳進來的關卡參數，原封不動傳回去
        isLevelMode: params.isLevelMode,
        levelId: params.levelId,
        digits: params.digits,
        difficulty: params.difficulty,
        maxGuesses: params.maxGuesses,
        presetAnswer: params.presetAnswer,
        presetHistory: params.presetHistory,
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.resultsContainer}>
          
          <Text style={messageStyle}>{message}</Text>

          {/* ▼▼▼ 修改：UI 顯示邏輯區分模式 ▼▼▼ */}
          {isFail ? (
             // --- 失敗顯示區 ---
             <View style={styles.levelSuccessBox}>
                <Text style={[styles.levelSuccessText, { color: '#d00' }]}>🚫 闖關失敗</Text>
                <Text style={styles.levelSuccessSubText}>差一點點，再接再厲！</Text>
             </View>
          ) : (
             // --- 成功顯示區 ---
             isLevelMode ? (
                // 闖關模式成功
                <View style={styles.levelSuccessBox}>
                   <Text style={styles.levelSuccessText}>🧩 闖關成功！</Text>
                   <Text style={styles.levelSuccessSubText}>完美的邏輯推理！</Text>
                </View>
             ) : (
                // 經典模式成功 (包含分數、排名、運氣判定)
                <>
                  {isLuckWin ? (
                   <Text style={styles.luckText}>
                     🍀 運氣太好了！ (2次內猜中){"\n"}
                     本次成績不列入排名計算。
                   </Text>
                 ) : (
                   <>
                     <Text style={styles.scoreText}>最終得分：{score.toFixed(2)}</Text>
                     {ranking && typeof ranking === 'number' && (
                       <Text style={styles.rankText}>
                         {ranking == 1
                           ? '🎖️ 恭喜突破最佳成績!排名歷史第一名!'
                           : `🎖️ 本次成績為歷史第 ${ranking} 名`}
                       </Text>
                     )}
                   </>
                 )}
                </>
             )
          )}
          {/* ▲▲▲ */}

          {!isHistoryView && (
            <>
              {/* ▼▼▼ 修改：按鈕區分模式 ▼▼▼ */}
              {isLevelMode ? (
                // 闖關模式按鈕
                <View style={{ width: '100%', alignItems: 'center' }}>
                  
                  {/* 如果失敗，提供一個「再試一次」按鈕 */}
                  {isFail && (
                    <TouchableOpacity
                      style={[styles.restartButton, { backgroundColor: '#6c757d', marginBottom: 12 }]}
                      onPress={handleRestartLevel}
                    >
                      <Text style={styles.restartButtonText}>🔄 再試一次</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.restartButton, { backgroundColor: '#225eadff' }]}
                    onPress={() => router.replace('/GuessingGame/LevelSelect')}
                  >
                    <Text style={styles.restartButtonText}>回到關卡列表</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // 經典模式按鈕 -> 重新開始 / 查看歷史
                <>
                  <TouchableOpacity
                    style={styles.restartButton}
                    onPress={() => router.replace('/GuessingGame/StartScreen')}
                  >
                    <Text style={styles.restartButtonText}>重新開始</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.restartButton, { backgroundColor: '#28a745', marginTop: 12 }]}
                    onPress={() => {
                      router.push({
                        pathname: '/GuessingGame/ScoreHistory',
                        params: {
                          currentTimestamp: currentTimestampRef.current,
                          autoSelectDigits: digits.toString(),
                          autoSelectDifficulty: difficulty,
                        },
                      });
                    }}
                  >
                    <Text style={styles.restartButtonText}>查看歷史分數</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>猜測紀錄：</Text>
          {detailedHistory.length === 0 ? (
            <Text>無猜測紀錄。</Text>
          ) : (
            detailedHistory.map((item, index) => (
              <View key={index} style={styles.historyItemRow}>
                <Text style={styles.historyGuessText}>
                  {item.guess} {index === 0 && !isLevelMode ? '(電腦猜的)' : ''} 
                </Text>
                <Text style={styles.historyResultText}>{item.result}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#8dc9b0ff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  resultsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  finalMessage: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30,
    padding: 15,
    backgroundColor: '#f5c868c8',
    borderColor: '#91d5ff',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 22,
  },
  // --- 新增樣式 ---
  levelSuccessBox: {
    alignItems: 'center',
    marginVertical: 10,
  },
  levelSuccessText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#225eadff',
    marginBottom: 8,
  },
  levelSuccessSubText: {
    fontSize: 16,
    color: '#555',
  },
  // ---------------
  scoreText: {
    fontSize: 18,
    color: '#dc250dff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 10,
  },
  luckText: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#006400', 
     textAlign: 'center',
     marginVertical: 20,
     padding: 10,
     backgroundColor: '#e6f7e6', 
     borderRadius: 8,
     lineHeight: 28,
   },
  restartButton: {
    marginTop: 12, // 微調間距
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignSelf: 'center',
    minWidth: 200, // 讓按鈕寬度一致比較好看
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  historyItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  historyGuessText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
    marginRight: 8,
  },
  historyResultText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'right',
  },
});