// GuessingGame/LevelSelect.jsx
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LEVELS } from '../../utils/LevelData'; // 引入第二步建立的資料

export default function LevelSelect() {
  const router = useRouter();

  const handleSelectLevel = (level) => {
    // 導向 game 頁面，並傳遞特殊的參數
    router.push({
      pathname: '/GuessingGame/game',
      params: {
        digits: level.digits.toString(),
        difficulty: level.difficulty,
        // 關鍵：傳遞預設答案與歷史紀錄
        presetAnswer: level.answer,
        presetHistory: JSON.stringify(level.history), // 陣列轉字串傳遞
        isLevelMode: 'true', // 標記這是闖關模式
        levelId: level.id.toString(),
        maxGuesses: level.maxGuesses,
        levelHint: level.hint,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>選擇關卡</Text>
      <FlatList
        data={LEVELS}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.levelBox} onPress={() => handleSelectLevel(item)}>
            <View style={styles.levelHeader}>
               <Text style={styles.levelId}>Level {item.id}</Text>
               <Text style={styles.levelMeta}>{item.digits}位數</Text>
            </View>
            <Text style={styles.levelTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8dc9b0ff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 40,
  },
  levelBox: {
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#225eadff',
  },
  levelMeta: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  levelTitle: {
    fontSize: 16,
    color: '#333',
  },
});