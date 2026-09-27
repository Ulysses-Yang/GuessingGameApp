// GuessingGame/ModeSelect.jsx
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ModeSelect() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>選擇遊戲模式</Text>

      {/* 經典模式按鈕 -> 去 StartScreen */}
      <TouchableOpacity
        style={[styles.card, styles.classicCard]}
        onPress={() => router.push('/GuessingGame/StartScreen')}
      >
        <Text style={styles.cardTitle}>🎲 經典隨機</Text>
        <Text style={styles.cardDesc}>自選位數與難度，電腦隨機出題，挑戰你的運氣與實力。</Text>
      </TouchableOpacity>

      {/* 闖關模式按鈕 -> 去 LevelSelect */}
      <TouchableOpacity
        style={[styles.card, styles.levelCard]}
        onPress={() => router.push('/GuessingGame/LevelSelect')}
      >
        <Text style={styles.cardTitle}>🧩 邏輯闖關</Text>
        <Text style={styles.cardDesc}>觀察既有的猜測紀錄，運用邏輯推理找出唯一的真相。</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8dc9b0ff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  card: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    backgroundColor: 'white',
  },
  classicCard: {
    borderLeftWidth: 8,
    borderLeftColor: '#f34730ff', // 紅色系
  },
  levelCard: {
    borderLeftWidth: 8,
    borderLeftColor: '#225eadff', // 藍色系
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardDesc: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});