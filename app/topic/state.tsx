import React, { useEffect, useMemo, useState, useContext, createContext, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, TextInput, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Minus, RefreshCw, Save, Trash2, Sun, Moon } from 'lucide-react-native';

// Create theme context for demonstration
const ThemeContext = createContext<{theme: 'light' | 'dark', toggleTheme: () => void}>({
  theme: 'light',
  toggleTheme: () => {},
});

export default function StatePage() {
  const router = useRouter();
  
  // State for different examples
  const [counter, setCounter] = useState(0);
  const [userName, setUserName] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Async state example
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{name: string, email: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Local storage example
  const [savedNote, setSavedNote] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [storageStatus, setStorageStatus] = useState('');
  
  // Advanced state example (simple store simulation)
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // useEffect examples
  useEffect(() => {
    console.log('Component mounted! Counter starts at:', counter);
  }, []); // Only run once

  useEffect(() => {
    console.log('Counter changed to:', counter);
  }, [counter]); // Run when counter changes

  // Theme context functions
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const themeContextValue = {
    theme: (isDarkTheme ? 'dark' : 'light') as 'light' | 'dark',
    toggleTheme,
  };

  // Async operation simulation
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    setUserData(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random success/failure
      if (Math.random() > 0.3) {
        setUserData({
          name: 'Megharaj',
          email: 'megharaj@gmail.com'
        });
      } else {
        throw new Error('Network error occurred');
      }
    } catch (err) {
      setError('Failed to load user data. Try again!');
    } finally {
      setLoading(false);
    }
  };

  // AsyncStorage simulation (in real app, use @react-native-async-storage/async-storage)
  const saveNote = () => {
    if (noteInput.trim()) {
      setSavedNote(noteInput);
      setStorageStatus(' Note saved successfully!');
      setTimeout(() => setStorageStatus(''), 2000);
    }
  };

  const loadNote = () => {
    if (savedNote) {
      setNoteInput(savedNote);
      setStorageStatus(' Note loaded from storage!');
      setTimeout(() => setStorageStatus(''), 2000);
    } else {
      setStorageStatus('No saved note found');
      setTimeout(() => setStorageStatus(''), 2000);
    }
  };

  const clearNote = () => {
    setSavedNote('');
    setNoteInput('');
    setStorageStatus('🗑️ Note cleared from storage');
    setTimeout(() => setStorageStatus(''), 2000);
  };

  // Todo management (advanced state example)
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        done: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>State & Data Management</Text>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. React Hooks</Text>
            
            
            {/* useState Example */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>useState</Text>
              <View style={styles.counterDisplay}>
                <Text style={styles.counterText}>Counter: {counter}</Text>
                
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.incrementButton} 
                  onPress={() => setCounter(counter + 1)}
                >
                  <Text style={styles.buttonText}>Add 1</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.decrementButton} 
                  onPress={() => setCounter(counter - 1)}
                >
                  <Text style={styles.buttonText}>Subtract 1</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.resetButton} 
                  onPress={() => setCounter(0)}
                >
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* useContext Example */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>useContext</Text>
              <ThemedComponent />
            </View>

            {/* useEffect Interactive Demo */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>useEffect </Text>
              <UseEffectDemo counter={counter} />
            </View>
          </View>

          {/* 2. Async State Updates (loading, errors) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Async State Updates</Text>
            
            
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Try Fetching User Data:</Text>
              
              <TouchableOpacity 
                style={styles.fetchButton} 
                onPress={fetchUserData}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Loading...' : 'Fetch User Data'}
                </Text>
              </TouchableOpacity>
              
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text style={styles.loadingText}>Fetching data from saved Data</Text>
                </View>
              )}
              
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              
              {userData && !loading && (
                <View style={styles.successContainer}>
                  <Text style={styles.successTitle}>Data Loaded Successfully!</Text>
                  <Text style={styles.userData}>Name: {userData.name}</Text>
                  <Text style={styles.userData}>Email: {userData.email}</Text>
                </View>
              )}
            </View>
          </View>

          {/* 3. AsyncStorage (Local Storage) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. AsyncStorage</Text>
            
            
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Local Storage:</Text>
              
              <TextInput
                style={styles.noteInput}
                value={noteInput}
                onChangeText={setNoteInput}
                placeholder="Write a note to save..."
                multiline
              />
              
              <View style={styles.storageButtonRow}>
                <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.loadButton} onPress={loadNote}>
                  <Text style={styles.buttonText}>Load</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.clearButton} onPress={clearNote}>
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
              </View>
              
              {storageStatus && (
                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>{storageStatus}</Text>
                </View>
              )}
              
              {savedNote && (
                <View style={styles.savedNoteContainer}>
                  <Text style={styles.savedNoteTitle}>Saved Note:</Text>
                  <Text style={styles.savedNoteText}>"{savedNote}"</Text>
                </View>
              )}
            </View>
          </View>

          {/* 4. Advanced State Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Advanced State Management</Text>
            
            
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Todo List State Management:</Text>
              
              <View style={styles.todoInputRow}>
                <TextInput
                  style={styles.todoInput}
                  value={newTodo}
                  onChangeText={setNewTodo}
                  placeholder="Add a new todo..."
                />
                <TouchableOpacity style={styles.addTodoButton} onPress={addTodo}>
                  <Plus size={20} color="white" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.todoStats}>
                <Text style={styles.todoStatsText}>
                  Total: {todos.length} | Done: {todos.filter(t => t.done).length} | 
                  Pending: {todos.filter(t => !t.done).length}
                </Text>
              </View>
              
              <View style={styles.todoList}>
                {todos.slice(0, 5).map(todo => (
                  <View key={todo.id} style={styles.todoItem}>
                    <TouchableOpacity 
                      style={styles.todoCheckbox}
                      onPress={() => toggleTodo(todo.id)}
                    >
                      <Text style={styles.todoCheckboxText}>
                        {todo.done ? '✓' : '○'}
                      </Text>
                    </TouchableOpacity>
                    
                    <Text style={[
                      styles.todoText, 
                      todo.done && styles.todoTextDone
                    ]}>
                      {todo.text}
                    </Text>
                    
                    <TouchableOpacity 
                      style={styles.deleteTodoButton}
                      onPress={() => deleteTodo(todo.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {todos.length > 5 && (
                  <Text style={styles.todoLimitText}>
                    Showing first 5 todos... ({todos.length} total)
                  </Text>
                )}
                
              </View>
            </View>
          </View>

    

        </ScrollView>
      </View>
    </ThemeContext.Provider>
  );
}

// Helper component for useContext demonstration
function ThemedComponent() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <View style={[
      styles.themedBox, 
      { backgroundColor: theme === 'dark' ? '#1F2937' : '#F8FAFC' }
    ]}>
      <View style={styles.themeToggleRow}>
        <Sun size={20} color={theme === 'light' ? '#F59E0B' : '#9CA3AF'} />
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#D1D5DB', true: '#374151' }}
          thumbColor={theme === 'dark' ? '#60A5FA' : '#F3F4F6'}
        />
        <Moon size={20} color={theme === 'dark' ? '#60A5FA' : '#9CA3AF'} />
      </View>
      
      <Text style={[
        styles.themeText,
        { color: theme === 'dark' ? '#F9FAFB' : '#1F2937' }
      ]}>
        Current theme: {theme}
      </Text>
    </View>
  );
}

// Helper component for useEffect demonstration
function UseEffectDemo({ counter }: { counter: number }) {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [effectLog, setEffectLog] = useState<string[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

 
  // Example 3: Timer effect with cleanup
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      
      const timerMessage = `Timer started at ${new Date().toLocaleTimeString()}`;
      setEffectLog(prev => [...prev.slice(-4), timerMessage]);
    } else if (interval) {
      clearInterval(interval);
      const stopMessage = `Timer stopped at ${new Date().toLocaleTimeString()}`;
      setEffectLog(prev => [...prev.slice(-4), stopMessage]);
    }

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]); // Runs when isRunning changes

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsRunning(false);
  };

  const clearLog = () => {
    setEffectLog([]);
  };

  return (
    <View style={styles.useEffectContainer}>
      {/* Timer Demo */}
      <View style={styles.timerSection}>
        <Text style={styles.timerTitle}>Timer with useEffect:</Text>
        <Text style={styles.timerDisplay}>{timer}s</Text>
        
        <View style={styles.timerButtons}>
          <TouchableOpacity 
            style={[styles.timerButton, isRunning && styles.stopButton]}
            onPress={toggleTimer}
          >
            <Text style={styles.buttonText}>
              {isRunning ? 'Stop' : 'Start'} Timer
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resetTimerButton}
            onPress={resetTimer}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 60 : 40,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
    marginBottom: 16,
  },
  demoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  counterDisplay: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  counterSubtext: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  incrementButton: {
    flex: 1,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  decrementButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  themedBox: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 12,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  themeSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
  fetchButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#0369A1',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803D',
    marginBottom: 8,
    textAlign: 'center',
  },
  userData: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 4,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  storageButtonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  loadButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  statusContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 14,
    color: '#065F46',
    textAlign: 'center',
    fontWeight: '600',
  },
  savedNoteContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  savedNoteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
  },
  savedNoteText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  todoInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  todoInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addTodoButton: {
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 48,
  },
  todoStats: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  todoStatsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  todoList: {
    gap: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  todoCheckbox: {
    minWidth: 32,
    alignItems: 'center',
  },
  todoCheckboxText: {
    fontSize: 20,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  todoTextDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteTodoButton: {
    padding: 8,
  },
  emptyTodoText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  todoLimitText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  tipContainer: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1F2937',
  },
  
  // UseEffect Demo Styles
  useEffectContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  timerDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  resetTimerButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logSection: {
    marginBottom: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearLogButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearLogText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  logContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    maxHeight: 120,
  },
  emptyLogText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  logMessage: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  effectExplanation: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 2,
    lineHeight: 18,
  },
});