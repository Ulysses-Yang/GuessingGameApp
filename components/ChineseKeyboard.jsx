import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tileColors = {
  default: { backgroundColor: '#FFFFFF' },
  correct: { backgroundColor: '#6BCB77' }, // 綠色
  present: { backgroundColor: '#FFD93D' }, // 黃色
  absent: { backgroundColor: '#D3D3D3' },  // 灰色
  del: { backgroundColor: '#FF6B6B' },     // 紅色
  enter: { backgroundColor: '#4D96FF' },   // 藍色
};

export default function ChineseKeyboard({ keys = [], onKeyPress, keyColors = {} }) {
  const firstRowKeys = keys.slice(0, Math.ceil(keys.length));

  return (
    <View style={styles.container}>
      {/* 第一行普通鍵 */}
      <View style={styles.keysRow}>
        {firstRowKeys.map((keyChar, index) => {
          const colorKey = keyColors[keyChar] || 'default';
          const colorStyle = tileColors[colorKey] || tileColors.default;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.key, styles.shadow, colorStyle]}
              onPress={() => onKeyPress(keyChar)}
            >
              <Text style={styles.keyText}>{String(keyChar)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 底部功能鍵（刪除與確定） */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={[styles.key, styles.specialKey, styles.shadow, tileColors.del]}
          onPress={() => onKeyPress('DEL')}
        >
          <Text style={styles.keyText}>刪除</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[styles.key, styles.specialKey, styles.shadow, tileColors.enter]}
          onPress={() => onKeyPress('ENTER')}
        >
          <Text style={styles.keyText}>確定</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: '#E6F7FF', // 淺藍背景
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  keysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  key: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    margin: 3,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialKey: {
    minWidth: 80,
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  shadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});
