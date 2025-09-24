import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Home, Settings, User, Menu, ChevronRight } from 'lucide-react-native';

export default function NavigationPage() {
  const router = useRouter();
  
  // State for different navigation examples
  const [stackPages, setStackPages] = useState(['Home']);
  const [currentTab, setCurrentTab] = useState('Home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [userData, setUserData] = useState({ name: 'Soham Jain', age: 22 });

  // Stack Navigation Functions
  const pushPage = () => {
    const newPage = `Page ${stackPages.length + 1}`;
    setStackPages([...stackPages, newPage]);
  };

  const popPage = () => {
    if (stackPages.length > 1) {
      setStackPages(stackPages.slice(0, -1));
    }
  };

  // Drawer Navigation Functions
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen);
    setDrawerOpen(false);
  };

  // Data Passing Example
  const updateUserData = (newName: string) => {
    setUserData({ ...userData, name: newName });
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>React Native Navigation</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* 2. Stack Navigator Example */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Stack Navigator (Push & Pop)</Text>        
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Stack Navigation:</Text>
            <Text style={styles.currentPageText}>
              Current Page: {stackPages[stackPages.length - 1]}
            </Text>
            <Text style={styles.stackInfo}>
              Stack: {stackPages.join(' → ')}
            </Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.pushButton} onPress={pushPage}>
                <Text style={styles.buttonText}>Push New Page</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.popButton, stackPages.length === 1 && styles.disabledButton]} 
                onPress={popPage}
                disabled={stackPages.length === 1}
              >
                <Text style={styles.buttonText}> Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. Bottom Tabs Navigator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Bottom Tabs Navigator</Text>
          
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Tab Navigation:</Text>
            
            {/* Tab Content */}
            <View style={styles.tabContent}>
              {currentTab === 'Home' && (
                <View style={styles.tabScreen}>
                  <Home size={40} color="#3B82F6" />
                  <Text style={styles.tabScreenTitle}>Home Screen</Text>
                  <Text style={styles.tabScreenText}>Welcome to your home page!</Text>
                </View>
              )}
              {currentTab === 'Settings' && (
                <View style={styles.tabScreen}>
                  <Settings size={40} color="#10B981" />
                  <Text style={styles.tabScreenTitle}>Settings Screen</Text>
                  <Text style={styles.tabScreenText}>Adjust your app settings here</Text>
                </View>
              )}
              {currentTab === 'Profile' && (
                <View style={styles.tabScreen}>
                  <User size={40} color="#F59E0B" />
                  <Text style={styles.tabScreenTitle}>Profile Screen</Text>
                  <Text style={styles.tabScreenText}>View and edit your profile</Text>
                </View>
              )}
            </View>
            
            {/* Tab Bar */}
            <View style={styles.tabBar}>
              <TouchableOpacity 
                style={[styles.tabButton, currentTab === 'Home' && styles.activeTab]}
                onPress={() => setCurrentTab('Home')}
              >
                <Home size={20} color={currentTab === 'Home' ? '#3B82F6' : '#6B7280'} />
                <Text style={[styles.tabButtonText, currentTab === 'Home' && styles.activeTabText]}>
                  Home
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tabButton, currentTab === 'Settings' && styles.activeTab]}
                onPress={() => setCurrentTab('Settings')}
              >
                <Settings size={20} color={currentTab === 'Settings' ? '#3B82F6' : '#6B7280'} />
                <Text style={[styles.tabButtonText, currentTab === 'Settings' && styles.activeTabText]}>
                  Settings
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tabButton, currentTab === 'Profile' && styles.activeTab]}
                onPress={() => setCurrentTab('Profile')}
              >
                <User size={20} color={currentTab === 'Profile' ? '#3B82F6' : '#6B7280'} />
                <Text style={[styles.tabButtonText, currentTab === 'Profile' && styles.activeTabText]}>
                  Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. Drawer Navigator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Drawer Navigator</Text>
          
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Drawer Navigation:</Text>
            
            <View style={styles.drawerContainer}>
              {/* Main Screen Area */}
              <View style={styles.mainScreen}>
                <View style={styles.drawerHeader}>
                  <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
                    <Menu size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.drawerHeaderTitle}>{currentScreen}</Text>
                </View>
                
                <View style={styles.drawerContent}>
                  <Text style={styles.drawerScreenTitle}>Current Screen: {currentScreen}</Text>
                  <Text style={styles.drawerScreenText}>
                    Tap the menu button to open the drawer!
                  </Text>
                </View>
              </View>
              
              {/* Drawer Overlay */}
              {drawerOpen && (
                <View style={styles.drawerOverlay}>
                  <TouchableOpacity style={styles.drawerBackground} onPress={closeDrawer} />
                  <View style={styles.drawer}>
                    <Text style={styles.drawerTitle}>Navigation Menu</Text>
                    
                    <TouchableOpacity 
                      style={[styles.drawerItem, currentScreen === 'Dashboard' && styles.activeDrawerItem]}
                      onPress={() => navigateToScreen('Dashboard')}
                    >
                      <Home size={20} color={currentScreen === 'Dashboard' ? '#3B82F6' : '#6B7280'} />
                      <Text style={[styles.drawerItemText, currentScreen === 'Dashboard' && styles.activeDrawerItemText]}>
                        Dashboard
                      </Text>
                      <ChevronRight size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.drawerItem, currentScreen === 'Analytics' && styles.activeDrawerItem]}
                      onPress={() => navigateToScreen('Analytics')}
                    >
                      <Settings size={20} color={currentScreen === 'Analytics' ? '#3B82F6' : '#6B7280'} />
                      <Text style={[styles.drawerItemText, currentScreen === 'Analytics' && styles.activeDrawerItemText]}>
                        Analytics
                      </Text>
                      <ChevronRight size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.drawerItem, currentScreen === 'Account' && styles.activeDrawerItem]}
                      onPress={() => navigateToScreen('Account')}
                    >
                      <User size={20} color={currentScreen === 'Account' ? '#3B82F6' : '#6B7280'} />
                      <Text style={[styles.drawerItemText, currentScreen === 'Account' && styles.activeDrawerItemText]}>
                        Account
                      </Text>
                      <ChevronRight size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 5. Passing Data Between Screens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Passing Data Between Screens</Text>
          
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Data Passing:</Text>
            
            <View style={styles.dataPassingDemo}>
              <View style={styles.userInfoCard}>
                <Text style={styles.userInfoTitle}>Current User Data:</Text>
                <Text style={styles.userInfoText}>Name: {userData.name}</Text>
                <Text style={styles.userInfoText}>Age: {userData.age}</Text>
              </View>
              
              <Text style={styles.dataPassingLabel}>Update name</Text>
              <View style={styles.nameButtonsRow}>
                <TouchableOpacity 
                  style={styles.nameButton}
                  onPress={() => updateUserData('Soham Jain')}
                >
                  <Text style={styles.nameButtonText}>Soham Jain</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.nameButton}
                  onPress={() => updateUserData('Rohit Waghmare')}
                >
                  <Text style={styles.nameButtonText}>Rohit Waghmare</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.nameButton}
                  onPress={() => updateUserData('Megharaj Dandgavhal')}
                >
                  <Text style={styles.nameButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        

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
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    marginBottom: 4,
  },
  demoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  currentPageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 8,
  },
  stackInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pushButton: {
    flex: 1,
    backgroundColor: '#107bb9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  popButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minHeight: 120,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabScreen: {
    alignItems: 'center',
    padding: 20,
  },
  tabScreenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  tabScreenText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  activeTabText: {
    color: '#3B82F6',
  },
  drawerContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mainScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
  },
  menuButton: {
    marginRight: 12,
  },
  drawerHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerScreenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  drawerScreenText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  drawerBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: 250,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  activeDrawerItem: {
    backgroundColor: '#EFF6FF',
    borderRightWidth: 3,
    borderRightColor: '#3B82F6',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  activeDrawerItemText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  dataPassingDemo: {
    gap: 16,
  },
  userInfoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C4A6E',
    marginBottom: 8,
  },
  userInfoText: {
    fontSize: 14,
    color: '#0369A1',
    marginBottom: 4,
  },
  dataPassingLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  nameButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  nameButton: {
    flex: 1,
    backgroundColor: '#0b94f5ff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  nameButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tipContainer: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1F2937',
  },
});