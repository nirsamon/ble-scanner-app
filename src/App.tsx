import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { RunClassNames, kotlinRun } from './kotlinRun';
import { EVENT_ON_BLE_SCAN, registerEvents } from 'kotlin-swift-bridge';
import { NativeEventEmitter } from 'react-native';
import styles from './styles/styles';
import AppButton from './components/AppButton';

const App = () => {
  const emitter = new NativeEventEmitter();
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-run registerEvents on app startup
    const initializeBLE = async () => {
      try {
        await registerEvents();
        console.log('BLE events registered successfully.');
      } catch (error) {
        console.error('Failed to register BLE events:', error);
      }
    };

    initializeBLE();

    const listener = emitter.addListener(EVENT_ON_BLE_SCAN, async event => {
      console.log(`onBleScan event: ${JSON.stringify(event)}`);
      Alert.alert('Notification', event);
    });

    return () => {
      listener.remove();
    };
  }, []);

  const parseScanResult = (response: any): any[] => {
    try {
      if (response?.isSuccess && response?.response?.resultCode === 0) {
        const rawData = response?.response?.data;
  
        // Ensure rawData is a valid JSON string before parsing
        const parsedData = JSON.parse(rawData);
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      }
    } catch (error) {
      console.error("Error parsing BLE devices:", error);
    }
    return []; // Return empty array if parsing fails
  };

  // const parseBleData = (result: any) => {
  //   try {
  //     console.log('Raw ScanBleDevices result:', result);

  //     if (!result || typeof result !== 'string') {
  //       console.warn('Invalid result format, expected a JSON string.');
  //       setDevices([]);
  //       return;
  //     }

  //     const parsedResult = JSON.parse(result);

  //     if (!parsedResult.isSuccess || parsedResult.response.resultCode !== 0) {
  //       console.warn('Scan failed:', parsedResult.errorMessage);
  //       setDevices([]);
  //       return;
  //     }

  //     if (!parsedResult.response.data) {
  //       console.warn('No "data" field found.');
  //       setDevices([]);
  //       return;
  //     }

  //     // Ensure "data" is a valid JSON array
  //     let deviceArray = [];
  //     try {
  //       deviceArray = JSON.parse(parsedResult.response.data);
  //     } catch (jsonError) {
  //       console.error('Failed to parse "data" field:', jsonError);
  //       setDevices([]);
  //       return;
  //     }

  //     if (!Array.isArray(deviceArray)) {
  //       console.warn('"data" is not an array.');
  //       setDevices([]);
  //       return;
  //     }

  //     // Format devices
  //     const formattedDevices = deviceArray.map((device: any) => ({
  //       name: device.name?.trim() || 'Unknown Device',
  //       address: device.address?.trim() || 'N/A',
  //       rssi: device.rssi !== undefined && device.rssi !== '' ? device.rssi : 'N/A',
  //     }));

  //     setDevices(formattedDevices);
  //   } catch (error) {
  //     console.error('Error parsing BLE devices:', error);
  //     setDevices([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleStartScan = async () => {
    setLoading(true);
    setDevices([]);

    try {
      const result = await kotlinRun({
        className: RunClassNames.ScanBleDevices,
        params: {},
      });

      console.log("Raw Response:", result);
      const devices = parseScanResult(result);
      if(devices.length === 0) {
        Alert.alert('Scan Error', 'No devices found')
        setDevices([]);
      } else {
        setDevices(devices);
      }
    } catch (error) {
      Alert.alert('Scan Error', 'Failed to parse device data.');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safeContainer}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>BLE Scanner</Text>

        <AppButton title="Start Scan" onPress={handleStartScan} disabled={loading} />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.scanningText}>Scanning...</Text>
          </View>
        ) : (
          <FlatList
            data={devices}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.deviceItem}
                onPress={() => {
                  setSelectedDevice(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.deviceName}>{item.name}</Text>
                <Text style={styles.deviceId}>Address: {item.address}</Text>
                <Text style={styles.deviceId}>RSSI: {item.rssi}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.noDevices}>{loading ? 'Scanning...' : 'No devices found'}</Text>}
          />
        )}

        {/* Modal for Device Details */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Device Details</Text>
              {selectedDevice && (
                <>
                  <Text>Name: {selectedDevice.name}</Text>
                  <Text>Address: {selectedDevice.address}</Text>
                  <Text>RSSI: {selectedDevice.rssi}</Text>
                </>
              )}
              <AppButton title="Close" onPress={() => setModalVisible(false)} disabled={false}/>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default App;