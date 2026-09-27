import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

const tileColors = {
  default: { backgroundColor: '#e0e7ff', borderColor: '#d0d7ff' },
  correct: { backgroundColor: '#b6e2b6', borderColor: '#6ecb63' },
  present: { backgroundColor: '#fff4b3', borderColor: '#f1d25f' },
  absent: { backgroundColor: '#a7a0a0ff', borderColor: '#ccc' },
  del: { backgroundColor: '#f8c2c2', borderColor: '#f44' },
  enter: { backgroundColor: '#cce0ff', borderColor: '#3399ff' },
};

const Keyboard = ({ onKeyPress, keyColors = {} }) => {
  const { width } = useWindowDimensions();
  const keyGap = 6;
  const totalUnits = 9.5; // 控制一列有多少總寬度單位（調整這個可以讓鍵長胖）
  const unitWidth = (width - keyGap * 11) / totalUnits; // 留11個間隔

  const keyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  return (
    <View style={styles.keyboard}>
      {keyRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            const colorKey = keyColors[key.toUpperCase()] || 'default';
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  tileColors[colorKey],
                  { width: unitWidth },
                ]}
                onPress={() => onKeyPress(key.toLowerCase())}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* 最下面 DEL 和 ENTER 分開一排並加寬 */}
      <View style={[styles.row, { justifyContent: 'space-between', paddingHorizontal: keyGap * 2 }]}>
        <TouchableOpacity
          style={[
            styles.key,
            tileColors.del,
            { width: unitWidth * 2 + keyGap }
          ]}
          onPress={() => onKeyPress('DEL')}
        >
          <Text style={styles.keyText}>DEL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.key,
            tileColors.enter,
            { width: unitWidth * 2 + keyGap }
          ]}
          onPress={() => onKeyPress('ENTER')}
        >
          <Text style={styles.keyText}>ENTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 10,
  },
  key: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  keyText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Keyboard;
