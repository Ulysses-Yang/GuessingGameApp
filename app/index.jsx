import { useRef, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import GuessNumberGame from '../utils/GameLogic';

export default function GameScreen() {
  const gameRef = useRef(new GuessNumberGame());
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');

  const handleGuess = () => {
    const result = gameRef.current.makeGuess(inputValue);
    if (result.error) {
      Alert.alert('輸入錯誤', result.error);
    } else {
      setHistory([...gameRef.current.guessHistory]);
      if (result.isCorrect) {
        setIsGameOver(true);
        setFinalMessage(
          `恭喜！答案是 ${result.guess}！\n` +
          `您一共猜了 ${gameRef.current.guessHistory.length} 次。\n` +
          `總耗時：${gameRef.current.getDuration()}\n` +
          `最終得分：${gameRef.current.score}`
        );
      }
    }
    setInputValue('');
  };

  const handleRestart = () => {
    gameRef.current.startGame();
    setHistory([]);
    setIsGameOver(false);
    setFinalMessage('');
    setInputValue('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>猜數字遊戲</Text>

          {/* 歷史紀錄 */}
          {history.length > 0 && (
            <FlatList
              style={styles.historyList}
              data={history}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.historyItemContainer}>
                  <Text style={styles.historyItem}>{item.guess}</Text>
                  <Text style={styles.historyItem}>{"=>"}</Text>
                  <Text style={styles.historyItem}>{item.result}</Text>
                </View>
              )}
              inverted
              ListEmptyComponent={<Text style={styles.emptyHistoryText}>請開始你的第一次猜測！</Text>}
            />
          )}

          {/* 遊戲控制區 */}
          {isGameOver ? (
            <View style={styles.resultsContainer}>
              <Text style={styles.finalMessage}>{finalMessage}</Text>
              <Button title="重新開始" onPress={handleRestart} />
            </View>
          ) : (
            <View style={styles.gameContainer}>
              <TextInput
                style={styles.input}
                placeholder="請輸入四位不重複數字"
                keyboardType="number-pad"
                maxLength={4}
                value={inputValue}
                onChangeText={setInputValue}
              />
              <Button title="猜!" onPress={handleGuess} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  historyList: {
    width: '100%',
    marginBottom: 20,
  },
  gameContainer: {
    width: '100%',
    alignItems: 'center',
  },
  resultsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
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
  finalMessage: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30,
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
    borderWidth: 1,
    borderRadius: 8,
  },
  emptyHistoryText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
    fontSize: 16,
  },
});