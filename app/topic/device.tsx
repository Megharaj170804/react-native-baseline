import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Vibration, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Image as ImageIcon, MapPin, Bell, Smartphone, Settings, CheckCircle, XCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

export default function DevicePage() {
  const router = useRouter();
  
  // Image and media states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<'camera' | 'gallery' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Location states
  const [location, setLocation] = useState<any>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<string>('');
  const [locationHistory, setLocationHistory] = useState<any[]>([]);
  
  // Device feature states
  const [vibrationPattern, setVibrationPattern] = useState<'short' | 'long' | 'pattern'>('short');
  const [permissionStatus, setPermissionStatus] = useState<{[key: string]: string}>({});
  const [deviceInfo, setDeviceInfo] = useState({
    platform: Platform.OS,
    version: Platform.Version,
    isDevice: Constants.isDevice,
  });
  
  // Notification states
  const [notificationDemo, setNotificationDemo] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Check permissions on load
  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    const permissions: {[key: string]: string} = {};
    
    try {
      const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
      permissions.camera = cameraStatus.status;
      
      const mediaStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
      permissions.media = mediaStatus.status;
      
      const locationStatus = await Location.getForegroundPermissionsAsync();
      permissions.location = locationStatus.status;
    } catch (error) {
      console.log('Permission check error:', error);
    }
    
    setPermissionStatus(permissions);
  };

  // Enhanced camera function
  const openCamera = async () => {
    try {
      setIsLoading(true);
      
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow camera access to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setImageSource('camera');
        Alert.alert('Success!', 'Photo captured from camera!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced gallery function
  const openGallery = async () => {
    try {
      setIsLoading(true);
      
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow photo access to select images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setImageSource('gallery');
        Alert.alert('Success!', 'Image selected from gallery!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open gallery');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced location function
  const getLocation = async () => {
    try {
      setIsLoading(true);
      
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow location access');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(currentLocation);
      setLocationAccuracy(currentLocation.coords.accuracy ? `±${Math.round(currentLocation.coords.accuracy)}m` : 'Unknown');
      
      // Add to history
      setLocationHistory(prev => [
        ...prev.slice(-4), // Keep last 4
        {
          ...currentLocation,
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
      
      Alert.alert(
        '📍 Location Found!', 
        `Lat: ${currentLocation.coords.latitude.toFixed(6)}\nLng: ${currentLocation.coords.longitude.toFixed(6)}\nAccuracy: ${locationAccuracy}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced vibration patterns
  const handleVibration = (pattern: 'short' | 'long' | 'pattern') => {
    setVibrationPattern(pattern);
    
    switch (pattern) {
      case 'short':
        Vibration.vibrate(200);
        Alert.alert('Short Vibration', 'Quick buzz!');
        break;
      case 'long':
        Vibration.vibrate(1000);
        Alert.alert('Long Vibration', 'Extended buzz!');
        break;
      case 'pattern':
        Vibration.vibrate([100, 200, 100, 200, 300]);
        Alert.alert('Pattern Vibration', 'Rhythm buzz!');
        break;
    }
  };

  // Enhanced notification demo
  const handleNotificationDemo = () => {
    setNotificationDemo(true);
    setNotificationCount(prev => prev + 1);
    
    setTimeout(() => {
      setNotificationDemo(false);
      Alert.alert(
        'Notification Demo',
        `This is notification #${notificationCount + 1}!\n\nIn a real app, this would:\n• Request notification permissions\n• Schedule push notifications\n• Handle notification taps\n• Show in notification center\n\nRequires development build for full testing.`,
        [{ text: 'Got it!' }]
      );
    }, 1000);
  };

  const clearAllData = () => {
    setSelectedImage(null);
    setImageSource(null);
    setLocation(null);
    setLocationHistory([]);
    setNotificationCount(0);
    Alert.alert('Cleared', 'All demo data cleared!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Device Features</Text>
        <Text style={styles.headerSubtitle}>Native hardware access!</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        
        {/* 1. Camera & Gallery Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Camera & Photo Gallery</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Image Capture Demo</Text>
            
            <View style={styles.cameraGallerySection}>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cameraButton, isLoading && styles.disabledButton]}
                  onPress={openCamera}
                  disabled={isLoading}
                >
                  <Camera size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    {isLoading ? 'Opening...' : 'Camera'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.galleryButton, isLoading && styles.disabledButton]}
                  onPress={openGallery}
                  disabled={isLoading}
                >
                  <ImageIcon size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    {isLoading ? 'Opening...' : 'Gallery'}
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedImage && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                  <View style={styles.imageInfo}>
                    <Text style={styles.imageInfoText}>
                    Source: {imageSource === 'camera' ? 'Camera' : 'Gallery'}
                    </Text>
                    <TouchableOpacity style={styles.clearButton} onPress={() => setSelectedImage(null)}>
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.permissionStatus}>
                <Text style={styles.permissionTitle}>Permissions:</Text>
                <View style={styles.permissionRow}>
                  <Text style={styles.permissionLabel}>Camera:</Text>
                  {permissionStatus.camera === 'granted' ? 
                    <CheckCircle size={16} color="#10B981" /> : 
                    <XCircle size={16} color="#EF4444" />
                  }
                  <Text style={[styles.permissionValue, {color: permissionStatus.camera === 'granted' ? '#10B981' : '#EF4444'}]}>
                    {permissionStatus.camera || 'Not checked'}
                  </Text>
                </View>
                <View style={styles.permissionRow}>
                  <Text style={styles.permissionLabel}>Photos:</Text>
                  {permissionStatus.media === 'granted' ? 
                    <CheckCircle size={16} color="#10B981" /> : 
                    <XCircle size={16} color="#EF4444" />
                  }
                  <Text style={[styles.permissionValue, {color: permissionStatus.media === 'granted' ? '#10B981' : '#EF4444'}]}>
                    {permissionStatus.media || 'Not checked'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Location & GPS Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Location & GPS Services</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>GPS Location Demo</Text>

            <TouchableOpacity
              style={[styles.actionButton, styles.locationButton, isLoading && styles.disabledButton]}
              onPress={getLocation}
              disabled={isLoading}
            >
              <MapPin size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {isLoading ? 'Getting Location...' : 'Get Current Location'}
              </Text>
            </TouchableOpacity>

            {location && (
              <View style={styles.locationDisplay}>
                <Text style={styles.locationTitle}>Current Location:</Text>
                <View style={styles.locationDetails}>
                  <Text style={styles.locationText}>
                    Latitude: {location.coords.latitude.toFixed(6)}
                  </Text>
                  <Text style={styles.locationText}>
                    Longitude: {location.coords.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.locationText}>
                    Accuracy: {locationAccuracy}
                  </Text>
                  <Text style={styles.locationText}>
                    Altitude: {location.coords.altitude ? `${Math.round(location.coords.altitude)}m` : 'Unknown'}
                  </Text>
                </View>
              </View>
            )}

            {locationHistory.length > 0 && (
              <View style={styles.locationHistory}>
                <Text style={styles.historyTitle}>Location History:</Text>
                {locationHistory.slice(-3).map((loc, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyText}>
                      {loc.timestamp}: {loc.coords.latitude.toFixed(4)}, {loc.coords.longitude.toFixed(4)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 3. Vibration Patterns Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Haptic Feedback & Vibration</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Vibration Patterns</Text>
            
            <View style={styles.vibrationControls}>
              <TouchableOpacity 
                style={[styles.vibrationButton, vibrationPattern === 'short' && styles.activeVibrationButton]}
                onPress={() => handleVibration('short')}
              >
                <Text style={styles.vibrationButtonText}>Short Buzz</Text>
                <Text style={styles.vibrationSubtext}>200ms</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.vibrationButton, vibrationPattern === 'long' && styles.activeVibrationButton]}
                onPress={() => handleVibration('long')}
              >
                <Text style={styles.vibrationButtonText}>Long Buzz</Text>
                <Text style={styles.vibrationSubtext}>1000ms</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.vibrationButton, vibrationPattern === 'pattern' && styles.activeVibrationButton]}
                onPress={() => handleVibration('pattern')}
              >
                <Text style={styles.vibrationButtonText}>Pattern</Text>
                <Text style={styles.vibrationSubtext}>Rhythm</Text>
              </TouchableOpacity>
            </View>

            
          </View>
        </View>

        {/* 4. Notifications Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Push Notifications</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>🔔 Notification System Demo</Text>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.notificationButton, notificationDemo && styles.activeNotificationButton]}
              onPress={handleNotificationDemo}
            >
              <Bell size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {notificationDemo ? 'Sending...' : 'Demo Notification'}
              </Text>
            </TouchableOpacity>

            <View style={styles.notificationStats}>
              <Text style={styles.statsTitle}>📊 Demo Stats:</Text>
              <Text style={styles.statsText}>Notifications sent: {notificationCount}</Text>
            </View>

            
          </View>
        </View>

        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6' 
  },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    backgroundColor: '#3B82F6', 
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4 
  },
  backButton: { 
    position: 'absolute',
    left: 20,
    top: 65,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 4,
    textAlign: 'center'
  },
  headerSubtitle: { 
    fontSize: 16, 
    color: '#FED7AA',
    textAlign: 'center'
  },
  content: { 
    flex: 1, 
    backgroundColor: '#F3F4F6' 
  },
  section: { 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 16, 
    marginTop: 16, 
    borderRadius: 16, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 3 
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    marginBottom: 16 
  },
  demoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  
  // Camera & Gallery Styles
  cameraGallerySection: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cameraButton: {
    backgroundColor: '#3B82F6',
  },
  galleryButton: {
    backgroundColor: '#10B981',
  },
  locationButton: {
    backgroundColor: '#F59E0B',
  },
  notificationButton: {
    backgroundColor: '#8B5CF6',
  },
  activeNotificationButton: {
    backgroundColor: '#6D28D9',
  },
  imagePreview: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  imageInfoText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Permission Styles
  permissionStatus: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  permissionLabel: {
    fontSize: 13,
    color: '#374151',
    width: 60,
  },
  permissionValue: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  
  // Location Styles
  locationDisplay: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  locationDetails: {
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#451A03',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  locationHistory: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  historyItem: {
    marginBottom: 4,
  },
  historyText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  
  // Vibration Styles
  vibrationControls: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  vibrationButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeVibrationButton: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  vibrationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  vibrationSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  vibrationInfo: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  
  // Notification Styles
  notificationStats: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  statsText: {
    fontSize: 16,
    color: '#6B7280',
  },
  notificationInfo: {
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  
  // Device Info Styles
  deviceInfoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  deviceInfoCard: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  deviceInfoTitle: {
    fontSize: 12,
    color: '#9A3412',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '500',
  },
  deviceInfoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Common Info Styles
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  
  // Clear All Button
  clearAllButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});