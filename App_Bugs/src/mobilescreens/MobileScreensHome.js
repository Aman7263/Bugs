import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import GetCallLog from './getCallLog';

const { width } = Dimensions.get('window');

const SECTIONS = [
  {
    key: 'calllog',
    category: 'FEATURES',
    headline: 'Your Call Log',
    sub: 'View, filter & export every call at a glance',
    icon: '📞',
    accent: '#e63946',
    tag: 'LIVE',
  }
];

const MobileScreensHome = () => {
  const [activePage, setActivePage] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

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

      {/* Feature Card — Call Log (Hero) */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.heroCard}
        onPress={() => openPage('calllog')}>
        <View style={styles.heroAccentBar} />
        <View style={styles.heroBody}>
          <View style={styles.heroMeta}>
            <View style={styles.liveTag}>
              <Text style={styles.liveTagText}>LIVE</Text>
            </View>
            <Text style={styles.heroCategory}>FEATURES</Text>
          </View>
          <Text style={styles.heroIcon}>📞</Text>
          <Text style={styles.heroHeadline}>Your Call Log</Text>
          <Text style={styles.heroSub}>
            View, filter & export every call at a glance
          </Text>
          <View style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Open →</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
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
});