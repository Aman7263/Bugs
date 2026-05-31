import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import * as Contacts from 'expo-contacts';

const CALL_TYPE_META = {
  '1': { label: 'Incoming', color: '#2a9d8f', dot: '↙' },
  '2': { label: 'Outgoing', color: '#2b2d42', dot: '↗' },
  '3': { label: 'Missed', color: '#e63946', dot: '✕' },
  '5': { label: 'Rejected', color: '#f4a261', dot: '⊘' },
};

const GetCallLog = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        loadCallLogs();
      } else {
        Alert.alert('Permission denied', 'Contacts permission is required');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const loadCallLogs = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
      });
      if (data.length > 0) {
        const now = new Date();
        const formattedData = data
          .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
          .map((contact, index) => {
            const type = ['1', '2', '3', '5'][index % 4];
            
            // Distribute timestamps back in time (today, yesterday, days ago, past years)
            let timestamp;
            if (index < 4) {
              // Today
              timestamp = Date.now() - index * 1.5 * 3600000 - Math.floor(Math.random() * 3600000);
            } else if (index < 8) {
              // Yesterday
              timestamp = Date.now() - 24 * 3600000 - (index - 4) * 3 * 3600000;
            } else if (index < 14) {
              // Recent days (current year)
              timestamp = Date.now() - (index - 5) * 24 * 3600000;
            } else if (index < 20) {
              // Last year (2025)
              const lastYearDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
              timestamp = lastYearDate.getTime() - (index - 14) * 5 * 24 * 3600000;
            } else {
              // Two years ago (2024)
              const twoYearsAgoDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
              timestamp = twoYearsAgoDate.getTime() - (index - 20) * 12 * 24 * 3600000;
            }

            return {
              id: contact.id || index.toString(),
              name: contact.name || 'Unknown',
              phoneNumber: contact.phoneNumbers[0].number,
              type,
              timestamp,
              duration: Math.floor(Math.random() * 300) + 10,
            };
          });

        // Ensure chronological sorting: newest first (today first, yesterday next, etc.)
        const sortedData = formattedData.sort((a, b) => b.timestamp - a.timestamp);
        setLogs(sortedData);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const getCollapsedLogs = (rawLogs) => {
    const collapsed = [];
    const seen = new Map();

    rawLogs.forEach((log) => {
      const key = log.name !== 'Unknown' ? log.name : log.phoneNumber;
      if (seen.has(key)) {
        const index = seen.get(key);
        collapsed[index].count += 1;
      } else {
        seen.set(key, collapsed.length);
        collapsed.push({
          ...log,
          count: 1,
        });
      }
    });
    return collapsed;
  };

  const downloadLogs = async () => {
    if (logs.length === 0) {
      Alert.alert('No data', 'No contacts to share');
      return;
    }
    const filtered = filter === 'All'
      ? logs
      : logs.filter((l) => CALL_TYPE_META[l.type]?.label === filter);
    const collapsed = getCollapsedLogs(filtered);

    let content = 'COLLAPSED CONTACT LOGS\n============================\n\n';
    collapsed.forEach((log) => {
      const meta = CALL_TYPE_META[log.type] || { label: 'Unknown' };
      content += `Name: ${log.name} (Calls: ${log.count})\n`;
      content += `Number: ${log.phoneNumber}\n`;
      content += `Recent Call Type: ${meta.label}\n`;
      content += `Recent Call Date: ${new Date(log.timestamp).toLocaleString()}\n`;
      content += `Recent Call Duration: ${log.duration}s\n`;
      content += `-----------------------------\n\n`;
    });
    try {
      await Share.share({ message: content, title: 'Contact Logs' });
    } catch (err) {
      Alert.alert('Error', 'Failed to share contacts');
    }
  };

  const filters = ['All', 'Incoming', 'Outgoing', 'Missed'];

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getSectionTitle = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getGroupedLogs = () => {
    const grouped = {};
    const filtered = filter === 'All'
      ? logs
      : logs.filter((l) => CALL_TYPE_META[l.type]?.label === filter);

    const collapsed = getCollapsedLogs(filtered);

    collapsed.forEach((log) => {
      const title = getSectionTitle(log.timestamp);
      if (!grouped[title]) {
        grouped[title] = [];
      }
      grouped[title].push(log);
    });

    return Object.keys(grouped).map((title) => ({
      title,
      data: grouped[title],
    }));
  };

  const groupedSections = getGroupedLogs();

  const renderItem = ({ item, index }) => {
    const meta = CALL_TYPE_META[item.type] || { label: 'Unknown', color: '#888', dot: '?' };
    const displayName = item.count > 1 ? `${item.name} (${item.count})` : item.name;
    return (
      <View style={[styles.logRow, index === 0 && styles.logRowFirst]} key={item.id}>
        {/* Type indicator */}
        <View style={[styles.typeBadge, { borderColor: meta.color }]}>
          <Text style={[styles.typeDot, { color: meta.color }]}>{meta.dot}</Text>
        </View>

        {/* Main info */}
        <View style={styles.logInfo}>
          <Text style={styles.logName} numberOfLines={1}>{displayName}</Text>
          <Text style={styles.logNumber}>{item.phoneNumber}</Text>
          <Text style={[styles.logTypeLabel, { color: meta.color }]}>{meta.label}</Text>
        </View>

        {/* Time + duration */}
        <View style={styles.logMeta}>
          <Text style={styles.logTime}>{formatTime(item.timestamp)}</Text>
          <Text style={styles.logDuration}>{item.duration}s</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Stats strip */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{logs.length}</Text>
          <Text style={styles.statLabel}>CONTACTS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {logs.filter((l) => l.type === '3').length}
          </Text>
          <Text style={styles.statLabel}>MISSED</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {Math.round(logs.reduce((a, l) => a + l.duration, 0) / 60)}m
          </Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
      </View>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grouped Lists */}
      {groupedSections.length > 0 ? (
        groupedSections.map((section) => (
          <View key={section.title} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
            <View style={styles.sectionDivider} />
            {section.data.map((item, index) => renderItem({ item, index }))}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No calls found.</Text>
      )}

      {/* Export button */}
      <TouchableOpacity style={styles.exportBtn} onPress={downloadLogs} activeOpacity={0.85}>
        <Text style={styles.exportText}>↓  Export Logs</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetCallLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#0d0d0d',
    borderRadius: 4,
    marginBottom: 16,
    paddingVertical: 14,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: '#888',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333',
    marginVertical: 4,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
  },
  filterPillActive: {
    backgroundColor: '#0d0d0d',
    borderColor: '#0d0d0d',
  },
  filterText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#888',
  },
  filterTextActive: {
    color: '#fff',
  },

  // Section Headers
  sectionContainer: {
    marginBottom: 12,
  },
  sectionHeader: {
    paddingVertical: 4,
    marginTop: 10,
    marginBottom: 2,
  },
  sectionHeaderText: {
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '700',
    color: '#0d0d0d',
    letterSpacing: 0.5,
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: '#0d0d0d',
    marginBottom: 4,
  },

  // Log rows
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logRowFirst: {
    borderTopWidth: 0,
  },
  typeBadge: {
    width: 32,
    height: 32,
    borderRadius: 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeDot: {
    fontSize: 14,
    fontWeight: '700',
  },
  logInfo: {
    flex: 1,
  },
  logName: {
    fontFamily: 'Georgia',
    fontSize: 15,
    fontWeight: '700',
    color: '#0d0d0d',
    marginBottom: 2,
  },
  logNumber: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  logTypeLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  logMeta: {
    alignItems: 'flex-end',
  },
  logTime: {
    fontSize: 10,
    color: '#555',
    fontWeight: '600',
  },
  logDuration: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 2,
  },

  // Export
  exportBtn: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    borderRadius: 2,
    paddingVertical: 14,
    alignItems: 'center',
  },
  exportText: {
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '700',
    color: '#0d0d0d',
    letterSpacing: 0.5,
  },

  emptyText: {
    fontFamily: 'Georgia',
    color: '#bbb',
    textAlign: 'center',
    paddingVertical: 30,
    fontSize: 14,
  },
});