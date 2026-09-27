import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ChineseKeyboard from '../../components/ChineseKeyboard'; // 你的鍵盤元件
import IdiomTileRow from '../../components/TileRow'; // 顯示每行猜測結果
import { IDIOMS, checkIdiomGuess, generateCharacterPool, } from '../../utils/ChineseGameLogic'; // 成語庫與猜測檢查

const MAX_GUESSES = 5;
const IDIOM_LENGTH = 4;

export default function ChineseIdiomGame() {
  const [guesses, setGuesses] = useState([]); // 每筆是字串（成語）
  const [currentInput, setCurrentInput] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const [allowExit, setAllowExit] = useState(false);
  const [answer, setAnswer] = useState('');
  const [keyboardKeys, setKeyboardKeys] = useState([]);
  const [keyColors, setKeyColors] = useState({});
  const [answerMeaning, setAnswerMeaning] = useState('');
  const [pendingKeyColorUpdate, setPendingKeyColorUpdate] = useState(null);
  const [pendingResult, setPendingResult] = useState(false);


  useEffect(() => {
    // 隨機挑選四字成語作為答案
    const fourCharIdioms = IDIOMS.filter((item) => item.word.length === IDIOM_LENGTH);
    const randomIdiom = fourCharIdioms[Math.floor(Math.random() * fourCharIdioms.length)];
    console.log('[🔍 正確答案]', randomIdiom.word);
    setAnswer(randomIdiom.word);
    setAnswerMeaning(randomIdiom.C_meaning);
    const pool = generateCharacterPool(randomIdiom.word);
    setKeyboardKeys(pool);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e) => {
        if (allowExit) return;
        e.preventDefault();

        Alert.alert(
          '警告',
          '你確定要離開遊戲嗎？未完成的進度將會丟失。',
          [
            { text: '留下', style: 'cancel' },
            {
              text: '確定離開',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      };

      navigation.addListener('beforeRemove', onBeforeRemove);
      return () => navigation.removeListener('beforeRemove', onBeforeRemove);
    }, [navigation, allowExit])
  );

  const handleKeyPress = (key) => {
    if (gameOver || !answer) return;

    if (key === 'DEL') {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      if (currentInput.length === IDIOM_LENGTH) {
        const result = checkIdiomGuess(currentInput, answer);
        const newGuesses = [...guesses, { word: currentInput, result }];
        setGuesses(newGuesses);
        setCurrentInput('');

        const isCorrect = currentInput === answer;
        const isLastTurn = newGuesses.length === MAX_GUESSES;

        if (isCorrect || isLastTurn) {
          setPendingResult(true);
          setGameOver(true);
          setWin(isCorrect);
          setAllowExit(true);
        } else {
          setPendingKeyColorUpdate({ word: currentInput, result });
        }
    }
    } else if (currentInput.length < IDIOM_LENGTH) {
      setCurrentInput((prev) => prev + key);
    }
  };

  const updateKeyColors = (guessList) => {
    const newColors = { ...keyColors };

    guessList.forEach(({ word, result }) => {
        word.split('').forEach((char, idx) => {
        const status = result[idx];
        const prev = newColors[char];

        if (status === 'correct') {
            newColors[char] = 'correct';
        } else if (status === 'present') {
            if (prev !== 'correct') {
            newColors[char] = 'present';
            }
        } else if (status === 'absent') {
            if (!prev) {
            newColors[char] = 'absent';
            }
        }
        });
    });

    setKeyColors(newColors);
    };


    const showInputRow = !gameOver && guesses.length < MAX_GUESSES;
    const filledRowCount = guesses.length + (showInputRow ? 1 : 0);
    const emptyRowCount = MAX_GUESSES - filledRowCount;
    const emptyRows = Array(emptyRowCount).fill('');


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.panel}>
            <Text style={styles.languageText}>中文成語模式</Text>
            <View style={styles.ruleButtonWrapper}>
                <TouchableOpacity onPress={() => router.push('/wordle/rules')}>
                    <Text style={styles.ruleButtonText}>📘 遊戲規則</Text>
                </TouchableOpacity>
            </View>

      <View style={styles.grid}>

        {guesses.map((guess, index) => (
          <IdiomTileRow
            key={index}
            word={guess.word}
            result={guess.result}
            wordLength={IDIOM_LENGTH}
            onAnimationEnd={
              index === guesses.length - 1 && (
                (gameOver && pendingResult) || pendingKeyColorUpdate
              )
                ? () => {
                    if (pendingKeyColorUpdate) {
                        updateKeyColors([
                            {
                            word: pendingKeyColorUpdate.word,
                            result: pendingKeyColorUpdate.result,
                            },
                        ]);
                        setPendingKeyColorUpdate(null);
                    }

                    if (pendingResult) {
                      setTimeout(() => {
                        router.push({
                          pathname: '/wordle/results',
                          params: {
                            win: win.toString(),
                            answer,
                            C_meaning: answerMeaning,
                            guesses: JSON.stringify(guesses),
                            wordLength: IDIOM_LENGTH.toString(),
                          },
                        });
                      }, 200);
                    }
                  }
                : undefined
            }
          />
        ))}

        {!gameOver && guesses.length < MAX_GUESSES && (
            <IdiomTileRow
            word={currentInput}
            result={[]}
            wordLength={IDIOM_LENGTH}
            />
        )}

          {emptyRows.map((_, index) => (
                <IdiomTileRow
                key={`empty-${index}`}
                word={''}
                result={[]}
                wordLength={IDIOM_LENGTH}
                />
            ))}

        </View>
        {answer && (
            <ChineseKeyboard
                keys={keyboardKeys}
                onKeyPress={handleKeyPress}
                keyColors={keyColors}
            />
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // 天空藍背景
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  languageText: {
    color: '#e3d90dff', // 點綴色
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(33, 8, 6, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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

  grid: {
    gap: 10,
    marginBottom: 20,
    flex: 1,
    justifyContent: 'center',
  },
});
