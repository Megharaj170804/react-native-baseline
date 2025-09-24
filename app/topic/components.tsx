import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Star, ThumbsUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ComponentsPage() {
  const router = useRouter();
  
  // State for examples
  const [inputText, setInputText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Sample data for lists
  const fruits = [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Banana' },
    { id: '3', name: 'Orange' },
    { id: '4', name: 'Grapes' },
  ];

  // Functions for interactions
  const handleLike = () => {
    setLikeCount(likeCount + 1);
    Alert.alert('Liked!', `You have ${likeCount + 1} likes!`);
  };

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Complete!', 'Loading finished successfully!');
    }, 3000);
  };

  const handleSwitchToggle = () => {
    setIsEnabled(!isEnabled);
    Alert.alert('Switch Changed', `Notifications are now ${!isEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>React Native Core Components</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* View and Text Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>View and Text Components</Text>
          
          <View style={styles.exampleBox}>
            <Text style={styles.titleText}>Hello Megharaj</Text>
          </View>
        </View>

        {/* Image Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Image Component</Text>
          
          <View style={styles.exampleBox}>
            <Image
              source={{ 
                uri: 'https://media.licdn.com/dms/image/v2/D5622AQEk2h5zXwfoCQ/feedshare-shrink_800/B56ZhNMm1dHMAg-/0/1753641810977?e=2147483647&v=beta&t=RmNYzhvFaoj6iopNAt552O5fEiivhfA4npG2R30WZWk' 
              }}
              style={styles.exampleImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Simple List (instead of FlatList) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Simple List</Text>
          
          <View style={styles.exampleBox}>
            <Text style={styles.listHeader}>Fruit List:</Text>
            {fruits.map((fruit) => (
              <View key={fruit.id} style={styles.listItem}>
                <Text style={styles.listItemText}>{fruit.name}</Text>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => Alert.alert('Selected!', `You chose ${fruit.name}`)}
                >
                  <Text style={styles.selectButtonText}>Select</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Button Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Button Component</Text>
          
          <View style={styles.exampleBox}>
            <Button
              title="Press This Button"
              onPress={() => Alert.alert('Button Pressed!', 'The button was clicked successfully!')}
              color="#2563EB"
            />
          </View>
        </View>

        {/* TouchableOpacity Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TouchableOpacity Component</Text>
          
          <View style={styles.exampleBox}>
            <TouchableOpacity style={styles.customButton} onPress={handleLike}>
              <Heart size={20} color="#FFFFFF" />
              <Text style={styles.customButtonText}>Like ({likeCount})</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TextInput Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TextInput Component</Text>
          
          <View style={styles.exampleBox}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type something here..."
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.inputFeedback}>
              <Text style={styles.feedbackText}>
                You typed: {inputText || 'Nothing yet'}
              </Text>
              <Text style={styles.feedbackText}>
                Character count: {inputText.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Switch Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Switch Component</Text>
          
          <View style={styles.exampleBox}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Enable Notifications</Text>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor={isEnabled ? '#FFFFFF' : '#F3F4F6'}
                value={isEnabled}
                onValueChange={handleSwitchToggle}
              />
            </View>
            <Text style={styles.switchStatus}>
              Status: {isEnabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>

        {/* ActivityIndicator Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ActivityIndicator Component</Text>
          
          <View style={styles.exampleBox}>
            <TouchableOpacity 
              style={[styles.loadingButton, isLoading && styles.loadingButtonDisabled]}
              onPress={startLoading}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loadingButtonText}>Start 3 Second Loading</Text>
              )}
            </TouchableOpacity>
            
            {isLoading && (
              <View style={styles.loadingInfo}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Please wait, loading in progress...</Text>
              </View>
            )}
          </View>
        </View>

        {/* Pressable Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pressable Component</Text>
          
          <View style={styles.exampleBox}>
            <Pressable
              style={({ pressed }) => [
                styles.pressableButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={() => Alert.alert('Pressable!', 'This is a Pressable component!')}
            >
              <Text style={styles.pressableButtonText}>Press and Hold Me</Text>
            </Pressable>
          </View>
        </View>

        

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 65,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#DBEAFE',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  exampleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D4ED8',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  exampleImage: {
    width: width - 100,
    height: 120,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  listHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  listItemText: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  customButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  customButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  inputFeedback: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  switchStatus: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  loadingButton: {
    backgroundColor: '#059669',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loadingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingInfo: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  pressableButton: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  pressableButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statCard: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    minWidth: 70,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});