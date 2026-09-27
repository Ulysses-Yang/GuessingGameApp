import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const tileSize = screenWidth / 8; // 可調整比例（例如8個字元寬度）
const fontSize = tileSize * 0.5;
const delayTime = 200;

const Tile = ({ char, result, delay, onFlipEnd }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 90],
    outputRange: ['0deg', '90deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [90, 180],
    outputRange: ['90deg', '0deg'],
  });

  const flipToFront = {
    transform: [{ rotateY: frontInterpolate }],
  };
  const flipToBack = {
    transform: [{ rotateY: backInterpolate }],
  };

  useEffect(() => {
    if (result) {
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(flipAnim, {
          toValue: 180,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
            if (finished && onFlipEnd) {
              onFlipEnd(); // ✅ 通知父元件動畫完成
            }
          });
        }
      }, [result]);

  const tileColor = tileColors[result] || tileColors.default;

  return (
    <View style={styles.tileWrapper}>
      {/* 背面 (彩色結果面) */}
      <Animated.View style={[styles.tile, styles.back, tileColor, flipToBack]}>
        <Text style={styles.char}>{char.toUpperCase()}</Text>
      </Animated.View>

      {/* 正面 (初始灰色) */}
      <Animated.View style={[styles.tile, styles.front, flipToFront]}>
        <Text style={styles.char}>{char.toUpperCase()}</Text>
      </Animated.View>
    </View>
  );
};

const TileRow = ({ word = '', result = [], wordLength = 5, onAnimationEnd }) => {

  const flipCountRef = useRef(0); // ✅ 計數 flip 完成的 tile 數量

  const handleTileFlipEnd = () => {
    flipCountRef.current += 1;
    if (flipCountRef.current === wordLength && onAnimationEnd) {
      onAnimationEnd(); // ✅ 所有 tile 翻完才執行
    }
  };

  const tiles = Array(wordLength).fill('').map((_, i) => {
    const char = word[i] || '';
    const status = result[i]; // could be undefined if not guessed yet

    return (
      <Tile
        key={i}
        char={char}
        result={status}
        delay={i * delayTime}
        onFlipEnd={handleTileFlipEnd} // ✅ 每格都設同一個 callback
      />
    );
  });

  return <View style={styles.row}>{tiles}</View>;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 6,
  },
  tileWrapper: {
    width: tileSize,
    height: tileSize,
    perspective: 1000,
  },
  tile: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  front: {
    backgroundColor: '#E0F7FA',
    borderColor: '#B2EBF2',
  },
  back: {
    // 顏色會從 tileColors 決定
  },
  char: {
    fontSize: fontSize,
    color: '#333',
    fontWeight: 'bold',
  },
});


const tileColors = {
  default: { backgroundColor: '#E0F7FA', borderColor: '#B2EBF2' }, // 淺藍
  correct: { backgroundColor: '#AED581', borderColor: '#9CCC65' }, // 淺綠
  present: { backgroundColor: '#FFF176', borderColor: '#FFEE58' }, // 淺黃
  absent: { backgroundColor: '#a7a0a0ff', borderColor: '#BDBDBD' },  // 淺灰
};


export default TileRow;
