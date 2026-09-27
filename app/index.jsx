//index.jsx
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>益智小遊戲</Text>
          <Text style={styles.versionText}>版本1.3.0</Text>
        </View>

        {/* 自定義按鈕 */}
        <View style={{ alignItems: 'flex-start', marginLeft: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 100 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/GuessingGame/ModeSelect')} // 修改這裡
          >
            <Text style={styles.buttonText}>猜數字</Text>
          </TouchableOpacity>
          <View style={{ marginLeft: 12, flexShrink: 1 }}>
            <Text style= {{color:'black', fontSize: 18, fontWeight: 'bold'}}>三位數or四位數</Text>
          </View>
        </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/wordle/StartScreen')}
            >
              <Text style={styles.buttonText}>猜單字</Text>
            </TouchableOpacity>
            <View style={{ marginLeft: 12, flexShrink: 1 }}>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>
                參考 Josh Wardle 的遊戲：Wordle
              </Text>
            </View>
          </View>
        </View>
        
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1f6c9ff',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center', // 讓按鈕水平置中
    paddingHorizontal: 20,
  },

  title: {
    marginTop: 100,
    marginBottom: 100,
    alignItems: 'center',
  },

  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  versionText: {
    fontSize: 15,
  },

  button: {
    backgroundColor: '#225eadff',      // ✅ 背景色
    paddingVertical: 12,             // 垂直內距
    paddingHorizontal: 30,           // 水平內距
    borderRadius: 8,                 // 圓角
    elevation: 3,                    // 陰影（Android）
    shadowColor: '#000',             // 陰影（iOS）
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',                  // ✅ 文字顏色
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
