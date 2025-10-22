import { ApiService } from '@/utils/apiService';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ConfigModalProps {
  visible: boolean;
  onClose: () => void;
  currentUrl: string;
  onUrlChange: (newUrl: string) => void;
  onRetry: () => void;
  error: string | null;
  onLoadSampleData: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  visible,
  onClose,
  currentUrl,
  onUrlChange,
  onRetry,
  error,
  onLoadSampleData,
}) => {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Temporarily set the URL for testing
      const originalUrl = ApiService.getBaseUrl();
      ApiService.setBaseUrl(inputUrl);

      const isHealthy = await ApiService.healthCheck();
      
      if (isHealthy) {
        setTestResult('✓ Connection successful!');
      } else {
        setTestResult('✗ Server unreachable');
        ApiService.setBaseUrl(originalUrl); // Restore original URL
      }
    } catch (err) {
      setTestResult('✗ Connection failed');
      const originalUrl = currentUrl;
      ApiService.setBaseUrl(originalUrl); // Restore original URL
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!inputUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      Alert.alert('Error', 'URL must start with http:// or https://');
      return;
    }

    ApiService.setBaseUrl(inputUrl);
    onUrlChange(inputUrl);
    Alert.alert('Success', 'Server URL updated successfully');
    onClose();
  };

  const handleCancel = () => {
    setInputUrl(currentUrl); // Reset to current URL
    setTestResult(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              Server Configuration
            </ThemedText>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {/* Server URL Input */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Server URL</ThemedText>
              <TextInput
                style={styles.input}
                value={inputUrl}
                onChangeText={setInputUrl}
                placeholder="http://192.168.1.83:8000"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <ThemedText style={styles.hint}>
                Examples:{'\n'}
                • Physical device: http://YOUR_IP:8000{'\n'}
                • Android Emulator: http://10.0.2.2:8000{'\n'}
                • iOS Simulator: http://localhost:8000
              </ThemedText>
            </View>

            {/* Test Connection */}
            <View style={styles.section}>
              <TouchableOpacity
                style={[styles.testButton, isTesting && styles.buttonDisabled]}
                onPress={handleTestConnection}
                disabled={isTesting}
              >
                <ThemedText style={styles.testButtonText}>
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </ThemedText>
              </TouchableOpacity>

              {testResult && (
                <View style={[
                  styles.testResult,
                  testResult.startsWith('✓') ? styles.testSuccess : styles.testError
                ]}>
                  <ThemedText style={styles.testResultText}>{testResult}</ThemedText>
                </View>
              )}
            </View>

            {/* Current Status */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Current Status</ThemedText>
              <View style={styles.statusBox}>
                <ThemedText style={styles.statusLabel}>Active URL:</ThemedText>
                <ThemedText style={styles.statusValue}>{currentUrl}</ThemedText>
                
                {error && (
                  <>
                    <ThemedText style={[styles.statusLabel, styles.errorLabel]}>
                      Last Error:
                    </ThemedText>
                    <ThemedText style={styles.errorText}>{error}</ThemedText>
                  </>
                )}
              </View>
            </View>

            {/* Retry Connection */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  onRetry();
                  Alert.alert('Info', 'Retrying connection...');
                }}
              >
                <ThemedText style={styles.retryButtonText}>
                  Retry Connection
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Sample Data */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Sample Data</ThemedText>
              <TouchableOpacity
                style={styles.sampleDataButton}
                onPress={onLoadSampleData}
              >
                <ThemedText style={styles.sampleDataButtonText}>
                  Use Sample Data
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    borderWidth: 1,
    borderColor: '#444',
  },
  hint: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 16,
  },
  testButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  testResult: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  testSuccess: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  testError: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  testResultText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  statusBox: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#0a7ea4',
  },
  errorLabel: {
    color: '#e74c3c',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#e74c3c',
  },
  retryButton: {
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
  sampleDataButton: {
    backgroundColor: '#9C27B0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sampleDataButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#555',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
});

export default ConfigModal;
