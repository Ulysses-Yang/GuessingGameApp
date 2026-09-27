//app/GuessingGame/rules.jsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// ▼▼▼ 匯入 SCORING_PARAMETERS ▼▼▼
import { HINT_TRIGGER_TURNS, SCORING_PARAMETERS } from '../../utils/GameLogic';

// 這是正確的，HINT_TRIGGER_TURNS 是 [5, 7, 9] (總猜測次數)
// 減 1 後等於 [4, 6, 8]，代表玩家的第 4, 6, 8 次猜測
const trueHINT_TRIGGER_TURNS = HINT_TRIGGER_TURNS.map(n => n - 1);

// 輔助元件 (不變)
const ScoringDetail = ({ title, hint, guessLeast, guessDeduct, timeDeduct }) => (
   <View style={styles.detailItem}>
     <Text style={styles.detailTitle}>{title}</Text>
     <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>・提示扣分：</Text>
        <Text style={styles.detailValue}>{hint} 分 / 次</Text>
     </View>
     <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>・猜次扣分：</Text>
        <Text style={styles.detailValue}>
          (第 {guessLeast} 猜後) {guessDeduct} 分 / 次
        </Text>
     </View>
     <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>・時間扣分：</Text>
        <Text style={styles.detailValue}>{timeDeduct} 分 / 秒</Text>
     </View>
   </View>
);

export default function Rules() {
   const router = useRouter();
   const [showDetails, setShowDetails] = useState(false);
  
   // ▼▼▼ 將 SCORING_PARAMETERS 轉換為陣列以便 .map() ▼▼▼
   const scoringDetailsArray = Object.values(SCORING_PARAMETERS);
   // ▲▲▲

   return (
     <>
     <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>猜數字遊戲規則</Text>

          <View style={styles.ruleRow}>
             <Text style={styles.ruleNumber}>①</Text>
             <Text style={styles.ruleText}>猜一組三位或四位不重複的數字。</Text>
          </View>

          <View style={styles.ruleRow}>
             <Text style={styles.ruleNumber}>②</Text>
             <Text style={styles.ruleText}>
               每次猜會回饋 xAxB，A 表示數字與位置都對，B 表示數字對但位置錯。{'\n'}
               <Text style={styles.exampleText}>
                  範例：答案為 1234{'\n'}
                  若輸入 1356，則為 1A1B (1對位, 3對數字)
               </Text>
             </Text>
          </View>

          <View style={styles.ruleRow}>
             <Text style={styles.ruleNumber}>③</Text>
             <Text style={styles.ruleText}>
               可使用提示功能查看部分答案。{'\n'}
               在您的第 {trueHINT_TRIGGER_TURNS.join('、')} 次猜測時會觸發提示按鈕。
             </Text>
          </View>

          <View style={styles.ruleRow}>
             <Text style={styles.ruleNumber}>④</Text>
             <Text style={styles.ruleText}>
               總分為 100 分。使用提示、猜測次數過多、花費時間都會扣分。{'\n'}
               <Text style={styles.highlightText}>
                  不同難度的扣分標準不同，請見下方詳細說明。
               </Text>
             </Text>
          </View>

          <View style={styles.ruleRow}>
             <Text style={styles.ruleNumber}>⑤</Text>
             <Text style={styles.ruleText}>猜中即獲勝，會顯示猜測次數、使用提示次數、花費時間與得分。</Text>
          </View>

          <View style={styles.ruleRow}>
             <Text style={styles.ruleNumber}>⑥</Text>
             <Text style={styles.ruleText}>
               🍀 若在 2 次猜測內猜中（不含電腦的第 1 猜），視為「運氣局」，該局將不列入排行榜計分。
             </Text>
          </View>


          <TouchableOpacity
             style={styles.detailButton}
             onPress={() => setShowDetails(!showDetails)}
          >
             <Text style={styles.detailButtonText}>
               {showDetails ? '▲ 隱藏詳細扣分說明' : '▼ 顯示詳細扣分說明'}
             </Text>
          </TouchableOpacity>

          {/* ▼▼▼ 修改：動態渲染詳細說明 ▼▼▼ */}
          {showDetails && (
             <View style={styles.detailContainer}>
               {scoringDetailsArray.map(detail => (
                  <ScoringDetail 
                    key={detail.title}
                    title={detail.title}
                    hint={detail.hint}
                    guessLeast={detail.guessLeast}
                    guessDeduct={detail.guessDeduct}
                    timeDeduct={detail.timeDeduct}
                  />
               ))}
             </View>
          )}
          {/* ▲▲▲ */}


          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
             <Text style={styles.backButtonText}>返回</Text>
          </TouchableOpacity>
        </ScrollView>
     </SafeAreaView>
     </>
   );
}

const styles = StyleSheet.create({
   safeArea: {
     flex: 1,
     backgroundColor: '#b9f2f3fb',
   },
   container: {
     padding: 24,
     paddingBottom: 60, // 確保底部有足夠空間
     backgroundColor: '#b9f2f3fb',
   },
   title: {
     fontSize: 24,
     fontWeight: 'bold',
     marginBottom: 24,
     color: '#333',
     textAlign: 'center',
   },
   ruleRow: {
     flexDirection: 'row',
     alignItems: 'flex-start',
     marginBottom: 16,
     paddingRight: 20,
   },
   ruleNumber: {
     width: 28,
     fontSize: 18,
     fontWeight: 'bold',
     color: '#005f60',
     lineHeight: 26,
     textAlign: 'center',
   },
   ruleText: {
     flex: 1,
     fontSize: 16,
     color: 'black',
     lineHeight: 26,
   },
   exampleText: {
     fontStyle: 'italic',
     color: '#444',
     marginTop: 4,
     paddingLeft: 10,
   },
   highlightText: {
     color: '#007AFF', // 藍色高亮
     fontWeight: '600',
   },
   backButton: {
     marginTop: 30,
     backgroundColor: '#007AFF',
     paddingVertical: 12,
     paddingHorizontal: 32,
     borderRadius: 16,
     alignSelf: 'center',
   },
   backButtonText: {
     color: '#fff',
     fontSize: 16,
     fontWeight: 'bold',
   },
   detailButton: {
     marginTop: 20,
     paddingVertical: 10,
     paddingHorizontal: 15,
     backgroundColor: '#f0f0f0',
     borderRadius: 8,
     borderWidth: 1,
     borderColor: '#ddd',
   },
   detailButtonText: {
     color: '#007AFF',
     fontSize: 16,
     fontWeight: '600',
     textAlign: 'center',
   },
   detailContainer: {
     marginTop: 16,
     borderWidth: 1,
     borderColor: '#ddd',
     borderRadius: 8,
     backgroundColor: '#ffffff',
   },
   detailItem: {
     padding: 12,
     borderBottomWidth: 1,
     borderBottomColor: '#eee',
   },
   detailTitle: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#333',
     marginBottom: 8,
   },
   detailRow: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 4,
   },
   detailLabel: {
     fontSize: 15,
     color: '#555',
     fontWeight: '600',
   },
   detailValue: {
     fontSize: 15,
     color: 'black',
     fontWeight: '400',
   },
});

