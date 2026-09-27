// GuessingGame/StartScreen.jsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StartScreen() {
  const router = useRouter();
  const [digits, setDigits] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  const digitOptions = [
    { label: '三位數', value: 3 },
    { label: '四位數', value: 4 },
  ];

  const difficultyOptions = [
    { label: '簡單', value: 'easy' },
    { label: '普通', value: 'normal' },
    { label: '困難', value: 'hard' },
  ];

  const handleStart = () => {
    if (!digits && !difficulty) {
      Alert.alert('請選擇位數和難度', '請先選擇遊戲的位數和難度，才能開始遊戲。');
      return;
    }
    if (digits && !difficulty) {
      Alert.alert('請選擇難度', '請先選擇遊戲的難度，才能開始遊戲。');
      return;
    }
    if (!digits && difficulty) {
      Alert.alert('請選擇位數', '請先選擇遊戲的位數，才能開始遊戲。');
      return;
    }
    // 導向 game 並傳遞難度參數
    router.push({
    pathname: '/GuessingGame/game',
    params: { digits: digits.toString(), difficulty },
    });
  };

  return (
    <>

    <View style={styles.container}>

        <Text style={styles.title}>猜數字遊戲</Text>

        <View style={styles.buttonRow}>
             {/* ▼▼▼ 修改：左側欄位，只保留按鈕 ▼▼▼ */}
             <View style={styles.buttonColumnLeft}>
               <TouchableOpacity onPress={() => router.push('/GuessingGame/rules')}>
                  <Text style={styles.ruleButtonText}>📘 遊戲規則</Text>
               </TouchableOpacity>
               {/* 警告文字已移出 */}
             </View>
             {/* ▲▲▲ */}

             {/* ▼▼▼ 修改：右側欄位，保持靠右 ▼▼▼ */}
             <View style={styles.buttonColumnRight}>
               <TouchableOpacity onPress={() => router.push('/GuessingGame/ScoreHistory')}>
                  {/* 將樣式改為靠右對齊 */}
                  <Text style={[styles.ruleButtonText, { textAlign: 'right' }]}>
                    📊 分數排行榜
                  </Text>
               </TouchableOpacity>
             </View>
             {/* ▲▲▲ */}
           </View>

          {/* ▼▼▼ 新增：獨立的警告文字區塊 ▼▼▼ */}
          <View style={styles.warningContainer}>
             <Text style={styles.updateWarningText}>
               遊戲規則有更新！務必詳細閱讀！
             </Text>
          </View>


        <Text style={styles.label}>選擇位數</Text>
        <View style={styles.row}>
            {digitOptions.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.optionButton,
                digits === value && styles.optionButtonSelected,
              ]}
              onPress={() => setDigits(value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  digits === value && styles.optionButtonTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
            ))}
        </View>

        <Text style={styles.label}>選擇難度</Text>
        <View style={styles.row}>
          {difficultyOptions.map(({ label, value }) => (
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
                  styles.optionButtonText,
                  difficulty === value && styles.optionButtonTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>開始遊戲</Text>
        </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     paddingHorizontal: 24,
     paddingTop: 80,
     backgroundColor: '#8dc9b0ff',
   },
   title: {
     fontSize: 32,
     fontWeight: 'bold',
     textAlign: 'center',
     marginTop: 30,
     marginBottom: 40,
     color: '#333',
   },

   buttonRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     marginBottom: 20, 
     alignItems: 'flex-start', // 頂部對齊
   },

   // ▼▼▼ 新增：左側欄位樣式 ▼▼▼
   buttonColumnLeft: {
     flex: 1, // 允許此欄位佔用多餘空間
     paddingRight: 10, // 增加一點間距，避免與右側欄位太近
   },
   // ▼▼▼ 新增：右側欄位樣式 ▼▼▼
   buttonColumnRight: {
     flexShrink: 0, // 確保此欄位不會被壓縮
   },
   // ▲▲▲

   ruleButtonText: {
     color: '#007AFF',
     fontSize: 20,
     fontWeight: '500',
     textAlign: 'left',
     textDecorationLine: 'underline',
     // marginBottom: 40, // (此行已移除)
   },
   // ▼▼▼ 新增：警告文字的容器樣式 ▼▼▼
   warningContainer: {
     marginBottom: 30, // 將 buttonRow 的間距移到這裡
     paddingLeft: 5, // 稍微左推，對齊「遊戲規則」按鈕
   },
   // ▲▲▲
   // ▼▼▼ 修改的樣式 ▼▼▼
   updateWarningText: {
     fontSize: 16, 
     color: '#e31818ff', // 紅色
     fontWeight: '700',
     // marginTop: 4, // 移除 marginTop，由 warningContainer 控制
   },
   // ▲▲▲
   label: {
     fontSize: 22,
     fontWeight: '600',
     marginTop: 30,
     marginBottom: 80,
     textAlign: 'center',
     color: '#444',
   },
   row: {
     flexDirection: 'row',
     justifyContent: 'center',
     marginBottom: 32,
   },
   optionButton: {
     paddingVertical: 10,
     paddingHorizontal: 20,
     borderRadius: 12,
     backgroundColor: '#ccc',
     marginHorizontal: 8,
   },
   optionButtonSelected: {
     backgroundColor: '#007aff',
   },
   optionButtonText: {
     fontSize: 16,
     fontWeight: '600',
     color: '#fff',
   },
   optionButtonTextSelected: {
     color: '#fff',
   },
   startButton: {
     backgroundColor: '#f34730ff',
     paddingVertical: 14,
     paddingHorizontal: 32,
     borderRadius: 16,
     alignSelf: 'center',
     marginTop: 40,
   },
   startButtonText: {
     color: 'white',
     fontSize: 18,
     fontWeight: 'bold',
   },

});

