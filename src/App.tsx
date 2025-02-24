import React, {useState, useEffect} from 'react';
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
import {RunClassNames, kotlinRun} from './kotlinRun';
import {EVENT_ON_BLE_SCAN, registerEvents} from 'kotlin-swift-bridge';
import {NativeEventEmitter} from 'react-native';
import styles from './styles/styles';
import AppButton from './components/AppButton';
import {
  requestPermissions,
  requestBluetoothPermissions,
} from 'kotlin-swift-bridge';

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
      const eventData = JSON.parse(event.data);
      const eventCode = eventData.eventCode;
      const eventMessage = eventData.eventMessage;

      if (eventCode === 101 && devices.length === 0) {
        Alert.alert(`Event: ${eventCode}`, 'No devices found.');
      } else {
        Alert.alert(`Event: ${eventCode}`, eventMessage);
      }
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
      console.error('Error parsing BLE devices:', error);
    }
    return []; // Return empty array if parsing fails
  };

  const handleStartScan = async () => {
    setLoading(true);
    setDevices([]);

    try {
      // Request necessary permissions
      const bluetoothPermissionsGranted = await requestBluetoothPermissions();

      if (!bluetoothPermissionsGranted) {
        Alert.alert(
          'Permission Error',
          'Required permissions were not granted.',
        );
        setLoading(false);
        return;
      }

      const result = await kotlinRun({
        className: RunClassNames.ScanBleDevices,
        params: { 
          scanTimeout: 15000
        },
      });

      console.log('Raw Response:', result);
      const devices = parseScanResult(result);
      setDevices(devices);
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

        <AppButton
          title="Start Scan"
          onPress={handleStartScan}
          disabled={loading}
        />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.scanningText}>Scanning...</Text>
          </View>
        ) : (
          <FlatList
            data={devices}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.deviceItem}
                onPress={() => {
                  setSelectedDevice(item);
                  setModalVisible(true);
                }}>
                <Text style={styles.deviceName}>{item.name}</Text>
                <Text style={styles.deviceId}>Address: {item.address}</Text>
                <Text style={styles.deviceId}>RSSI: {item.rssi}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noDevices}>
                {loading ? '' : 'No devices found'}
              </Text>
            }
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
              <AppButton
                title="Close"
                onPress={() => setModalVisible(false)}
                disabled={false}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default App;
