import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Platform, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw, Wifi, WifiOff, Download, Upload, CheckCircle, XCircle } from 'lucide-react-native';

// Mock API data
const MOCK_USERS = [
  { id: 1, name: 'Abhay Kalshetti', email: 'abhay@email.com', city: 'Solapur' },
  { id: 2, name: 'Aishwarya Kalsheti', email: 'aishwarya@email.com', city: 'Solapur' },
  { id: 3, name: 'Samruddhi Gore', email: 'samruddhi@email.com', city: 'Pune' },
  { id: 4, name: 'Soham Kale', email: 'soham@email.com', city: 'Sambhajinagar' },
  { id: 5, name: 'Megharaj Dandgavhal', email: 'megharaj@email.com', city: 'Jalgaon' },
];

const MOCK_POSTS = [
  { id: 1, title: 'COLLAGE LIFE', body: 'COLLAGE LIFE is fun!' },
  { id: 2, title: 'SCHOOL LIFE', body: 'SCHOOL LIFE is fun!' },
  { id: 3, title: 'CORPORATE LIFE', body: 'Always expect things to go wrong!' },
  { id: 4, title: 'DREAMS', body: 'Show us what happening...' },
];

export default function NetworkingPage() {
  const router = useRouter();
  
  // Fetch API Demo State
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [users, setUsers] = useState<typeof MOCK_USERS>([]);
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);
  
  // JSON Handling Demo State
  const [jsonInput, setJsonInput] = useState('{"name": "Megharaj", "age": 21, "city": "Jalgaon", "hobbies": ["coding", "music", "gaming"], "isStudent": false}');
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  // FlatList Demo State
  const [posts, setPosts] = useState<typeof MOCK_POSTS>([]);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  
  // Retry Logic Demo State
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [retryStatus, setRetryStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  const [retryMessage, setRetryMessage] = useState('');

  // Simulate API fetch with realistic delay and random failures
  const simulateFetch = useCallback(async (shouldFail = false) => {
    setFetchLoading(true);
    setFetchError(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    // Random failure simulation (25% chance)
    if (shouldFail || Math.random() < 0.25) {
      throw new Error('Network error: Unable to fetch users');
    }
    
    return MOCK_USERS;
  }, []);

  const handleFetchUsers = async () => {
    try {
      const userData = await simulateFetch();
      setUsers(userData);
      setLastFetchTime(new Date().toLocaleTimeString());
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Unknown error');
      setUsers([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleJsonParse = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
    } catch (error) {
      setJsonError('Invalid JSON format');
      setParsedJson(null);
    }
  };

  const loadPosts = () => {
    setPosts(MOCK_POSTS);
    Alert.alert('Success', 'Posts loaded successfully!');
  };

  const selectPost = (postId: number) => {
    setSelectedPost(selectedPost === postId ? null : postId);
  };

  const retryOperation = async () => {
    setRetryStatus('loading');
    setRetryAttempts(0);
    setRetryMessage('Starting operation...');
    
    const maxAttempts = 3;
    let currentAttempt = 0;
    
    while (currentAttempt < maxAttempts) {
      currentAttempt++;
      setRetryAttempts(currentAttempt);
      setRetryMessage(`Attempt ${currentAttempt} of ${maxAttempts}...`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 60% chance of failure on each attempt
      if (Math.random() > 0.6) {
        setRetryStatus('success');
        setRetryMessage(`Success on attempt ${currentAttempt}!`);
        return;
      } else if (currentAttempt < maxAttempts) {
        setRetryMessage(`Attempt ${currentAttempt} failed, retrying...`);
      }
    }
    
    setRetryStatus('failed');
    setRetryMessage(`All ${maxAttempts} attempts failed`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Networking & APIs</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        
        {/* 1. Fetch API Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Fetching Data from APIs</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>REST API with fetch()</Text>
            
            <View style={styles.fetchControls}>
              <TouchableOpacity 
                style={[styles.fetchButton, fetchLoading && styles.buttonDisabled]}
                onPress={handleFetchUsers}
                disabled={fetchLoading}
              >
                {fetchLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Download size={18} color="#FFFFFF" />
                )}
                <Text style={styles.buttonText}>
                  {fetchLoading ? 'Fetching...' : 'Fetch Users'}
                </Text>
              </TouchableOpacity>
              
              
            </View>

            

            {users.length > 0 && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>
                  Loaded {users.length} users successfully!
                </Text>
                
              </View>
            )}
          </View>
        </View>

        {/* 2. JSON Handling Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Handling JSON Data</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Parse & Validate JSON</Text>
            
            <Text style={styles.inputLabel}>Try editing this JSON:</Text>
            <TextInput
              style={styles.jsonInput}
              value={jsonInput}
              onChangeText={setJsonInput}
              multiline
              placeholder="Enter JSON here..."
              placeholderTextColor="#9CA3AF"
            />
            
            <TouchableOpacity style={styles.parseButton} onPress={handleJsonParse}>
              <Text style={styles.buttonText}>Parse JSON</Text>
            </TouchableOpacity>

            {jsonError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{jsonError}</Text>
              </View>
            )}

            {parsedJson && (
              <View style={styles.jsonResult}>
                <Text style={styles.resultTitle}>Parsed Successfully:</Text>
                <View style={styles.jsonDisplay}>
                  <Text style={styles.jsonText}>
                    {JSON.stringify(parsedJson, null, 2)}
                  </Text>
                </View>
                <Text style={styles.jsonInfo}>
                  Type: {Array.isArray(parsedJson) ? 'Array' : typeof parsedJson} | 
                  Keys: {typeof parsedJson === 'object' ? Object.keys(parsedJson).length : 'N/A'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 3. FlatList Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Displaying Data in Lists</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>FlatList Performance</Text>
            
            <TouchableOpacity style={styles.loadButton} onPress={loadPosts}>
              <Upload size={18} color="#FFFFFF" />
              <Text style={styles.buttonText}>Load Posts</Text>
            </TouchableOpacity>

            {posts.length > 0 && (
              <View style={styles.flatListContainer}>
                <Text style={styles.listTitle}>
                  {posts.length} Posts:
                </Text>
                
                <FlatList
                  data={posts}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.postItem, 
                        selectedPost === item.id && styles.postItemSelected
                      ]}
                      onPress={() => selectPost(item.id)}
                    >
                      <Text style={styles.postTitle}>
                        {item.id}. {item.title}
                      </Text>
                      {selectedPost === item.id && (
                        <Text style={styles.postBody}>{item.body}</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  scrollEnabled={false}
                  nestedScrollEnabled={true}
                />
                
                
              </View>
            )}
          </View>
        </View>

        {/* 4. Error Handling & Retry Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Error Handling & Retry Logic</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Smart Retry System</Text>
            
            <TouchableOpacity 
              style={[
                styles.retryDemoButton,
                retryStatus === 'loading' && styles.buttonDisabled
              ]}
              onPress={retryOperation}
              disabled={retryStatus === 'loading'}
            >
              
              <Text style={styles.buttonText}>
                {retryStatus === 'loading' ? 'Retrying...' : 'Start Operation'}
              </Text>
            </TouchableOpacity>

            {retryAttempts > 0 && (
              <View style={styles.retryStatus}>
                <Text style={styles.retryAttemptsText}>
                  Attempts: {retryAttempts}/3
                </Text>
                
                <View style={styles.retryProgress}>
                  {[1, 2, 3].map(attempt => (
                    <View 
                      key={attempt}
                      style={[
                        styles.retryDot,
                        attempt <= retryAttempts && styles.retryDotActive,
                        attempt <= retryAttempts && retryStatus === 'failed' && styles.retryDotFailed,
                        attempt <= retryAttempts && retryStatus === 'success' && styles.retryDotSuccess,
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}

            {retryMessage && (
              <View style={[
                styles.retryMessageContainer,
                retryStatus === 'success' && styles.successMessage,
                retryStatus === 'failed' && styles.failedMessage,
              ]}>
                <Text style={styles.retryMessageText}>{retryMessage}</Text>
              </View>
            )}
          </View>
        </View>

        {/* User Data Display */}
        {users.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Fetched User Data</Text>
            
            <FlatList
              data={users.slice(0, 3)} // Limit to prevent nesting issues
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <View style={styles.userCard}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                  <Text style={styles.userCity}>{item.city}</Text>
                </View>
              )}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
            
            {users.length > 3 && (
              <Text style={styles.moreUsersText}>
                ... and {users.length - 3} more users
              </Text>
            )}
          </View>
        )}

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
    color: '#DBEAFE',
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
    marginBottom: 12,
  },
  
  // Fetch Controls
  fetchControls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fetchButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  errorButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Status Containers
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#DC2626',
    flex: 1,
    fontSize: 14,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  retryText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  successText: {
    color: '#059669',
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  timestampText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  
  // JSON Input
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  jsonInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  parseButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  jsonResult: {
    marginTop: 12,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  jsonDisplay: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  jsonText: {
    color: '#F9FAFB',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  jsonInfo: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  
  // FlatList Demo
  loadButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  flatListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  postItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  postItemSelected: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  postBody: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 18,
  },
  flatListInfo: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Retry Demo
  retryDemoButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  retryStatus: {
    alignItems: 'center',
    marginBottom: 12,
  },
  retryAttemptsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  retryProgress: {
    flexDirection: 'row',
    gap: 8,
  },
  retryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  retryDotActive: {
    backgroundColor: '#F59E0B',
  },
  retryDotFailed: {
    backgroundColor: '#EF4444',
  },
  retryDotSuccess: {
    backgroundColor: '#10B981',
  },
  retryMessageContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  successMessage: {
    backgroundColor: '#F0FDF4',
    borderLeftColor: '#10B981',
  },
  failedMessage: {
    backgroundColor: '#FEF2F2',
    borderLeftColor: '#EF4444',
  },
  retryMessageText: {
    fontSize: 14,
    color: '#374151',
  },
  
  // User Cards
  userCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  userCity: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  moreUsersText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});