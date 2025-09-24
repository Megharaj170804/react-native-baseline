import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Switch,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sun, Moon } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function StylingPage() {
  const router = useRouter();
  const windowDimensions = useWindowDimensions();
  
  // State for theme switching
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedExample, setSelectedExample] = useState('inline');

  // Theme colors
  const theme = {
    background: isDarkMode ? '#1F2937' : '#FFFFFF',
    cardBackground: isDarkMode ? '#374151' : '#F8FAFC',
    text: isDarkMode ? '#F9FAFB' : '#1F2937',
    subText: isDarkMode ? '#D1D5DB' : '#6B7280',
    accent: isDarkMode ? '#60A5FA' : '#3B82F6',
    border: isDarkMode ? '#4B5563' : '#E5E7EB',
  };

  // Check if device is tablet
  const isTablet = windowDimensions.width > 768;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.accent }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <ArrowLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>
        <Text style={styles.headerTitle}>React Native Styling</Text>
      </View>

      {/* Theme Toggle */}
      <View style={[styles.themeToggle, { backgroundColor: theme.cardBackground }]}>
        <Sun size={20} color={isDarkMode ? '#9CA3AF' : '#F59E0B'} />
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#D1D5DB', true: '#374151' }}
          thumbColor={isDarkMode ? '#60A5FA' : '#F3F4F6'}
        />
        <Moon size={20} color={isDarkMode ? '#60A5FA' : '#9CA3AF'} />
        <Text style={[styles.themeText, { color: theme.text }]}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 1. Inline Styles vs StyleSheet */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            1. Inline Styles vs StyleSheet
          </Text>
          
          {/* Inline Style Example */}
          <Text style={[styles.exampleLabel, { color: theme.subText }]}>Inline Styles:</Text>
          <View style={{
            backgroundColor: '#EF4444',
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
            alignItems: 'center'
          }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              This uses inline styles
            </Text>
          </View>

          {/* StyleSheet Example */}
          <Text style={[styles.exampleLabel, { color: theme.subText }]}>StyleSheet.create:</Text>
          <View style={styles.stylesheetBox}>
            <Text style={styles.stylesheetText}>
              This uses StyleSheet.create (better performance!)
            </Text>
          </View>
        </View>

        {/* 2. Flexbox Examples */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            2. Flexbox Layout Examples
          </Text>
          
          {/* Row Layout */}
          <Text style={[styles.exampleLabel, { color: theme.subText }]}>Row Layout (flexDirection: 'row'):</Text>
          <View style={styles.flexRow}>
            <View style={[styles.flexBox, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.flexBoxText}>1</Text>
            </View>
            <View style={[styles.flexBox, { backgroundColor: '#10B981' }]}>
              <Text style={styles.flexBoxText}>2</Text>
            </View>
            <View style={[styles.flexBox, { backgroundColor: '#F59E0B' }]}>
              <Text style={styles.flexBoxText}>3</Text>
            </View>
          </View>

          {/* Column Layout */}
          <Text style={[styles.exampleLabel, { color: theme.subText, marginTop: 16 }]}>
            Column Layout (flexDirection: 'column'):
          </Text>
          <View style={styles.flexColumn}>
            <View style={[styles.flexBox, { backgroundColor: '#EF4444', marginBottom: 8 }]}>
              <Text style={styles.flexBoxText}>Top</Text>
            </View>
            <View style={[styles.flexBox, { backgroundColor: '#8B5CF6', marginBottom: 8 }]}>
              <Text style={styles.flexBoxText}>Middle</Text>
            </View>
            <View style={[styles.flexBox, { backgroundColor: '#EC4899' }]}>
              <Text style={styles.flexBoxText}>Bottom</Text>
            </View>
          </View>

          {/* Justify Content Examples */}
          <Text style={[styles.exampleLabel, { color: theme.subText, marginTop: 16 }]}>
            justifyContent Examples:
          </Text>
          <View style={styles.justifyContainer}>
            <View style={styles.justifyRow}>
              <Text style={[styles.justifyLabel, { color: theme.text }]}>space-between:</Text>
              <View style={styles.justifyExample}>
                <View style={[styles.smallBox, { backgroundColor: '#06B6D4' }]} />
                <View style={[styles.smallBox, { backgroundColor: '#06B6D4' }]} />
                <View style={[styles.smallBox, { backgroundColor: '#06B6D4' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* 3. Dimensions & Responsive Design */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            3. Responsive Design
          </Text>
          
          <View style={[styles.deviceInfo, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.deviceText, { color: theme.text }]}>
              Screen Width: {windowDimensions.width.toFixed(0)}px
            </Text>
            <Text style={[styles.deviceText, { color: theme.text }]}>
              Screen Height: {windowDimensions.height.toFixed(0)}px
            </Text>
            <Text style={[styles.deviceText, { color: theme.text }]}>
              Device Type: {isTablet ? 'Tablet' : 'Phone'}
            </Text>
            <Text style={[styles.deviceText, { color: theme.text }]}>
              Orientation: {windowDimensions.width > windowDimensions.height ? 'Landscape' : 'Portrait'}
            </Text>
          </View>

          {/* Responsive Box */}
          <Text style={[styles.exampleLabel, { color: theme.subText }]}>
            Responsive Box (changes based on screen size):
          </Text>
          <View style={[
            styles.responsiveBox,
            {
              backgroundColor: isTablet ? '#10B981' : '#3B82F6',
              width: isTablet ? '80%' : '100%',
              height: isTablet ? 100 : 80,
            }
          ]}>
            <Text style={styles.responsiveText}>
              {isTablet ? 'Tablet Size Box' : 'Phone Size Box'}
            </Text>
          </View>
        </View>

        {/* 4. Platform-Specific Styling */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            4. Platform-Specific Styling
          </Text>
          
          <Text style={[styles.exampleLabel, { color: theme.subText }]}>
            Current Platform: {Platform.OS}
          </Text>
          
          <View style={[
            styles.platformBox,
            {
              backgroundColor: Platform.OS === 'ios' ? '#007AFF' : '#4CAF50',
              borderRadius: Platform.OS === 'ios' ? 16 : 8,
              ...(Platform.OS === 'ios' ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              } : {
                elevation: 6,
              }),
            }
          ]}>
            <Text style={styles.platformText}>
              {Platform.OS === 'ios' ? 'iOS Styled Box' : 'Android Styled Box'}
            </Text>
            <Text style={styles.platformSubtext}>
              {Platform.OS === 'ios' ? 'Rounded corners + Shadow' : 'Sharp corners + Elevation'}
            </Text>
          </View>

          {/* Platform Select Example */}
          <Text style={[styles.exampleLabel, { color: theme.subText, marginTop: 16 }]}>
            Platform.select() Example:
          </Text>
          <View style={[
            styles.selectBox,
            Platform.select({
              ios: {
                backgroundColor: '#FF9500',
                borderWidth: 0,
              },
              android: {
                backgroundColor: '#673AB7',
                borderWidth: 2,
                borderColor: '#9C27B0',
              },
            })
          ]}>
            <Text style={styles.selectText}>
              Platform.select() styling
            </Text>
          </View>
        </View>

     

      </ScrollView>
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
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
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
    marginBottom: 16,
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  stylesheetBox: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  stylesheetText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  flexColumn: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  flexBox: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  flexBoxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  justifyContainer: {
    marginTop: 8,
  },
  justifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  justifyLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 120,
  },
  justifyExample: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginLeft: 12,
  },
  smallBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  deviceInfo: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  deviceText: {
    fontSize: 14,
    marginBottom: 4,
  },
  responsiveBox: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  responsiveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  platformBox: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  platformText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  platformSubtext: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  selectBox: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeDemo: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  themeDemoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  themeDemoText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  themeDemoButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  themeDemoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tipContainer: {
    marginTop: 8,
  },
  tip: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
});