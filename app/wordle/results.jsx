import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import TileRow from '../../components/TileRow';

export default function ResultScreen() {
  const router = useRouter();
  const { win, answer, guesses, wordLength, C_meaning, E_meaning } = useLocalSearchParams();
  const parsedGuesses = Array.isArray(guesses) ? guesses : JSON.parse(guesses || '[]');
  const wordLen = parseInt(wordLength) || answer?.length || 4;
  const meaning = C_meaning || E_meaning;
  const isChinese = !!C_meaning;


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>
          {win === 'true' ? '🎉 恭喜你猜對了！' : '💀 很遺憾，挑戰失敗'}
        </Text>
        <Text style={styles.subtitleAnswer}>
            {meaning ? `${isChinese ? '成語：' : '單字：'}${answer}` : `答案是: ${answer}`}
        </Text>

        {meaning && (
            <View style={styles.meaningBlock}>
            <Text style={styles.meaningLabel}>解釋：</Text>
            <Text style={styles.meaningContent}>{meaning}</Text>
            </View>
        )}

        <View style={styles.guessList}>
          <Text style={[styles.subtitle, { marginBottom: 8 }]}>你的猜測紀錄</Text>
          {parsedGuesses.map((guess, index) => (
            <TileRow
              key={index}
              word={guess.word}
              result={guess.result}
              wordLength={wordLen}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] },
          ]}
          onPress={() => router.replace('/wordle/StartScreen')}
        >
          <Text style={styles.buttonText}>再玩一次</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // 天空藍
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 半透明白面板
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF6F61', // 橘紅點綴色
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(255,111,97,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitleAnswer: {
    fontSize: 20,
    color: '#004080', // 深藍色
    textAlign: 'left',
    marginBottom: 10,
  },
  meaningBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 5,
    marginBottom: 10,
  },
  meaningLabel: {
    fontSize: 20,
    color: '#004080',
    marginRight: 5,
  },

  meaningContent: {
    fontSize: 20,
    color: '#004080',
    flex: 1,
    paddingRight: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#004080', // 深藍色
    textAlign: 'center',
    marginBottom: 10,
  },
  guessList: {
    marginTop: 15,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: '#FF6F61',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
  },
});
