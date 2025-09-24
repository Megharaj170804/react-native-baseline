import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';

export default function FormsPage() {
  const router = useRouter();
  
  // Basic Form State
  const [basicForm, setBasicForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  // Validation Demo State
  const [validationForm, setValidationForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Advanced Form State
  const [advancedForm, setAdvancedForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    age: '',
  });
  
  // Form UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Refs for input navigation
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const ageRef = useRef<TextInput>(null);

  // Real-time validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!validateEmail(validationForm.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!validatePassword(validationForm.password)) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (validationForm.password !== validationForm.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return errors;
  };

  const handleBasicSubmit = () => {
    const { name, email, password } = basicForm;
    if (name && email && password) {
      Alert.alert('Success!', `Welcome ${name}! Form submitted successfully.`);
      setBasicForm({ name: '', email: '', password: '' });
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const handleValidationSubmit = () => {
    setSubmitted(true);
    const errors = validateForm();
    
    if (errors.length === 0) {
      Alert.alert('Success!', 'Form validation passed! Account created.');
      setValidationForm({ email: '', password: '', confirmPassword: '' });
      setSubmitted(false);
    } else {
      Alert.alert('Validation Error', errors.join('\n'));
    }
  };

  const handleAdvancedSubmit = () => {
    const { firstName, lastName, phone, age } = advancedForm;
    if (firstName && lastName && phone && age) {
      Alert.alert(
        'Profile Complete!', 
        `Name: ${firstName} ${lastName}\nPhone: ${phone}\nAge: ${age}`
      );
      setAdvancedForm({ firstName: '', lastName: '', phone: '', age: '' });
    } else {
      Alert.alert('Error', 'Please complete all fields');
    }
  };

  // Keyboard listeners
  React.useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forms & User Input</Text>
        <Text style={styles.headerSubtitle}>Interactive form handling!</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          
          {/* Keyboard Status Indicator */}
          {keyboardVisible && (
            <View style={styles.keyboardIndicator}>
              <Text style={styles.keyboardText}>⌨️ Keyboard is open</Text>
            </View>
          )}

          {/* 1. Basic Form Demo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Basic Form with TextInput</Text>
            
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>User Registration Form</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Full Name"
                    value={basicForm.name}
                    onChangeText={(text) => setBasicForm(prev => ({ ...prev, name: text }))}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    ref={emailRef}
                    style={styles.textInput}
                    placeholder="Email"
                    value={basicForm.email}
                    onChangeText={(text) => setBasicForm(prev => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    ref={passwordRef}
                    style={styles.textInput}
                    placeholder="Password"
                    value={basicForm.password}
                    onChangeText={(text) => setBasicForm(prev => ({ ...prev, password: text }))}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleBasicSubmit}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? 
                      <EyeOff size={20} color="#6B7280" /> : 
                      <Eye size={20} color="#6B7280" />
                    }
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleBasicSubmit}
                >
                  <Text style={styles.submitButtonText}>Create Account</Text>
                </TouchableOpacity>

                
              </View>
            </View>
          </View>

          {/* 2. Validation Demo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Real-time Form Validation</Text>
            
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Smart Validation System</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.textInput,
                      validationForm.email && !validateEmail(validationForm.email) && styles.inputError
                    ]}
                    placeholder="Email"
                    value={validationForm.email}
                    onChangeText={(text) => setValidationForm(prev => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  />
                  {validationForm.email && (
                    validateEmail(validationForm.email) ? 
                      <CheckCircle size={20} color="#10B981" style={styles.validationIcon} /> :
                      <XCircle size={20} color="#EF4444" style={styles.validationIcon} />
                  )}
                </View>
                
                {validationForm.email && !validateEmail(validationForm.email) && (
                  <Text style={styles.errorText}>Please enter a valid email address</Text>
                )}

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.textInput,
                      validationForm.password && !validatePassword(validationForm.password) && styles.inputError
                    ]}
                    placeholder="Password"
                    value={validationForm.password}
                    onChangeText={(text) => setValidationForm(prev => ({ ...prev, password: text }))}
                    secureTextEntry={!showPassword}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  />
                  {validationForm.password && (
                    validatePassword(validationForm.password) ? 
                      <CheckCircle size={20} color="#10B981" style={styles.validationIcon} /> :
                      <XCircle size={20} color="#EF4444" style={styles.validationIcon} />
                  )}
                </View>
                
                {validationForm.password && !validatePassword(validationForm.password) && (
                  <Text style={styles.errorText}>Password must be at least 6 characters</Text>
                )}

                <View style={styles.inputContainer}>
                  <TextInput
                    ref={confirmPasswordRef}
                    style={[
                      styles.textInput,
                      validationForm.confirmPassword && 
                      validationForm.password !== validationForm.confirmPassword && 
                      styles.inputError
                    ]}
                    placeholder="Confirm Password"
                    value={validationForm.confirmPassword}
                    onChangeText={(text) => setValidationForm(prev => ({ ...prev, confirmPassword: text }))}
                    secureTextEntry={!showConfirmPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleValidationSubmit}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? 
                      <EyeOff size={20} color="#6B7280" /> : 
                      <Eye size={20} color="#6B7280" />
                    }
                  </TouchableOpacity>
                  {validationForm.confirmPassword && validationForm.password && (
                    validationForm.password === validationForm.confirmPassword ? 
                      <CheckCircle size={20} color="#10B981" style={styles.validationIcon2} /> :
                      <XCircle size={20} color="#EF4444" style={styles.validationIcon2} />
                  )}
                </View>
                
                {validationForm.confirmPassword && 
                 validationForm.password !== validationForm.confirmPassword && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                <TouchableOpacity 
                  style={[
                    styles.submitButton,
                    validateForm().length > 0 && styles.disabledButton
                  ]}
                  onPress={handleValidationSubmit}
                  disabled={validateForm().length > 0}
                >
                  <Text style={[
                    styles.submitButtonText,
                    validateForm().length > 0 && styles.disabledButtonText
                  ]}>
                    {validateForm().length > 0 ? 'Fix Errors' : 'Submit Form ✓'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.validationStatus}>
                  <Text style={styles.validationTitle}>Validation Status:</Text>
                  <Text style={styles.validationInfo}>
                    Email: {validationForm.email ? (validateEmail(validationForm.email) ? '✓' : '○') : '....'}
                  </Text>
                  <Text style={styles.validationInfo}>
                    Password: {validationForm.password ? (validatePassword(validationForm.password) ? '✓' : '○') : '....'}
                  </Text>
                  <Text style={styles.validationInfo}>
                    Match: {validationForm.confirmPassword ? (validationForm.password === validationForm.confirmPassword ? '✓' : '○') : '...'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. Keyboard Handling Demo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Smart Keyboard Navigation</Text>
            
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>KeyboardAvoidingView Demo</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    value={advancedForm.firstName}
                    onChangeText={(text) => setAdvancedForm(prev => ({ ...prev, firstName: text }))}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    ref={lastNameRef}
                    style={styles.textInput}
                    placeholder="Last Name"
                    value={advancedForm.lastName}
                    onChangeText={(text) => setAdvancedForm(prev => ({ ...prev, lastName: text }))}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => phoneRef.current?.focus()}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.phoneIcon}></Text>
                  <TextInput
                    ref={phoneRef}
                    style={styles.textInput}
                    placeholder="Phone Number"
                    value={advancedForm.phone}
                    onChangeText={(text) => setAdvancedForm(prev => ({ ...prev, phone: text }))}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onSubmitEditing={() => ageRef.current?.focus()}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.phoneIcon}></Text>
                  <TextInput
                    ref={ageRef}
                    style={styles.textInput}
                    placeholder="Age"
                    value={advancedForm.age}
                    onChangeText={(text) => setAdvancedForm(prev => ({ ...prev, age: text }))}
                    keyboardType="numeric"
                    returnKeyType="done"
                    onSubmitEditing={handleAdvancedSubmit}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleAdvancedSubmit}
                >
                  <Text style={styles.submitButtonText}>Save Profile</Text>
                </TouchableOpacity>

                
              </View>
            </View>
          </View>

          {/* 4. Gesture Handling Demo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Gesture & Touch Interactions</Text>
            
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Touch & Gesture Examples</Text>
              
              <View style={styles.gestureContainer}>
                <TouchableOpacity 
                  style={styles.gestureButton}
                  onPress={() => Alert.alert('Tap!', 'Regular tap detected')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.gestureButtonText}>Tap Me</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.gestureButton2}
                  onLongPress={() => Alert.alert('Long Press!', 'Hold detected')}
                  delayLongPress={500}
                >
                  <Text style={styles.gestureButtonText}>Hold Me</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.gestureButton3}
                  onPressIn={() => console.log('Press started')}
                  onPressOut={() => console.log('Press ended')}
                  onPress={() => Alert.alert('Complex!', 'Multi-touch events')}
                >
                  <Text style={styles.gestureButtonText}>Multi-Touch</Text>
                </TouchableOpacity>
              </View>

              
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
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
    elevation: 4,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 65,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E9D5FF',
    textAlign: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardIndicator: {
    backgroundColor: '#059669',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  keyboardText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
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
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
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
  
  // Input Groups and Containers
  inputGroup: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    position: 'relative',
  },
  inputIcon: {
    marginRight: 12,
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  validationIcon: {
    position: 'absolute',
    right: 12,
  },
  validationIcon2: {
    position: 'absolute',
    right: 48,
  },
  
  // Buttons
  submitButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
  
  // Error and Info Text
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 32,
  },
  formInfo: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  
  // Validation Status
  validationStatus: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  validationInfo: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  
  // Keyboard Tips
  keyboardTips: {
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 4,
  },
  
  // Gesture Demo
  gestureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    gap: 12,
  },
  gestureButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gestureButton2: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gestureButton3: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gestureButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  gestureInfo: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  gestureInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  gestureInfoText: {
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 4,
  },
  
  // Legacy styles (keeping for compatibility)
  label: { 
    fontSize: 14, 
    color: '#374151' 
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
  },
  primaryBtn: {
    backgroundColor: '#06B6D4',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  primaryBtnText: { 
    color: 'white', 
    fontWeight: '600' 
  },
  secondaryBtn: {
    backgroundColor: '#6B7280',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  secondaryBtnText: { 
    color: 'white', 
    fontWeight: '600' 
  },
});