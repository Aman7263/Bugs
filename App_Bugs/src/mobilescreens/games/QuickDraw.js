import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const PROMPTS = [
  { name: 'Heart ❤️', hint: [14, 15, 17, 18, 25, 26, 27, 28, 29, 30, 37, 38, 39, 40, 41, 42, 50, 51, 52, 53, 63, 64, 65, 76, 77, 89] },
  { name: 'Smiley 🙂', hint: [27, 28, 38, 41, 50, 53, 62, 65, 75, 76, 86, 87, 88, 89] },
  { name: 'Tree 🌲', hint: [30, 41, 42, 43, 52, 53, 54, 55, 63, 64, 65, 73, 74, 75, 76, 77, 84, 85, 86, 87, 88, 89, 90, 101, 102, 113, 114] },
  { name: 'Sword ⚔️', hint: [10, 21, 22, 32, 33, 43, 44, 54, 55, 65, 66, 76, 77, 87, 88, 98, 99, 109, 110, 120, 131] }
];

const COLORS = [
  { value: '#0d0d0d', name: 'Black' },
  { value: '#e63946', name: 'Red' },
  { value: '#2a9d8f', name: 'Green' },
  { value: '#3f37c9', name: 'Blue' },
  { value: '#ffb703', name: 'Yellow' }
];

const QuickDraw = () => {
  const [promptIdx, setPromptIdx] = useState(0);
  const [pixels, setPixels] = useState(Array(144).fill('#ffffff'));
  const [selectedColor, setSelectedColor] = useState('#0d0d0d');
  const [gameState, setGameState] = useState('idle'); // idle, drawing, submitted
  const [grade, setGrade] = useState('');
  const [showHint, setShowHint] = useState(false);

  const startDrawing = () => {
    setPixels(Array(144).fill('#ffffff'));
    setGameState('drawing');
    setGrade('');
    setShowHint(false);
  };

  const handleCellTap = (index) => {
    if (gameState !== 'drawing') return;
    const newPixels = [...pixels];
    // If cell already has this color, toggle it back to white
    if (newPixels[index] === selectedColor) {
      newPixels[index] = '#ffffff';
    } else {
      newPixels[index] = selectedColor;
    }
    setPixels(newPixels);
  };

  const clearCanvas = () => {
    setPixels(Array(144).fill('#ffffff'));
  };

  const submitDrawing = () => {
    setGameState('submitted');
    
    // Evaluate matching grade based on how many cells in hint are colored
    const targetHint = PROMPTS[promptIdx].hint;
    let coloredHits = 0;
    let extraColorPenalty = 0;

    pixels.forEach((color, idx) => {
      const isColored = color !== '#ffffff';
      const isTarget = targetHint.includes(idx);
      
      if (isColored && isTarget) {
        coloredHits++;
      } else if (isColored && !isTarget) {
        extraColorPenalty++;
      }
    });

    const totalTargetSize = targetHint.length;
    const matchPercentage = Math.max(0, Math.round(((coloredHits - extraColorPenalty * 0.5) / totalTargetSize) * 100));

    if (matchPercentage >= 75) {
      setGrade('Masterpiece! ⭐️⭐️⭐️');
    } else if (matchPercentage >= 40) {
      setGrade('Great Job! 🎨');
    } else {
      setGrade('Nice Effort! 🖌️');
    }
  };

  const nextPrompt = () => {
    const nextIdx = (promptIdx + 1) % PROMPTS.length;
    setPromptIdx(nextIdx);
    setPixels(Array(144).fill('#ffffff'));
    setGameState('drawing');
    setGrade('');
    setShowHint(false);
  };

  const currentPrompt = PROMPTS[promptIdx];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Target prompt */}
      <View style={styles.promptHeader}>
        <Text style={styles.promptLabel}>CURRENT TASK</Text>
        <Text style={styles.promptTitle}>{currentPrompt.name}</Text>
      </View>

      {/* Stage */}
      <View style={styles.stage}>
        {gameState === 'idle' ? (
          <View style={styles.splashBox}>
            <Text style={styles.splashHeader}>Quick Pixel Draw</Text>
            <Text style={styles.splashText}>
              Draw the requested image by coloring cells on the 12x12 grid. Tap to paint!
            </Text>
            <TouchableOpacity style={styles.btnAction} onPress={startDrawing}>
              <Text style={styles.btnActionText}>START DRAWING</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.drawingArea}>
            {/* Grid canvas */}
            <View style={styles.gridCanvas}>
              {pixels.map((color, idx) => {
                const isHintCell = showHint && currentPrompt.hint.includes(idx);
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.cell,
                      { backgroundColor: color },
                      isHintCell && styles.cellHintHighlight
                    ]}
                    onPress={() => handleCellTap(idx)}
                    disabled={gameState === 'submitted'}
                    activeOpacity={0.7}
                  />
                );
              })}
            </View>

            {gameState === 'drawing' ? (
              <View style={styles.controlsContainer}>
                {/* Color Selector */}
                <View style={styles.paletteRow}>
                  {COLORS.map((c) => (
                    <TouchableOpacity
                      key={c.value}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: c.value },
                        selectedColor === c.value && styles.colorSwatchActive
                      ]}
                      onPress={() => setSelectedColor(c.value)}
                    />
                  ))}
                </View>

                {/* Actions */}
                <View style={styles.btnActionsRow}>
                  <TouchableOpacity style={[styles.controlBtn, styles.btnOutline]} onPress={clearCanvas}>
                    <Text style={styles.btnTextDark}>CLEAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlBtn, styles.btnOutline]}
                    onPress={() => setShowHint(!showHint)}
                  >
                    <Text style={styles.btnTextDark}>{showHint ? 'HIDE HINT' : 'SHOW HINT'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.controlBtn, styles.btnSolid]} onPress={submitDrawing}>
                    <Text style={styles.btnTextLight}>SUBMIT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.submittedContainer}>
                <Text style={styles.gradeHeader}>{grade}</Text>
                <TouchableOpacity style={styles.btnAction} onPress={nextPrompt}>
                  <Text style={styles.btnActionText}>NEXT PROMPT</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default QuickDraw;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  promptHeader: {
    backgroundColor: '#0d0d0d',
    borderRadius: 4,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  promptLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: '#aaa',
    fontWeight: '700',
    marginBottom: 4,
  },
  promptTitle: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  stage: {
    width: '100%',
    minHeight: 390,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  splashBox: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  splashHeader: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '700',
    color: '#0d0d0d',
    marginBottom: 8,
  },
  splashText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  drawingArea: {
    alignItems: 'center',
    width: '100%',
  },
  gridCanvas: {
    width: 220,
    height: 220,
    borderWidth: 1.5,
    borderColor: '#0d0d0d',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '8.333%', // 100% / 12
    height: '8.333%',
    borderWidth: 0.5,
    borderColor: '#ebebeb',
  },
  cellHintHighlight: {
    borderColor: '#e63946',
    borderWidth: 1,
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorSwatchActive: {
    borderColor: '#0d0d0d',
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
  btnActionsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  controlBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: '#0d0d0d',
    backgroundColor: '#fff',
  },
  btnSolid: {
    backgroundColor: '#0d0d0d',
  },
  btnTextDark: {
    fontFamily: 'Georgia',
    fontSize: 10,
    fontWeight: '700',
    color: '#0d0d0d',
  },
  btnTextLight: {
    fontFamily: 'Georgia',
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  submittedContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  gradeHeader: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '800',
    color: '#2a9d8f',
    marginBottom: 14,
  },
  btnAction: {
    backgroundColor: '#0d0d0d',
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  btnActionText: {
    fontFamily: 'Georgia',
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
});
