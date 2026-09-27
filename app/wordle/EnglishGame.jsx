import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Keyboard from '../../components/Keyboard';
import TileRow from '../../components/TileRow';
import { checkGuess, ENGLISH_WORDS4_EASY, ENGLISH_WORDS4_HARD, ENGLISH_WORDS4_NORMAL, ENGLISH_WORDS5_EASY, ENGLISH_WORDS5_HARD, ENGLISH_WORDS5_NORMAL } from '../../utils/EnglishGameLogic';




const MAX_GUESSES = 6;



export default function EnglishGame() {
  const params = useLocalSearchParams();
  const wordLen = parseInt(params.wordLength) || 5;
  const difficulty = params.difficulty || 'normal';

  const [guesses, setGuesses] = useState([]);  // 每筆為一個字串
  const [currentInput, setCurrentInput] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const router = useRouter();
  const [allowExit, setAllowExit] = useState(false);
  const navigation = useNavigation();
  const [answer, setAnswer] = useState('');
  const [E_meaning, setE_meaning] = useState('');
  const [pendingKeyColorUpdate, setPendingKeyColorUpdate] = useState(null);
  const [pendingResult, setPendingResult] = useState(false);



  useEffect(() => {
  let pool = [];
  let isHard = false;

  if (wordLen === 4) {
    if (difficulty === 'easy') pool = ENGLISH_WORDS4_EASY;
    else if (difficulty === 'normal') pool = ENGLISH_WORDS4_NORMAL;
    else {
      pool = ENGLISH_WORDS4_HARD;
      isHard = true;
    }
  } else if (wordLen === 5) {
    if (difficulty === 'easy') pool = ENGLISH_WORDS5_EASY;
    else if (difficulty === 'normal') pool = ENGLISH_WORDS5_NORMAL;
    else {
      pool = ENGLISH_WORDS5_HARD;
      isHard = true;
    }
  }

  const randomEntry = pool[Math.floor(Math.random() * pool.length)];
  const selectedWord = isHard ? randomEntry.word : randomEntry;
  const selectedMeaning = isHard ? randomEntry.E_meaning : '';

  setAnswer(selectedWord);
  setE_meaning(selectedMeaning);

  console.log('[🔍 正確答案]', { word: selectedWord, E_meaning: selectedMeaning });
}, [wordLen, difficulty]);




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
                onPress: () => navigation.dispatch(e.data.action),
              },
            ]
          );
        };

        navigation.addListener('beforeRemove', onBeforeRemove);

        return () => {
          navigation.removeListener('beforeRemove', onBeforeRemove);
        };
      }, [navigation, allowExit])
    );

  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'DEL') {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      if (currentInput.length === wordLen) {
        const upperInput = currentInput.toUpperCase();
        const result = checkGuess(upperInput, answer);

        const newGuesses = [...guesses, { word: upperInput, result }];
        setGuesses(newGuesses);
        setCurrentInput('');

        const isCorrect = upperInput === answer;
        const isLastTurn = newGuesses.length === MAX_GUESSES;

        if (isCorrect || isLastTurn) {
          setPendingResult(true);
          setGameOver(true);
          setWin(isCorrect);
          setAllowExit(true);
        } else {
          setPendingKeyColorUpdate({
            word: upperInput,
            result,
          });
        }
      }
    } else if (currentInput.length < wordLen && /^[A-Z]$/i.test(key)) {
      setCurrentInput((prev) => prev + key.toUpperCase());
    }
  };


  const showInputRow = !gameOver && guesses.length < MAX_GUESSES;
  const filledRowCount = guesses.length + (showInputRow ? 1 : 0);
  const emptyRowCount = MAX_GUESSES - filledRowCount;
  const emptyRows = Array(emptyRowCount).fill('');



  const [keyColors, setKeyColors] = useState({});
  const updateKeyColors = (guess, results) => {
    setKeyColors((prev) => {
      const newColors = { ...prev };
      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const result = results[i];

        // 優先順序 correct > present > absent
        if (result === 'correct') {
          newColors[letter] = 'correct';
        } else if (result === 'present' && newColors[letter] !== 'correct') {
          newColors[letter] = 'present';
        } else if (!newColors[letter]) {
          newColors[letter] = 'absent';
        }
      }
      return newColors;
    });
  };

  return (
    <LinearGradient
    colors={['#74cdf0ff', '#b6e0fe']}
    style={styles.container}
    >
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.languageText}>英文模式</Text>

      <View style={styles.ruleButtonWrapper}>
        <TouchableOpacity onPress={() => router.push('/wordle/rules')}>
          <Text style={styles.ruleButtonText}>📘 遊戲規則</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {/* 已猜的 */}
        {guesses.map((guess, index) => (
          <TileRow
            key={index}
            word={guess.word}
            result={guess.result}
            wordLength={wordLen}
            onAnimationEnd={
              index === guesses.length - 1 && (
                (gameOver && pendingResult) || pendingKeyColorUpdate
              )
                ? () => {
                    if (pendingKeyColorUpdate) {
                      updateKeyColors(
                        pendingKeyColorUpdate.word,
                        pendingKeyColorUpdate.result
                      );
                      setPendingKeyColorUpdate(null);
                    }

                    if (pendingResult) {
                      setTimeout(() => {
                        router.push({
                          pathname: '/wordle/results',
                          params: {
                            win: win.toString(),
                            answer,
                            guesses: JSON.stringify(guesses),
                            wordLength: wordLen.toString(),
                            E_meaning,
                          },
                        });
                      }, 200);
                    }
                  }
                : undefined
            }
          />
        ))}


        {/* 當前輸入中 */}
        {showInputRow && (
          <TileRow word={currentInput} result={[]} wordLength={wordLen} />
        )}

        {/* 補齊空行 */}
        {emptyRows.map((_, index) => (
          <TileRow key={`empty-${index}`} word={''} result={[]} wordLength={wordLen} />
        ))}
      </View>

      <Keyboard onKeyPress={handleKeyPress} keyColors={keyColors} />


    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  ruleButtonWrapper: {
    bottom: 8,
    marginBottom: 10,
    marginLeft: 10,
  },

  ruleButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
    textDecorationLine: 'underline',
    alignItems: 'flex-start'
  },
  languageText: {
    color: '#e3d90dff',
    textShadowColor: 'rgba(33, 8, 6, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
});
