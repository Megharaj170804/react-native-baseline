import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Topic {
  id: string;
  title: string;
}

const topics: Topic[] = [
  
  {
    id: 'components',
    title: 'Core Components',
    
  },
  {
    id: 'styling',
    title: 'Styling',
    
  },
  {
    id: 'navigation',
    title: 'Navigation',
    
  },
  {
    id: 'state',
    title: 'State & Data Management',
  },
  {
    id: 'networking',
    title: 'Networking & APIs',
  },
  {
    id: 'forms',
    title: 'Forms & User Input',
  },
  {
    id: 'device',
    title: 'Device Features',
  },
  {
    id: 'media',
    title: 'Images, Media & UI',
  },
  
];

export default function HomeScreen() {
  const router = useRouter();

  const handleTopicPress = (topicId: string) => {
    // Route to individual topic pages instead of generic [id] route
    const routeMap: { [key: string]: string } = {
      
      'components': '/topic/components', 
      'styling': '/topic/styling',
      'navigation': '/topic/navigation',
      'state': '/topic/state',
      'networking': '/topic/networking',
      'forms': '/topic/forms',
      'device': '/topic/device',
      'media': '/topic/media',
    };
    
    const route = routeMap[topicId] || `/topic/${topicId}`;
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>React Native</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Learning Topics</Text>
        
        {topics.map((topic, index) => (
          <Pressable
            key={topic.id}
            style={({ pressed }) => [
              styles.topicCard,
              pressed && styles.topicCardPressed,
            ]}
            onPress={() => handleTopicPress(topic.id)}
          >
            <View style={[styles.colorIndicator]} />
            
            <View style={styles.topicContent}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  topicCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  colorIndicator: {
    width: 6,
    height: 40,
    borderRadius: 3,
    marginRight: 16,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});