//GuessingGame/game.jsx
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


import { GuessNumberGame, HINT_TRIGGER_TURNS } from '../../utils/GameLogic';



export default function Game() {
  const router = useRouter();
  const gameRef = useRef(new GuessNumberGame());
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const flatListRef = useRef(null);
  const ITEM_HEIGHT = 48;
  const [hintText, setHintText] = useState('');
  const [hintHistory, setHintHistory] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const { difficulty, digits, presetAnswer, presetHistory, isLevelMode, levelId, maxGuesses, levelHint } = useLocalSearchParams();  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);
  const [allowExit, setAllowExit] = useState(false);
  const [lastGuess, setLastGuess] = useState('');
  const [usedHints, setUsedHints] = useState([]);
  const [hasUsedHintThisRound, setHasUsedHintThisRound] = useState(false);
  const shouldShowHintButtons = isLevelMode !== 'true' && HINT_TRIGGER_TURNS.includes(history.length) && !hasUsedHintThisRound;

let presetCountForUI = 0;
  if (isLevelMode === 'true' && presetHistory) {
    try { presetCountForUI = JSON.parse(presetHistory).length; } catch (e) {}
  }
  // 目前總長度 (包含預設) - 預設長度 = 玩家實際猜過的次數
  const currentRealCount = history.length - presetCountForUI;
  // 計算剩餘 (若無 maxGuesses 則為 null)
  const remainingGuesses = maxGuesses ? (Number(maxGuesses) - currentRealCount) : null;

  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e) => {
        if (allowExit) return; // ✅ 允許跳離，不顯示警告
        e.preventDefault(); // 阻止預設的返回動作

        Alert.alert(
          '警告',
          '你確定要離開遊戲嗎？未完成的進度將會丟失。',
          [
            { text: '留下', style: 'cancel', onPress: () => {} },
            {
              text: '確定離開',
              style: 'destructive',
              onPress: () => {
                // ▼▼▼ 修改這裡 ▼▼▼
                
                // 1. 先移除監聽器，避免我們自己觸發的導航又被攔截，造成無窮迴圈
                navigation.removeListener('beforeRemove', onBeforeRemove);

                // 2. 判斷是否為闖關模式
                if (isLevelMode === 'true') {
                  // 如果是闖關模式，強制跳轉到關卡選擇頁
                  router.replace('/GuessingGame/LevelSelect');
                } else {
                  // 經典模式：執行原本的返回動作 (繼續原本要做的 Back 操作)
                  navigation.dispatch(e.data.action);
                }
                
                // ▲▲▲
              },
            },
          ]
        );
      };

      navigation.addListener('beforeRemove', onBeforeRemove);

      return () => {
        navigation.removeListener('beforeRemove', onBeforeRemove);
      };
    }, [navigation, allowExit, isLevelMode]) // 記得把 isLevelMode 加入依賴陣列
  );


  // 自動滾動到最上方（index 0）
  useEffect(() => {
    if (history.length > 0) {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    }
  }, [history]);

  // 鍵盤彈出時也滾動到 index 0
  useEffect(() => {
    const listener = Keyboard.addListener('keyboardDidShow', () => {
      if (history.length > 0) {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      }
    });
    return () => listener.remove();
  }, [history]);

  useEffect(() => {
    if (HINT_TRIGGER_TURNS.includes(history.length)) {
      setHasUsedHintThisRound(false); // 每個新回合重新啟用提示
    }
  }, [history.length]);

    useEffect(() => {
    if (!digits || !difficulty) {
      Alert.alert('錯誤', '缺少遊戲設定，請回到開始畫面重新選擇。', [
        { text: '回到開始', onPress: () => router.replace('/StartScreen') },
      ]);
      return;
    }
     if (!gameRef.current.hasStarted) {
      
      if (isLevelMode === 'true' && presetAnswer && presetHistory) {
        // === 🧩 闖關模式初始化 ===
        const historyData = JSON.parse(presetHistory);
        
        // 調用我們在 Step 1 新增的方法
        gameRef.current.loadPredefinedLevel(
            presetAnswer, 
            historyData, 
            Number(digits), 
            difficulty
        );
      } else {
        // === 🎲 經典模式初始化 (原有邏輯) ===
        gameRef.current.startGame(Number(digits), difficulty);

        if (difficulty === 'hard') {
          gameRef.current.generateGuessWithFixedResult('0A1B');
        } else if (difficulty === 'normal') {
          gameRef.current.generateGuessWithFixedResult('1A0B');
        } else if (difficulty === 'easy') {
          gameRef.current.generateGuessWithFixedResult('1A1B');
        }
      }
    }

    setHistory([...gameRef.current.guessHistory].reverse());
    setIsGameOver(false);
    setFinalMessage('');
    setInputValue('');
    setShowAnswer(false);
    setHintHistory([]);
    setElapsedTime(0);
    startTimer();
    setIsReady(true);
  }, []);


   const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

   // ===啟動計時器 ===
  const startTimer = () => {
    setElapsedTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  // ===停止計時器 ===
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleGuess = () => {
    // 檢查輸入是否合法 (保持不變)
    if (inputValue.startsWith('0')) {
      Alert.alert('輸入錯誤', '數字不能以 0 開頭，請重新輸入。');
      setInputValue('');
      return;
    }

    const result = gameRef.current.makeGuess(inputValue);
    if (result.error) {
      Alert.alert('輸入錯誤', result.error);
    } else {
      // 1. 更新歷史狀態
      const newHistory = [...gameRef.current.guessHistory];
      setHistory([...newHistory].reverse());

      // ▼▼▼ 2. 統一計算「玩家實際猜測次數」 (提早到這裡算) ▼▼▼
      const totalLen = newHistory.length;
      let deductCount = 0;
      if (isLevelMode === 'true' && presetHistory) {
         try { deductCount = JSON.parse(presetHistory).length; } catch (e) { deductCount = 0; }
      } else {
         deductCount = 1; // 經典模式扣掉電腦開局那次
      }
      // 確保至少為 1
      const playerRealGuessCount = Math.max(1, totalLen - deductCount);
      // ▲▲▲

      if (result.isCorrect) {
        // === 猜對了 (勝利) ===
        stopTimer();
        setAllowExit(true);

        router.push({
          pathname: '/GuessingGame/GameResult',
          params: {
            result: 'win', // 標記勝利
            guess: result.guess,
            guessCount: playerRealGuessCount, // 使用剛算好的次數
            duration: gameRef.current.getDuration(),
            score: gameRef.current.score,
            history: JSON.stringify(gameRef.current.guessHistory),
            hintUsedCount: gameRef.current.hintUsedCount.toString(),
            digits: digits.toString(),
            difficulty: difficulty,
            isLuckWin: gameRef.current.isLuckWin.toString(),
            isLevelMode: isLevelMode,
            levelId: levelId,
          },
        });
      } else {
        // === 猜錯了，檢查是否失敗 ===
        // ▼▼▼ 新增失敗判斷邏輯 ▼▼▼
        if (isLevelMode === 'true' && maxGuesses) {
          const limit = Number(maxGuesses);
          
          // 如果「實際猜測次數」已經達到或超過「限制次數」
          if (playerRealGuessCount >= limit) {
            stopTimer();
            setAllowExit(true);

            Alert.alert("挑戰失敗", "次數已用盡！", [
              {
                text: "查看結果",
                onPress: () => {
                  router.replace({
                    pathname: '/GuessingGame/GameResult',
                    params: {
                      result: 'fail',
                      guess: inputValue,
                      guessCount: playerRealGuessCount,
                      score: 0,
                      history: JSON.stringify(newHistory),
                      digits: digits,
                      difficulty: difficulty,
                      isLevelMode: isLevelMode,
                      levelId: levelId,
                      // ▼▼▼ 修改這裡：不要傳送正確答案 (或是傳 null) ▼▼▼
                      correctAnswer: null,
                      // ▲▲▲
                      maxGuesses: maxGuesses,
                      presetAnswer: presetAnswer,
                      presetHistory: presetHistory,
                    }
                  });
                }
              }
            ]);
            return;
          }
        }
        // ▲▲▲
      }
    }
    setInputValue('');
  };

  const toggleShowAnswer = () => {
    setShowAnswer(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLevelMode === 'true' && (
           <View style={{padding: 8, backgroundColor: '#fff3cd', alignItems: 'center'}}>
              <Text style={{color: '#856404', fontWeight: 'bold'}}>
                 🧩 Level {levelId} - 邏輯挑戰
              </Text>
              {levelHint && (
             <Text style={{
               color: '#666', 
               fontSize: 14, 
               marginTop: 4, 
               fontStyle: 'italic'
             }}>
               💡 提示：{levelHint}
             </Text>
           )}
           </View>
        )}

      { !isReady ? (
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>載入中...</Text>
          <Button title="回到開始" onPress={() => router.replace('/GuessingGame/StartScreen')} />
        </View>
      ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoiding}
    >
    
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: '#555',
            marginBottom: 10,
          }}
        >
          🕒 時間：{formatTime(elapsedTime)}
        </Text>

        {isLevelMode === 'true' && maxGuesses && (
          <Text style={{ 
            textAlign: 'center', 
            fontSize: 18, 
            color: '#d00', 
            fontWeight: 'bold', 
            marginBottom: 10 
          }}>
            ⚠️ 剩餘次數：{Math.max(0, remainingGuesses)} 次
          </Text>
        )}

        {!isGameOver && (
          <>
          {isLevelMode !== 'true' && (
            <View style={styles.ruleButtonWrapper}>
              <TouchableOpacity onPress={() => router.push('/GuessingGame/rules')}>
                <Text style={styles.ruleButtonText}>📘 遊戲規則</Text>
              </TouchableOpacity>
            </View>
            )}

            <View style={styles.gameContainer}>
              <TextInput
                style={styles.input}
                placeholder={`請輸入 ${digits} 位不重複數字`}
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
                maxLength={Number(digits)}
                value={inputValue}
                onChangeText={setInputValue}
              />
              
              <TouchableOpacity style={styles.button} onPress={handleGuess} activeOpacity={0.7}>
                <Text style={styles.buttonText}>猜!</Text>
              </TouchableOpacity>

              {/* <View style={{ marginTop: 10 }}>
                <Button
                  title={showAnswer ? '隱藏答案' : '顯示答案'}
                  onPress={toggleShowAnswer}
                  color="#888"
                />
              </View> */}

              {showAnswer && (
                <Text style={styles.answerText}>
                  答案：{gameRef.current.answer.join('')}
                </Text>
              )}

               {/* 提示按鈕區域始終渲染，僅改變透明度 */}
            <View style={{ width: '100%', marginTop: 20, height: 50, position: 'relative' }}>
              {shouldShowHintButtons && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 50, // 固定高度，保持佔位
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500' }}>提示</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '500', marginRight: 0 }}>
                    （第幾個位置）
                  </Text>

                  {Array.from({ length: Number(digits) }, (_, i) => i + 1).map((pos) => {
                    const isUsed = usedHints.includes(pos);

                    return (
                      <TouchableOpacity
                        key={pos}
                        style={[
                          styles.hintButton,
                          isUsed && styles.hintButtonDisabled,
                        ]}
                        onPress={() => {
                          const value = gameRef.current.getHint(pos);
                          const newHint = { position: pos, value };

                          setHintText(`第 ${pos} 個位置的數字是 ${value}`);
                          gameRef.current.addHintPenalty();

                          setHintHistory((prev) => {
                            const updated = [...prev.filter(h => h.position !== pos), newHint];
                            return updated.sort((a, b) => a.position - b.position);
                          });

                          setUsedHints((prev) => [...prev, pos]);
                          setHasUsedHintThisRound(true);
                        }}
                        disabled={isUsed}
                      >
                        <Text style={styles.hintButtonText}>{pos}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
              
            {/* 提示文字絕對定位覆蓋按鈕原本位置 */}
            {hintText !== '' && !shouldShowHintButtons && (
              <Text
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  fontSize: 16,
                  color: 'black',
                  textAlign: 'center',
                }}
              >
                {hintText}
              </Text>
            )}
              
            </View>

              {hintHistory.length > 0 && (
                <View
                  style={{
                    marginTop: 10,
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    提示紀錄：
                  </Text>
                  {hintHistory.map((hint) => (
                    <Text
                      key={hint.position}
                      style={{
                        color: 'black',
                        fontSize: 15,
                        marginBottom: 2,
                      }}
                    >
                      • 第 {hint.position} 個位置的數字是 {hint.value}
                    </Text>
                  ))}
                </View>
              )}

              {history.length > 0 && (
                <View style={styles.historyListWrapper}>
                  <FlatList
                    ref={flatListRef}
                    data={history}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      const isComputerGuess = index === history.length - 1;

                      return (
                        <View style={styles.historyItemContainer}>
                          <Text style={[styles.historyItem, { flex: 1, textAlign: 'left' }]}>
                            {item.guess} { (isComputerGuess && isLevelMode !== 'true') ? '(電腦猜的)' : '' }
                          </Text>
                          <Text style={[styles.historyItem, { flex: 1, textAlign: 'right' }]}>
                            {item.result}
                          </Text>
                        </View>
                      );
                    }}
                    getItemLayout={(data, index) => ({
                      length: ITEM_HEIGHT,
                      offset: ITEM_HEIGHT * index,
                      index,
                    })}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    onContentSizeChange={() => {
                      flatListRef.current?.scrollToIndex({
                        index: 0,
                        animated: true,
                      });
                    }}
                  />
                </View>
            )}
            </View>
          </>
        )}

      </View>
    </KeyboardAvoidingView>
    )}
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#8dc9b0ff',
  },

  keyboardAvoiding: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#8dc9b0ff',
  },

  ruleButtonWrapper: {
    bottom: 8,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },

  ruleButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
    textDecorationLine: 'underline',
    alignItems: 'flex-start'
  },

   button: {
    backgroundColor: '#f85454ee',    // iOS 藍色
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',            // 陰影（iOS）
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,                   // 陰影（Android）
  },

  buttonText: {
    color: '#dceaeaff',
    fontSize: 18,
    fontWeight: '600',
  },

  gameContainer: {
    alignItems: 'center',
    width: '100%',
  },

  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffffff',
    padding: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
  },

  hintButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    marginHorizontal: 6,
    marginVertical: 6,
    minWidth: 44,
    alignItems: 'center',
  },

  hintButtonDisabled: {
    backgroundColor: '#aaa',
    opacity: 0.5,
  },

  hintButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  historyItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 8,
  },

  historyItem: {
    fontSize: 18,
    fontFamily: 'monospace',
  },

  historyListWrapper: {
  flexGrow: 0,
  height: 500,
  width: '100%',
  paddingHorizontal: 8,
  marginTop: 20,
  },

  answerText: {
    marginTop: 10,
    fontSize: 18,
    color: '#d00',
    fontWeight: 'bold',
  },
});
