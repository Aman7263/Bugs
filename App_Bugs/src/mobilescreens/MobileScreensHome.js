import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import GetCallLog from './getCallLog';
import GetMobile from './getmoble';

// Games imports
import TicTacToe from './games/TicTacToe';
import MemoryMatch from './games/MemoryMatch';
import RockPaperScissors from './games/RockPaperScissors';
import NumberGuess from './games/NumberGuess';
import TapSpeed from './games/TapSpeed';
import DiceRoller from './games/DiceRoller';
import CoinFlip from './games/CoinFlip';
import SimonSays from './games/SimonSays';
import MathRush from './games/MathRush';
import ClickSpeed from './games/ClickSpeed';
import ReactionTime from './games/ReactionTime';
import WordScramble from './games/WordScramble';
import WhackAMole from './games/WhackAMole';
import SlidePuzzle from './games/SlidePuzzle';
import HigherLower from './games/HigherLower';
import StroopEffect from './games/StroopEffect';
import TypeFast from './games/TypeFast';
import CatchBall from './games/CatchBall';
import SnakeGame from './games/SnakeGame';
import NumberMemory from './games/NumberMemory';
import QuickDraw from './games/QuickDraw';
import OddOneOut from './games/OddOneOut';
import ScratchCard from './games/ScratchCard';
import PatternLock from './games/PatternLock';
import ColorMixer from './games/ColorMixer';

const { width } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
// 4-Column Layout: screenWidth - 36px (horizontal padding 18*2) - 48px (four 12px margin spaces)
const cardWidth = (screenWidth - 36 - 48) / 4;

const SECTIONS = [
  {
    key: 'calllog',
    category: 'FEATURES',
    headline: 'Your Call Log',
    sub: 'View, filter & export every call at a glance',
    icon: '📞',
    accent: '#e63946',
    tag: 'LIVE',
  },
  {
    key: 'deviceinfo',
    category: 'FEATURES',
    headline: 'SIM & Device Specs',
    sub: 'View detailed SIM card and device configuration details',
    icon: '📱',
    accent: '#2a9d8f',
    tag: 'LIVE',
  }
];

const MobileScreensHome = () => {
  const [activePage, setActivePage] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          console.log('Contacts permission granted on Mobile Home mount');
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  const openPage = (key) => {
    slideAnim.setValue(40);
    setActivePage(key);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  };

  const goBack = () => setActivePage(null);

  if (activePage === 'calllog') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#e63946' }]}>
              <Text style={styles.liveTagText}>LIVE</Text>
            </View>
            <Text style={styles.pageTopCategory}>CALL LOG</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Your Call Log</Text>
        <View style={styles.dividerFull} />
        <GetCallLog />
      </Animated.View>
    );
  }

  if (activePage === 'deviceinfo') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#2a9d8f' }]}>
              <Text style={styles.liveTagText}>LIVE</Text>
            </View>
            <Text style={styles.pageTopCategory}>DEVICE INFO</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>SIM & Device Info</Text>
        <View style={styles.dividerFull} />
        <GetMobile />
      </Animated.View>
    );
  }

  if (activePage === 'tictactoe') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#e63946' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>TIC TAC TOE</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Tic Tac Toe</Text>
        <View style={styles.dividerFull} />
        <TicTacToe />
      </Animated.View>
    );
  }

  if (activePage === 'memorymatch') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#3f37c9' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>MEMORY MATCH</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Memory Match</Text>
        <View style={styles.dividerFull} />
        <MemoryMatch />
      </Animated.View>
    );
  }

  if (activePage === 'rps') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#f4a261' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>ROCK PAPER SCISSORS</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>R.P.S. Duel</Text>
        <View style={styles.dividerFull} />
        <RockPaperScissors />
      </Animated.View>
    );
  }

  if (activePage === 'numguess') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#4361ee' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>NUMBER GUESS</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Guess The Number</Text>
        <View style={styles.dividerFull} />
        <NumberGuess />
      </Animated.View>
    );
  }

  if (activePage === 'tapspeed') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#7209b7' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>TAP SPEED</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Whack-A-Dot Speed</Text>
        <View style={styles.dividerFull} />
        <TapSpeed />
      </Animated.View>
    );
  }

  if (activePage === 'diceroller') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#f4a261' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>DICE ROLLER</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Dice Roller</Text>
        <View style={styles.dividerFull} />
        <DiceRoller />
      </Animated.View>
    );
  }

  if (activePage === 'coinflip') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#e76f51' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>COIN FLIP</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Coin Flipper</Text>
        <View style={styles.dividerFull} />
        <CoinFlip />
      </Animated.View>
    );
  }

  if (activePage === 'simonsays') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#2a9d8f' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>SIMON SAYS</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Simon Says Recall</Text>
        <View style={styles.dividerFull} />
        <SimonSays />
      </Animated.View>
    );
  }

  if (activePage === 'mathrush') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#2b2d42' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>MATH RUSH</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Math Speed Rush</Text>
        <View style={styles.dividerFull} />
        <MathRush />
      </Animated.View>
    );
  }

  if (activePage === 'clickspeed') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#8d99ae' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>CLICK SPEED</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>CPS Click Speed</Text>
        <View style={styles.dividerFull} />
        <ClickSpeed />
      </Animated.View>
    );
  }

  if (activePage === 'reactiontime') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#e63946' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>REACTION TIME</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Reaction Time</Text>
        <View style={styles.dividerFull} />
        <ReactionTime />
      </Animated.View>
    );
  }

  if (activePage === 'wordscramble') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#3f37c9' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>WORD SCRAMBLE</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Word Scramble</Text>
        <View style={styles.dividerFull} />
        <WordScramble />
      </Animated.View>
    );
  }

  if (activePage === 'whackamole') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#f4a261' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>WHACK-A-MOLE</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Whack-A-Mole</Text>
        <View style={styles.dividerFull} />
        <WhackAMole />
      </Animated.View>
    );
  }

  if (activePage === 'slidepuzzle') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#4361ee' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>SLIDE PUZZLE</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Slide Puzzle</Text>
        <View style={styles.dividerFull} />
        <SlidePuzzle />
      </Animated.View>
    );
  }

  if (activePage === 'higherlower') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#7209b7' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>HIGHER OR LOWER</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Higher or Lower</Text>
        <View style={styles.dividerFull} />
        <HigherLower />
      </Animated.View>
    );
  }

  if (activePage === 'stroopeffect') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#2a9d8f' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>STROOP EFFECT</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Stroop Effect</Text>
        <View style={styles.dividerFull} />
        <StroopEffect />
      </Animated.View>
    );
  }

  if (activePage === 'typefast') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#2b2d42' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>TYPE FAST</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Type Fast</Text>
        <View style={styles.dividerFull} />
        <TypeFast />
      </Animated.View>
    );
  }

  if (activePage === 'catchball') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#8d99ae' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>CATCH THE BALL</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Catch the Ball</Text>
        <View style={styles.dividerFull} />
        <CatchBall />
      </Animated.View>
    );
  }

  if (activePage === 'snakegame') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#e63946' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>RETRO SNAKE</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Retro Snake</Text>
        <View style={styles.dividerFull} />
        <SnakeGame />
      </Animated.View>
    );
  }

  if (activePage === 'numbermemory') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#3f37c9' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>NUMBER MEMORY</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Number Memory</Text>
        <View style={styles.dividerFull} />
        <NumberMemory />
      </Animated.View>
    );
  }

  if (activePage === 'quickdraw') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#f4a261' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>QUICK DRAW</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Quick Pixel Draw</Text>
        <View style={styles.dividerFull} />
        <QuickDraw />
      </Animated.View>
    );
  }

  if (activePage === 'oddoneout') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#2a9d8f' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>ODD ONE OUT</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Odd One Out</Text>
        <View style={styles.dividerFull} />
        <OddOneOut />
      </Animated.View>
    );
  }

  if (activePage === 'scratchcard') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#7209b7' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>SCRATCH CARD</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Scratch & Win</Text>
        <View style={styles.dividerFull} />
        <ScratchCard />
      </Animated.View>
    );
  }

  if (activePage === 'patternlock') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#4361ee' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>PATTERN LOCK</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Pattern Lock Memory</Text>
        <View style={styles.dividerFull} />
        <PatternLock />
      </Animated.View>
    );
  }

  if (activePage === 'colormixer') {
    return (
      <Animated.View style={[styles.pageContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.pageTopBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
          <View style={styles.pageTagRow}>
            <View style={[styles.liveTag, { backgroundColor: '#2b2d42' }]}>
              <Text style={styles.liveTagText}>GAMES</Text>
            </View>
            <Text style={styles.pageTopCategory}>COLOR MIXER</Text>
          </View>
        </View>
        <Text style={styles.pageHeadline}>Color Mixer</Text>
        <View style={styles.dividerFull} />
        <ColorMixer />
      </Animated.View>
    );
  }

  // HOME FEED
  return (
    <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
      {/* Masthead */}
      <View style={styles.masthead}>
        <View style={styles.mastheadTop}>
          <Text style={styles.mastheadDate}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
          </Text>
          <View style={styles.mastheadDot} />
          <Text style={styles.mastheadDate}>MOBILE SCREENS</Text>
        </View>
        <Text style={styles.mastheadLogo}>Bugs Dashboard</Text>
        <View style={styles.mastheadDivider} />
      </View>

      <View style={styles.featuresRow}>
        {/* Feature Card — Call Log */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.gridCard}
          onPress={() => openPage('calllog')}>
          <View style={[styles.gridAccentBar, { backgroundColor: '#e63946' }]} />
          <View style={styles.gridBody}>
            <Text style={styles.gridIcon}>📞</Text>
            <Text style={styles.gridHeadline}>Call Log</Text>
            <Text style={styles.gridSub}>View, filter & export calls</Text>
            <View style={styles.gridCta}>
              <Text style={styles.gridCtaText}>Open →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Feature Card — SIM & Device Specs */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.gridCard}
          onPress={() => openPage('deviceinfo')}>
          <View style={[styles.gridAccentBar, { backgroundColor: '#2a9d8f' }]} />
          <View style={styles.gridBody}>
            <Text style={styles.gridIcon}>📱</Text>
            <Text style={styles.gridHeadline}>SIM & Specs</Text>
            <Text style={styles.gridSub}>Carrier & hardware details</Text>
            <View style={styles.gridCta}>
              <Text style={[styles.gridCtaText, { color: '#2a9d8f' }]}>Open →</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Horizontal Rule */}
      <View style={styles.hrLine} />

      {/* Game Dashboard Heading */}
      <View style={styles.dashboardSection}>
        <Text style={styles.sectionHeader}>Game Dashboard</Text>
        <Text style={styles.sectionSub}>Play games and track your achievements</Text>
        
        {/* 4-Column Games Grid */}
        <View style={styles.gamesGrid}>
          {/* Game 1: Tic Tac Toe */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('tictactoe')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>❌</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>TicTacToe</Text>
          </TouchableOpacity>

          {/* Game 2: Memory Match */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('memorymatch')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🧠</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Memory</Text>
          </TouchableOpacity>

          {/* Game 3: Rock Paper Scissors */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('rps')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>✂️</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>R.P.S.</Text>
          </TouchableOpacity>

          {/* Game 4: Number Guess */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('numguess')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🔢</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Guess Num</Text>
          </TouchableOpacity>

          {/* Game 5: Tap Speed */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('tapspeed')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>⏱️</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Tap Speed</Text>
          </TouchableOpacity>

          {/* Game 6: Dice Roller */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('diceroller')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🎲</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Dice Roll</Text>
          </TouchableOpacity>

          {/* Game 7: Coin Flip */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('coinflip')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🪙</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Coin Flip</Text>
          </TouchableOpacity>

          {/* Game 8: Simon Says */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('simonsays')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🔴</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Simon Says</Text>
          </TouchableOpacity>

          {/* Game 9: Math Rush */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('mathrush')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🧮</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Math Rush</Text>
          </TouchableOpacity>

          {/* Game 10: Click Speed */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('clickspeed')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>⚡</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Click Speed</Text>
          </TouchableOpacity>

          {/* Game 11: Reaction Time */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('reactiontime')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🚦</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Reflex Test</Text>
          </TouchableOpacity>

          {/* Game 12: Word Scramble */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('wordscramble')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🔤</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Scramble</Text>
          </TouchableOpacity>

          {/* Game 13: WhackAMole */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('whackamole')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🐹</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Whack Mole</Text>
          </TouchableOpacity>

          {/* Game 14: Slide Puzzle */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('slidepuzzle')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🧩</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Slide 8</Text>
          </TouchableOpacity>

          {/* Game 15: Higher Lower */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('higherlower')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🃏</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Hi-Lo Card</Text>
          </TouchableOpacity>

          {/* Game 16: Stroop Effect */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('stroopeffect')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🎨</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Stroop Color</Text>
          </TouchableOpacity>

          {/* Game 17: Type Fast */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('typefast')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>⌨️</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Type Fast</Text>
          </TouchableOpacity>

          {/* Game 18: Catch Ball */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('catchball')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🥎</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Catch Ball</Text>
          </TouchableOpacity>

          {/* Game 19: Snake */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('snakegame')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🐍</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Retro Snake</Text>
          </TouchableOpacity>

          {/* Game 20: Number Memory */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('numbermemory')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>📟</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Num Memory</Text>
          </TouchableOpacity>

          {/* Game 21: Quick Draw */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('quickdraw')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🖌️</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Quick Draw</Text>
          </TouchableOpacity>

          {/* Game 22: Odd One Out */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('oddoneout')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🔍</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Odd One</Text>
          </TouchableOpacity>

          {/* Game 23: Scratch Card */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('scratchcard')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🎟️</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Scratch Card</Text>
          </TouchableOpacity>

          {/* Game 24: Pattern Lock */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('patternlock')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🔐</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Pattern Lock</Text>
          </TouchableOpacity>

          {/* Game 25: Color Mixer */}
          <TouchableOpacity
            style={[styles.gameGridCard, { width: cardWidth }]}
            onPress={() => openPage('colormixer')}
            activeOpacity={0.8}
          >
            <Text style={styles.gameGridIcon}>🎨</Text>
            <Text style={styles.gameGridTitle} numberOfLines={1}>Color Mixer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MobileScreensHome;

const styles = StyleSheet.create({
  feed: {
    flex: 1,
    backgroundColor: '#faf9f6',
  },
  feedContent: {
    paddingHorizontal: 18,
    paddingTop: 52,
  },

  // Masthead
  masthead: {
    marginBottom: 24,
  },
  mastheadTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mastheadDate: {
    fontFamily: 'Georgia',
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#888',
  },
  mastheadDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  mastheadLogo: {
    fontFamily: 'Georgia',
    fontSize: 38,
    fontWeight: '700',
    color: '#0d0d0d',
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  mastheadDivider: {
    height: 3,
    backgroundColor: '#0d0d0d',
    marginTop: 14,
  },

  // Hero Card
  heroCard: {
    backgroundColor: '#0d0d0d',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  heroAccentBar: {
    height: 4,
    backgroundColor: '#e63946',
  },
  heroBody: {
    padding: 22,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveTag: {
    backgroundColor: '#e63946',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 2,
    marginRight: 10,
  },
  liveTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroCategory: {
    fontFamily: 'Georgia',
    fontSize: 10,
    letterSpacing: 2,
    color: '#888',
    textTransform: 'uppercase',
  },
  heroIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  heroHeadline: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSub: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  heroCta: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 14,
  },
  heroCtaText: {
    color: '#e63946',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Section divider
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d9d9d9',
  },
  sectionLabel: {
    fontFamily: 'Georgia',
    fontSize: 9,
    letterSpacing: 2,
    color: '#aaa',
    marginHorizontal: 10,
  },

  // Secondary cards
  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  secondaryAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  secondaryBody: {
    flex: 1,
    padding: 16,
  },
  secondaryCategory: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#aaa',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  secondaryHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  secondaryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  secondaryHeadline: {
    fontFamily: 'Georgia',
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  secondarySub: {
    color: '#888',
    fontSize: 12,
    lineHeight: 17,
  },
  secondaryArrow: {
    fontSize: 18,
    color: '#ccc',
    paddingRight: 16,
  },

  // Inner page
  pageContainer: {
    flex: 1,
    backgroundColor: '#faf9f6',
    paddingHorizontal: 18,
    paddingTop: 52,
  },
  pageTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#111',
    marginRight: 4,
  },
  backLabel: {
    fontFamily: 'Georgia',
    fontSize: 13,
    color: '#111',
  },
  pageTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageTopCategory: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#aaa',
  },
  pageHeadline: {
    fontFamily: 'Georgia',
    fontSize: 30,
    fontWeight: '700',
    color: '#0d0d0d',
    marginBottom: 14,
    lineHeight: 36,
  },
  dividerFull: {
    height: 3,
    backgroundColor: '#0d0d0d',
    marginBottom: 18,
  },
  placeholderText: {
    color: '#888',
    fontSize: 15,
    fontFamily: 'Georgia',
    marginTop: 10,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    borderRadius: 4,
    overflow: 'hidden',
    minHeight: 160,
  },
  gridAccentBar: {
    height: 4,
  },
  gridBody: {
    padding: 14,
    flex: 1,
    justifyContent: 'space-between',
  },
  gridIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  gridHeadline: {
    fontFamily: 'Georgia',
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  gridSub: {
    color: '#aaa',
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 10,
  },
  gridCta: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 8,
  },
  gridCtaText: {
    color: '#e63946',
    fontSize: 11,
    fontWeight: '700',
  },
  hrLine: {
    height: 1.5,
    backgroundColor: '#0d0d0d',
    marginVertical: 24,
  },
  dashboardSection: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '700',
    color: '#0d0d0d',
    marginBottom: 4,
  },
  sectionSub: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Georgia',
    lineHeight: 16,
    marginBottom: 16,
  },
  gamePlaceholderCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 4,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamePlaceholderIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  gamePlaceholderText: {
    fontFamily: 'Georgia',
    fontSize: 13,
    color: '#aaa',
    fontWeight: '600',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  gameGridCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    minHeight: 85,
    margin: 6,
  },
  gameGridIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  gameGridTitle: {
    fontFamily: 'Georgia',
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0d0d0d',
    textAlign: 'center',
  },
});