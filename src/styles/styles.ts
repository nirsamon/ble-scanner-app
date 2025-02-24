import { StyleSheet, StatusBar } from 'react-native';

export default StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: StatusBar.currentHeight || 20, // Fixes overlap with status bar
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceId: {
    fontSize: 14,
    color: '#666',
  },
  noDevices: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});