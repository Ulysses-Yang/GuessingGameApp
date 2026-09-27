// GuessingGame/_layout.jsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function Layout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="StartScreen"
          options={{
            headerTransparent: true,
            title: '',
            gestureEnabled: false,
            headerBackVisible: false,
            headerLeft: () => (
              <Button title="返回主畫面" onPress={() => router.replace('/')} />
            ),
          }}
        />

        {/* ▼▼▼ 新增：模式選擇頁 (ModeSelect) ▼▼▼ */}
        <Stack.Screen
          name="ModeSelect"
          options={{
            headerTransparent: true,
            title: '',
            gestureEnabled: false,
            headerBackVisible: false, // 隱藏原生返回鍵
            headerLeft: () => (
              // 強制返回到 StartScreen
              <Button title="返回" onPress={() => router.replace('/')} />
            ),
          }}
        />

        {/* ▼▼▼ 新增：關卡選擇頁 (LevelSelect) ▼▼▼ */}
        <Stack.Screen
          name="LevelSelect"
          options={{
            headerTransparent: true,
            title: '',
            gestureEnabled: false,
            headerBackVisible: false, // 隱藏原生返回鍵
            headerLeft: () => (
              // 強制返回到 ModeSelect
              <Button title="返回" onPress={() => router.replace('/GuessingGame/ModeSelect')} />
            ),
          }}
        />

        <Stack.Screen
          name="rules"
          options={{
            title: '',
            gestureEnabled: false,
            headerBackVisible: false,
            headerTransparent: true,
            // 規則頁通常也可以加個返回鍵，看你需求，這裡維持你原本的設定（可能頁面內有按鈕？）
             headerLeft: () => (
              <Button title="返回" onPress={() => router.back()} />
            ),
          }}
        />
        
        <Stack.Screen
          name="game"
          options={{
            gestureEnabled: false,
            headerBackVisible: false,
            headerTransparent: true,
            title: '',
            headerLeft: () => (
              // 遊戲中離開回到 StartScreen (或依照你的需求調整)
              <Button title="離開" onPress={() => router.replace('/GuessingGame/StartScreen')} />
            ),
          }}
        />
        
        <Stack.Screen
          name="GameResult"
          options={({ route }) => {
            const isHistoryView = route.params?.isHistoryView === 'true';
            return {
              gestureEnabled: false,
              headerBackVisible: false,
              headerTransparent: true,
              title: '',
              headerLeft: () => (
                <Button
                  title={isHistoryView ? '返回' : '玩其他遊戲'}
                  onPress={() =>
                    isHistoryView ? router.back() : router.replace('/')
                  }
                />
              ),
            };
          }}
        />

        <Stack.Screen
          name="ScoreHistory"
          options={{
            gestureEnabled: false,
            headerBackVisible: false,
            headerTransparent: true,
            title: '',
            headerLeft: () => (
              <Button title="返回" onPress={() => router.back()} />
            ),
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}