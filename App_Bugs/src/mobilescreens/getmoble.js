import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import * as Cellular from 'expo-cellular';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import * as Battery from 'expo-battery';

const GetMobile = () => {
  const [loading, setLoading] = useState(true);
  const [specs, setSpecs] = useState(null);

  useEffect(() => {
    loadSpecs();
  }, []);

  const loadSpecs = async () => {
    setLoading(true);
    try {
      // SIM details
      let carrier = 'Unknown';
      let mcc = 'N/A';
      let mnc = 'N/A';
      let cellGen = 'N/A';
      const voipAllowed = Cellular.allowsVOIP ? 'Yes' : 'No';

      try {
        carrier = (await Cellular.getCarrierNameAsync()) || 'No Carrier / SIM';
      } catch (e) {
        console.warn('Cellular carrier error:', e);
      }
      try {
        mcc = (await Cellular.getMobileCountryCodeAsync()) || 'N/A';
      } catch (e) {
        console.warn('Cellular MCC error:', e);
      }
      try {
        mnc = (await Cellular.getMobileNetworkCodeAsync()) || 'N/A';
      } catch (e) {
        console.warn('Cellular MNC error:', e);
      }
      try {
        const gen = await Cellular.getCellularGenerationAsync();
        const genMap = {
          0: 'Unknown',
          1: '2G',
          2: '3G',
          3: '4G',
          4: '5G',
        };
        cellGen = genMap[gen] || 'Unknown';
      } catch (e) {
        console.warn('Cellular generation error:', e);
      }

      // Hardware Specifications
      const brand = Device.brand || 'Unknown';
      const manufacturer = Device.manufacturer || 'Unknown';
      const model = Device.modelName || 'Unknown';
      const isPhys = Device.isDevice ? 'Physical Device' : 'Simulator / Emulator';
      
      let ram = 'N/A';
      if (Device.totalMemory) {
        ram = (Device.totalMemory / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
      }

      const cpuArch = Device.supportedCpuArchitectures 
        ? Device.supportedCpuArchitectures.join(', ') 
        : 'N/A';

      const devTypeMap = {
        0: 'Unknown',
        1: 'Phone',
        2: 'Tablet',
        3: 'TV',
        4: 'Desktop',
      };
      const deviceType = devTypeMap[Device.deviceType] || 'Unknown';

      // System details
      const osName = Device.osName || 'Unknown';
      const osVersion = Device.osVersion || 'Unknown';
      const buildId = Device.osBuildId || 'N/A';
      const internalBuild = Device.osInternalBuildId || 'N/A';
      const deviceName = Device.deviceName || 'Unknown';

      // Network details
      let ipAddress = 'Offline';
      let connType = 'N/A';
      let airplaneMode = 'N/A';

      try {
        ipAddress = (await Network.getIpAddressAsync()) || 'Offline';
      } catch (e) {
        console.warn('Network IP error:', e);
      }
      try {
        const netState = await Network.getNetworkStateAsync();
        connType = netState.type || 'N/A';
      } catch (e) {
        console.warn('Network state error:', e);
      }
      try {
        const air = await Network.isAirplaneModeEnabledAsync();
        airplaneMode = air ? 'Enabled' : 'Disabled';
      } catch (e) {
        // Airplane mode is Android only
        airplaneMode = 'Unsupported on iOS';
      }

      // Battery details
      let batteryPct = 'N/A';
      let batState = 'N/A';
      let lowPower = 'N/A';

      try {
        const lvl = await Battery.getBatteryLevelAsync();
        batteryPct = lvl >= 0 ? Math.round(lvl * 100) + '%' : 'N/A';
      } catch (e) {
        console.warn('Battery level error:', e);
      }
      try {
        const state = await Battery.getBatteryStateAsync();
        const stateMap = {
          0: 'Unknown',
          1: 'Unplugged',
          2: 'Charging',
          3: 'Full',
        };
        batState = stateMap[state] || 'Unknown';
      } catch (e) {
        console.warn('Battery state error:', e);
      }
      try {
        const lp = await Battery.isLowPowerModeEnabledAsync();
        lowPower = lp ? 'On' : 'Off';
      } catch (e) {
        console.warn('Battery low power error:', e);
      }

      setSpecs({
        sim: { carrier, mcc, mnc, cellGen, voipAllowed },
        device: { brand, manufacturer, model, isPhys, ram, cpuArch, deviceType },
        system: { osName, osVersion, buildId, internalBuild, deviceName },
        network: { ipAddress, connType, airplaneMode },
        battery: { batteryPct, batState, lowPower },
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to retrieve hardware specs');
    } finally {
      setLoading(false);
    }
  };

  const exportSpecs = async () => {
    if (!specs) return;
    let content = 'MOBILE SPECIFICATIONS & SIM SCAN\n';
    content += '====================================\n\n';

    content += '[SIM CARD DATA]\n';
    content += `Carrier: ${specs.sim.carrier}\n`;
    content += `MCC: ${specs.sim.mcc}\n`;
    content += `MNC: ${specs.sim.mnc}\n`;
    content += `Generation: ${specs.sim.cellGen}\n`;
    content += `VoIP Allowed: ${specs.sim.voipAllowed}\n\n`;

    content += '[DEVICE HARDWARE]\n';
    content += `Brand/Model: ${specs.device.brand} ${specs.device.model}\n`;
    content += `Manufacturer: ${specs.device.manufacturer}\n`;
    content += `RAM: ${specs.device.ram}\n`;
    content += `CPU Arch: ${specs.device.cpuArch}\n`;
    content += `Device Type: ${specs.device.deviceType}\n`;
    content += `State: ${specs.device.isPhys}\n\n`;

    content += '[SYSTEM CONFIG]\n';
    content += `Device Name: ${specs.system.deviceName}\n`;
    content += `OS: ${specs.system.osName} v${specs.system.osVersion}\n`;
    content += `Build ID: ${specs.system.buildId}\n`;
    content += `Internal Build: ${specs.system.internalBuild}\n\n`;

    content += '[NETWORK CONFIG]\n';
    content += `IP Address: ${specs.network.ipAddress}\n`;
    content += `Conn Type: ${specs.network.connType}\n`;
    content += `Airplane Mode: ${specs.network.airplaneMode}\n\n`;

    content += '[BATTERY STATE]\n';
    content += `Level: ${specs.battery.batteryPct}\n`;
    content += `State: ${specs.battery.batState}\n`;
    content += `Low Power: ${specs.battery.lowPower}\n\n`;

    content += '====================================\n';
    content += `Generated on: ${new Date().toLocaleString()}\n`;

    try {
      await Share.share({ message: content, title: 'Device Specifications' });
    } catch (err) {
      Alert.alert('Error', 'Failed to share specs');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d0d0d" />
        <Text style={styles.loadingText}>Retrieving Device Specifications...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SIM Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>SIM Card & Carrier</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Carrier Name</Text>
            <Text style={styles.specVal}>{specs.sim.carrier}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Mobile Country Code (MCC)</Text>
            <Text style={styles.specVal}>{specs.sim.mcc}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Mobile Network Code (MNC)</Text>
            <Text style={styles.specVal}>{specs.sim.mnc}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Cellular Generation</Text>
            <Text style={styles.specVal}>{specs.sim.cellGen}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>VoIP Permitted</Text>
            <Text style={styles.specVal}>{specs.sim.voipAllowed}</Text>
          </View>
        </View>
      </View>

      {/* Hardware Specs Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Hardware Specifications</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Brand / Model</Text>
            <Text style={styles.specVal}>{specs.device.brand} {specs.device.model}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Manufacturer</Text>
            <Text style={styles.specVal}>{specs.device.manufacturer}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>System Memory (RAM)</Text>
            <Text style={styles.specVal}>{specs.device.ram}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>CPU Architecture</Text>
            <Text style={styles.specVal} numberOfLines={1}>{specs.device.cpuArch}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Device Class</Text>
            <Text style={styles.specVal}>{specs.device.deviceType}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Physical Hardware</Text>
            <Text style={styles.specVal}>{specs.device.isPhys}</Text>
          </View>
        </View>
      </View>

      {/* System Settings Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>System Configuration</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Device OS</Text>
            <Text style={styles.specVal}>{specs.system.osName} v{specs.system.osVersion}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Device Host Name</Text>
            <Text style={styles.specVal}>{specs.system.deviceName}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>System Build ID</Text>
            <Text style={styles.specVal} numberOfLines={1}>{specs.system.buildId}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Internal Build Hash</Text>
            <Text style={styles.specVal} numberOfLines={1}>{specs.system.internalBuild}</Text>
          </View>
        </View>
      </View>

      {/* Network Config Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Network State</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Local IP Address</Text>
            <Text style={styles.specVal}>{specs.network.ipAddress}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Interface Type</Text>
            <Text style={styles.specVal}>{specs.network.connType}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Airplane Mode</Text>
            <Text style={styles.specVal}>{specs.network.airplaneMode}</Text>
          </View>
        </View>
      </View>

      {/* Power Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Battery & Power</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Battery Level</Text>
            <Text style={styles.specVal}>{specs.battery.batteryPct}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Charging State</Text>
            <Text style={styles.specVal}>{specs.battery.batState}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Low Power Mode</Text>
            <Text style={styles.specVal}>{specs.battery.lowPower}</Text>
          </View>
        </View>
      </View>

      {/* Export button */}
      <TouchableOpacity style={styles.exportBtn} onPress={exportSpecs} activeOpacity={0.85}>
        <Text style={styles.exportText}>↓  Share Specifications</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default GetMobile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: '#888',
    marginTop: 14,
  },

  // Premium Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ebebeb',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#0d0d0d',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  // Spec row list
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specKey: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    flex: 1,
    paddingRight: 10,
  },
  specVal: {
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '700',
    color: '#0d0d0d',
    textAlign: 'right',
  },

  // Export
  exportBtn: {
    marginTop: 10,
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
});
