import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
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
        const formattedData = data
          .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
          .map((contact, index) => ({
            id: contact.id || index.toString(),
            name: contact.name || 'Unknown',
            phoneNumber: contact.phoneNumbers[0].number,
            type: '1',
            timestamp: Date.now() - index * 3600000,
            duration: Math.floor(Math.random() * 300),
          }));
        setLogs(formattedData);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const downloadLogs = async () => {
    if (logs.length === 0) {
      Alert.alert('No data', 'No contacts to share');
      return;
    }
    let content = 'CONTACT LOGS\n============================\n\n';
    logs.forEach((log) => {
      const meta = CALL_TYPE_META[log.type] || { label: 'Unknown' };
      content += `Name: ${log.name}\n`;
      content += `Number: ${log.phoneNumber}\n`;
      content += `Type: ${meta.label}\n`;
      content += `Date: ${new Date(log.timestamp).toLocaleString()}\n`;
      content += `Duration: ${log.duration}s\n`;
      content += `-----------------------------\n\n`;
    });
    try {
      await Share.share({ message: content, title: 'Contact Logs' });
    } catch (err) {
      Alert.alert('Error', 'Failed to share contacts');
    }
  };

  const filters = ['All', 'Incoming', 'Outgoing', 'Missed'];
  const filteredLogs =
    filter === 'All'
      ? logs
      : logs.filter((l) => CALL_TYPE_META[l.type]?.label === filter);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderItem = ({ item, index }) => {
    const meta = CALL_TYPE_META[item.type] || { label: 'Unknown', color: '#888', dot: '?' };
    const isFirst = index === 0;
    return (
      <View style={[styles.logRow, isFirst && styles.logRowFirst]}>
        {/* Type indicator */}
        <View style={[styles.typeBadge, { borderColor: meta.color }]}>
          <Text style={[styles.typeDot, { color: meta.color }]}>{meta.dot}</Text>
        </View>

        {/* Main info */}
        <View style={styles.logInfo}>
          <Text style={styles.logName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.logNumber}>{item.phoneNumber}</Text>
          <Text style={[styles.logTypeLabel, { color: meta.color }]}>{meta.label}</Text>
        </View>

        {/* Time + duration */}
        <View style={styles.logMeta}>
          <Text style={styles.logDate}>{formatDate(item.timestamp)}</Text>
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

      {/* Column headers */}
      <View style={styles.columnHeader}>
        <Text style={styles.columnLabel}>CONTACT</Text>
        <Text style={[styles.columnLabel, { textAlign: 'right' }]}>TIME / DUR</Text>
      </View>
      <View style={styles.columnDivider} />

      {/* List */}
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No calls found.</Text>
        }
      />

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

  // Column header
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  columnLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: '#bbb',
  },
  columnDivider: {
    height: 2,
    backgroundColor: '#0d0d0d',
    marginBottom: 2,
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
  logDate: {
    fontSize: 10,
    color: '#555',
    fontWeight: '600',
  },
  logTime: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 1,
  },
  logDuration: {
    fontSize: 10,
    color: '#bbb',
    marginTop: 1,
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