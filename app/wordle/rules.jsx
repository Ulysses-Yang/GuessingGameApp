import { useRouter } from 'expo-router';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';


export default function Rules() {
    const router = useRouter();

  return (
    <>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 16}}>猜單字遊戲規則</Text>
        <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 16}}>英文版</Text>

        <View style={styles.ruleRow}>
          <Text style={styles.ruleNumber}>{'\u2460'}</Text>
          <Text style={styles.ruleText}>猜一組四個或五個字母的單字。</Text>
        </View>

        <View style={styles.ruleRow}>
          <Text style={styles.ruleNumber}>{'\u2461'}</Text>
          <Text style={styles.ruleText}>
            每次猜會回饋顏色，綠色表示字母與位置都對，黃色表示字母對但位置錯，灰色表示字母錯位置也錯。{'\n'}
            例如：答案為APPLE{'\n'}
            若輸入GRAPE，則五個格子依序為灰色、灰色、黃色、黃色、綠色。
          </Text>
        </View>

        <View style={styles.ruleRow}>
          <Text style={styles.ruleNumber}>{'\u2462'}</Text>
          <Text style={styles.ruleText}>共有六次機會，猜中即獲勝。</Text>
        </View>

        <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 16}}>中文版</Text>
        <View style={styles.ruleRow}>
          <Text style={styles.ruleNumber}>{'\u2460'}</Text>
          <Text style={styles.ruleText}>猜一組四字成語。</Text>
        </View>

        <View style={styles.ruleRow}>
          <Text style={styles.ruleNumber}>{'\u2461'}</Text>
          <Text style={styles.ruleText}>猜測方式即從鍵盤區選四字。</Text>
        </View>

        <View style={styles.ruleRow}>
          <Text style={styles.ruleNumber}>{'\u2462'}</Text>
          <Text style={styles.ruleText}>
            每次猜會回饋顏色，綠色表示字與位置都對，黃色表示字對但位置錯，灰色表示字錯位置也錯。{'\n'}
            例如：答案為畫龍點睛{'\n'}
            若輸入點石成金，則四個格子依序為黃色、灰色、灰色、灰色。
          </Text>
        </View>

        <View style={styles.ruleRow}>
          <Text style={styles.ruleNumber}>{'\u2463'}</Text>
          <Text style={styles.ruleText}>共有五次機會，猜中即獲勝，會顯示答案以及成語釋義。</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <Button title="返回" onPress={() => router.back()} />
        </View>
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
  },

  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 20,
  },

  ruleNumber: {
    width: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 24,
  },

  ruleText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    lineHeight: 24,
  },

});
