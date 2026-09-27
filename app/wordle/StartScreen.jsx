import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StartScreen() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [wordLength, setWordLength] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  const LanguageOptions = [
    { label: '英文', value: 'english' },
    { label: '中文', value: 'chinese' },
  ];

  const WordLengthOptions = [
    { label: '4 字母', value: 4 },
    { label: '5 字母', value: 5 },
  ];

  const DifficultyOptions = [
    { label: '簡單', value: 'easy' },
    { label: '普通', value: 'normal' },
    { label: '困難', value: 'hard' },
  ];

  const handleStart = () => {
    if (!language) {
      Alert.alert('請選擇語言', '請先選擇遊戲語言');
      return;
    }

    if (language === 'english') {
      if (!wordLength) {
        Alert.alert('請選擇字母數', '請先選擇英文單字的字母數');
        return;
      }
      if (!difficulty) {
        Alert.alert('請選擇難度', '請先選擇英文遊戲難度');
        return;
      }

      router.push({
        pathname: '/wordle/EnglishGame',
        params: { 
          wordLength: wordLength.toString(),
          difficulty,
        },
      });

    }

    if (language === 'chinese') {
      router.push({
        pathname: '/wordle/ChineseGame',
        params: { language },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>猜單字遊戲</Text>

      <TouchableOpacity onPress={() => router.push('/wordle/rules')}>
        <Text style={styles.ruleButtonText}>📘 遊戲規則</Text>
      </TouchableOpacity>

      <Text style={styles.label}>選擇模式</Text>
      <View style={styles.row}>
        {LanguageOptions.map(({ label, value }) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.optionButton,
              language === value && styles.optionButtonSelected,
            ]}
            onPress={() => {
              setLanguage(value);
              setWordLength(null);
              setDifficulty(null);
            }}
          >
            <Text
              style={[
                styles.optionText,
                language === value && styles.optionTextSelected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 英文：字母數 */}
      {language === 'english' && (
        <>
          <Text style={styles.label}>選擇字母數</Text>
          <View style={styles.row}>
            {WordLengthOptions.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.optionButton,
                  wordLength === value && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  setWordLength(value);
                  setDifficulty(null); // 切換字數後重置難度
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    wordLength === value && styles.optionTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* 英文：難度選項 */}
      {language === 'english' && wordLength && (
        <>
          <Text style={styles.label}>選擇難度</Text>
          <View style={styles.row}>
            {DifficultyOptions.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.optionButton,
                  difficulty === value && styles.optionButtonSelected,
                ]}
                onPress={() => setDifficulty(value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    difficulty === value && styles.optionTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>開始遊戲</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#87CEEB',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 10,
    color: '#0e0e0eff',
    textShadowColor: 'rgba(96, 67, 64, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ruleButtonText: {
    color: '#004080',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    textDecorationLine: 'underline',
    marginTop: 40,
    marginBottom: 50,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#004080',
    marginTop: 0,
    marginBottom: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: '#d0d7ff',
  },
  optionButtonSelected: {
    backgroundColor: '#b6e2b6',
    borderColor: '#6ecb63',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#004080',
    fontWeight: '700',
  },
  startButton: {
    marginTop: 40,
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 18,
    alignSelf: 'center',
    shadowColor: '#FF6F61',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
});
