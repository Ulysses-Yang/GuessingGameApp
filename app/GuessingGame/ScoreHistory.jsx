//GuessingGame/ScoreHistory.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const categories = [
  { key: '3-easy',   label: '三位數 簡單', digits: 3, difficulty: 'easy' },
  { key: '3-normal', label: '三位數 普通', digits: 3, difficulty: 'normal' },
  { key: '3-hard',   label: '三位數 困難', digits: 3, difficulty: 'hard' },
  { key: '4-easy',   label: '四位數 簡單', digits: 4, difficulty: 'easy' },
  { key: '4-normal', label: '四位數 普通', digits: 4, difficulty: 'normal' },
  { key: '4-hard',   label: '四位數 困難', digits: 4, difficulty: 'hard' },
];

// 輔助函式：根據傳入的參數找到對應的分類 key
const findCategoryKeyFromParams = (digits, difficulty) => {
  if (!digits || !difficulty) {
    return null;
  }
  const foundCategory = categories.find(cat => 
    cat.digits === Number(digits) && cat.difficulty === difficulty
  );
  return foundCategory ? foundCategory.key : null;
};

export default function ScoreHistory({ route }) {
   const [history, setHistory] = useState([]);
   const router = useRouter();
  
  // 1. 接收所有參數，包含新加入的 autoSelect...
   const { currentTimestamp, autoSelectDigits, autoSelectDifficulty } = useLocalSearchParams();

  // 2. 呼叫輔助函式，計算「初始」該選擇哪個分類
  const initialCategoryKey = findCategoryKeyFromParams(autoSelectDigits, autoSelectDifficulty);

  // 3. 使用計算出來的初始值來設定 state
  // (如果 initialCategoryKey 有值，頁面就會直接顯示該分類的列表)
   const [selectedCategoryKey, setSelectedCategoryKey] = useState(initialCategoryKey);
  
   const historyRef = useRef([]);

  useEffect(() => {
    const loadScoreHistory = async () => {
        const raw = await AsyncStorage.getItem('scoreHistory');
        if (raw) {
        const parsed = JSON.parse(raw);
        historyRef.current = parsed;  // 存入 ref
        setHistory(parsed);           // 用 state 觸發畫面更新
        }
    };
    loadScoreHistory();
    }, []);

  const clearHistory = () => {
    Alert.alert(
        '確認清除',
        '你確定要刪除所有歷史紀錄嗎？此動作無法還原。',
        [
        {
            text: '取消',
            style: 'cancel',
        },
        {
            text: '確定',
            style: 'destructive',
            onPress: async () => {
            await AsyncStorage.removeItem('scoreHistory');
            historyRef.current = [];  // 先清空 ref
            setHistory([]);           // 再更新 state
            setSelectedCategoryKey(null);
            },
        },
        ]
    );
    };

const { category, combinedHistory } = useMemo(() => {
     // 找到當前選擇的分類對象
       const currentCategory = categories.find(c => c.key === selectedCategoryKey);
       if (!currentCategory) {
         return { category: null, combinedHistory: [] };
       }

     // 1. 先過濾出符合分類的
       const categoryItems = history.filter(item => 
         item.digits === currentCategory.digits && item.difficulty === currentCategory.difficulty
     );

     // 2. 進行自訂排序
     const sorted = [...categoryItems].sort((a, b) => {
        const aIsLuck = a.isLuckWin === true;
        const bIsLuck = b.isLuckWin === true;

        if (aIsLuck && !bIsLuck) {
          return -1; // a (運氣局) 在前
        }
        if (!aIsLuck && bIsLuck) {
          return 1;   // b (運氣局) 在前
        }

        // 如果兩者都是運氣局，依日期排 (最新在前)
        if (aIsLuck && bIsLuck) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }

        // 如果兩者都不是運氣局 (都是排名局)，依分數排 (最高在前)
        return (b.score || 0) - (a.score || 0);
     });

     return { 
        category: currentCategory, 
        combinedHistory: sorted
     };
   }, [selectedCategoryKey, history]);

  return (
   <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>

     { !selectedCategoryKey ? (
             // === 狀態一：顯示分類選單 ===
       <>
        <Text style={styles.title}>分數排行榜</Text>
        {categories.map(cat => (
         <TouchableOpacity
          key={cat.key}
          style={styles.categoryButton}
          onPress={() => setSelectedCategoryKey(cat.key)}
         >
          <Text style={styles.categoryButtonText}>{cat.label}</Text>
         </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
         <Text style={styles.clearButtonText}>清除所有紀錄</Text>
        </TouchableOpacity>
       </>

     ) : (
             // === 狀態二：顯示選定分類的紀錄 ===
       <>
          <TouchableOpacity onPress={() => setSelectedCategoryKey(null)} style={styles.backButton}>
             <Text style={styles.backButtonText}>{'< 返回分類'}</Text>
          </TouchableOpacity>

        <Text style={styles.title}>{category.label} - 紀錄</Text>

        {/* ▼▼▼ 修改：渲染單一合併列表 ▼▼▼ */}
        {combinedHistory.length === 0 ? (
         <Text style={styles.noRecordText}>此分類尚無紀錄。</Text>
        ) : (
         <>
            {/*               * 使用 IIFE (立即執行函式) 來管理 rankCounter
              * 這樣 rankCounter 就能在 map 迴圈中被正確追蹤
             */}
            {(() => {
              let rankCounter = 0; // 在 map 之前初始化排名計數器

              return combinedHistory.map((item, index) => {
                 const isCurrent = item.timestamp?.trim() === currentTimestamp?.trim();
                 const isLuck = item.isLuckWin === true;

                 if (isLuck) {
                   // --- 渲染運氣局 ---
                   return (
                    <TouchableOpacity
                       key={item.timestamp || `luck-${index}`}
                       style={[styles.item, styles.luckItem, isCurrent && styles.highlightItem]}
                       onPress={() =>
                         router.push({
                            pathname: '/GuessingGame/GameResult',
                            params: {
                              ...item,
                              guessCount: item.guessCount?.toString() || '0',
                              score: item.score?.toString() || '0',
                              hintUsedCount: item.hintUsedCount?.toString() || '0',
                              digits: item.digits?.toString() || '0',
                              history: JSON.stringify(item.history || []),
                              isHistoryView: 'true',
                              isLuckWin: 'true', // 傳遞正確狀態
                            },
                         })
                       }
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                       <Text style={{ fontSize: 12 }}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                       </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Text style={styles.luckText}>🍀 運氣局</Text>
                       <Text style={{ fontSize: 12 }}>點擊以查看更多</Text>
                      </View>
                    </TouchableOpacity>
                   );
                 } else {
                   // --- 渲染排名局 ---
                   rankCounter++; // 只在排名局時才增加計數
                   return (
                    <TouchableOpacity
                       key={item.timestamp || `rank-${index}`}
                       style={[styles.item, isCurrent && styles.highlightItem]}
                       onPress={() =>
                         router.push({
                            pathname: '/GuessingGame/GameResult',
                            params: {
                              ...item,
                              guessCount: item.guessCount?.toString() || '0',
                              score: item.score?.toString() || '0',
                              hintUsedCount: item.hintUsedCount?.toString() || '0',
                              digits: item.digits?.toString() || '0',
                              history: JSON.stringify(item.history || []),
                              isHistoryView: 'true',
                              isLuckWin: 'false', // 傳遞正確狀態
                            },
                         })
                       }
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                       <Text style={styles.rankText}>#{rankCounter}</Text>
                       <Text style={{ fontSize: 12 }}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                       </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                       <Text style={styles.scoreText}>
                         分數：{item.score != null ? item.score.toFixed(2) : '無紀錄'}
                       </Text>
                       <Text style={{ fontSize: 12 }}>點擊以查看更多</Text>
                      </View>
                    </TouchableOpacity>
                   );
                 }
              });
            })()}
            </>
        )}
        {/* ▲▲▲ */}
       </>
     )}
    </ScrollView>
   </SafeAreaView>
   );
}

const styles = StyleSheet.create({
    safeArea: {
       flex: 1,
       backgroundColor: '#8dc9b0ff',
    },
    container: {
       padding: 24,
    },
    title: {
       fontSize: 20,
       fontWeight: 'bold',
       marginBottom: 16,
       textAlign: 'center',
    },
    categoryButton: {
       backgroundColor: '#f8f9fa',
       paddingVertical: 16,
       paddingHorizontal: 20,
       borderRadius: 10,
       marginBottom: 12,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.1,
       shadowRadius: 4,
       elevation: 3,
    },
    categoryButtonText: {
       fontSize: 18,
       fontWeight: '600',
       color: '#333',
    },
    backButton: {
       marginBottom: 16,
     alignSelf: 'flex-start',
    },
    backButtonText: {
       fontSize: 16,
       color: '#007AFF',
       fontWeight: '600',
    },
   noRecordText: {
     textAlign: 'center',
     fontSize: 16,
     color: '#666',
     marginTop: 20,
   },
    item: {
       marginBottom: 14,
       padding: 12,
       backgroundColor: '#f1f1f1',
       borderRadius: 8,
    },
    luckItem: {
       backgroundColor: '#f9f9f9', // 運氣局使用稍暗的背景
       opacity: 0.9,
    },
    highlightItem: {
       backgroundColor: 'orange',
       borderWidth: 2,
       borderColor: 'red',
    },
    rankText: {
       fontWeight: 'bold',
       fontSize: 16,
       marginBottom: 4,
    },
    scoreText: {
       fontSize: 16,
       color: '#333',
    },
    luckText: {
       fontSize: 16,
       fontWeight: 'bold',
       color: '#006400', // 深綠色
    },
    clearButton: {
       marginTop: 20,
       backgroundColor: '#dc3545',
       paddingVertical: 10,
       paddingHorizontal: 20,
       borderRadius: 50,
       alignSelf: 'center',
    },
    clearButtonText: {
       color: 'white',
       fontWeight: 'bold',
       fontSize: 16,
    },
});
