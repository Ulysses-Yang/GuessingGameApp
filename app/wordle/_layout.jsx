// app/wordle/_layout.jsx
import { Stack, useRouter } from 'expo-router';
import { Button } from 'react-native';

export default function WordleLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBackVisible: false,
        gestureEnabled: false,
        title: '',
      }}
    >
      <Stack.Screen
        name="StartScreen"
        options={{
          headerLeft: () => (
            <Button title="返回主畫面" onPress={() => router.replace('/')} />
          ),
        }}
      />
      <Stack.Screen
        name="rules"
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="EnglishGame"
        options={{
          headerLeft: () => (
            <Button title="離開" onPress={() => router.replace('/wordle/StartScreen')} />
          ),
        }}
      />
      <Stack.Screen
        name="ChineseGame"
        options={{
          headerLeft: () => (
            <Button title="離開" onPress={() => router.replace('/wordle/StartScreen')} />
          ),
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerLeft: () => (
            <Button title="玩其他遊戲" onPress={() => router.replace('/')} />
          ),
        }}
      />
    </Stack>
  );
}
