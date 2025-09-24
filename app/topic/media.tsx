import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Sparkles, Camera, Download, RefreshCw } from 'lucide-react-native';

// Mock image URLs for demo
const SAMPLE_IMAGES = [
  'https://i.pinimg.com/736x/0c/c5/e2/0cc5e2a8fd8d7cd62089a8efa15d9713.jpg',
  'https://i.pinimg.com/736x/0c/c5/e2/0cc5e2a8fd8d7cd62089a8efa15d9713.jpg',
];

export default function MediaPage() {
  const router = useRouter();
  
  // Image loading states
  const [imageStates, setImageStates] = useState<{[key: string]: 'loading' | 'loaded' | 'error'}>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cacheDemo, setCacheDemo] = useState(false);
  
  // Animation states
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [bounceActive, setBounceActive] = useState(true);
  const [rotationActive, setRotationActive] = useState(false);
  const [scaleActive, setScaleActive] = useState(false);
  
  // Video states
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoStatus, setVideoStatus] = useState<any>({});
  const videoRef = useRef<Video>(null);
  
  // Animated values
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Complex animation sequence
  const [complexAnimActive, setComplexAnimActive] = useState(false);

  const handleImageLoad = (imageUrl: string) => {
    setImageStates(prev => ({ ...prev, [imageUrl]: 'loaded' }));
  };

  const handleImageError = (imageUrl: string) => {
    setImageStates(prev => ({ ...prev, [imageUrl]: 'error' }));
  };

  const handleImageLoadStart = (imageUrl: string) => {
    setImageStates(prev => ({ ...prev, [imageUrl]: 'loading' }));
  };

  const clearImageCache = () => {
    setCacheDemo(true);
    setImageStates({});
    // Simulate cache clearing
    setTimeout(() => {
      setCacheDemo(false);
      Alert.alert('Cache Cleared', 'Image cache has been cleared. Images will reload.');
    }, 1000);
  };

  // Video control functions
  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoRestart = async () => {
    if (videoRef.current) {
      await videoRef.current.replayAsync();
      setIsPlaying(true);
    }
  };

  const handleVideoStatusUpdate = (status: any) => {
    setVideoStatus(status);
    setIsPlaying(status.isPlaying);
  };

  // Animation functions
  const startBounceAnimation = () => {
    setBounceActive(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -30, duration: 500, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 0, useNativeDriver: true, tension: 100 }),
      ])
    ).start();
  };

  const stopBounceAnimation = () => {
    setBounceActive(false);
    bounceAnim.stopAnimation();
    Animated.timing(bounceAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const startRotationAnimation = () => {
    setRotationActive(true);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotationAnimation = () => {
    setRotationActive(false);
    rotateAnim.stopAnimation();
    Animated.timing(rotateAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const startScaleAnimation = () => {
    setScaleActive(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.5, duration: 800, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopScaleAnimation = () => {
    setScaleActive(false);
    scaleAnim.stopAnimation();
    Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const startComplexAnimation = () => {
    setComplexAnimActive(true);
    
    // Sequence of multiple animations
    Animated.sequence([
      // Fade out
      Animated.timing(fadeAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
      // Slide and scale simultaneously
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 100, duration: 1000, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 0.5, useNativeDriver: true }),
      ]),
      // Reset with spring
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setComplexAnimActive(false);
    });
  };

  // Auto-start bounce animation
  useEffect(() => {
    startBounceAnimation();
  }, []);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Images, Media & UI</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        
        {/* 1. Image Loading Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Loading Local & Remote Images</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Image Loading Gallery</Text>
            
            <View style={styles.imageGrid}>
              {SAMPLE_IMAGES.map((imageUrl, index) => (
                <View key={index} style={styles.imageContainer}>
                  <TouchableOpacity 
                    onPress={() => setSelectedImage(selectedImage === imageUrl ? null : imageUrl)}
                    style={[styles.imageWrapper, selectedImage === imageUrl && styles.selectedImage]}
                  >
                    
                    
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.galleryImage}
                      onLoadStart={() => handleImageLoadStart(imageUrl)}
                      onLoad={() => handleImageLoad(imageUrl)}
                      onError={() => handleImageError(imageUrl)}
                      resizeMode="cover"
                    />
                    
                    {imageStates[imageUrl] === 'error' && (
                      <View style={styles.imageError}>
                        <Text style={styles.errorText}>Failed to load</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  
                  <View style={styles.imageStatus}>
                    <Text style={styles.statusText}>
                      Status: {imageStates[imageUrl] || 'not loaded'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {selectedImage && (
              <View style={styles.selectedImageView}>
                <Text style={styles.selectedTitle}>🔍 Selected Image:</Text>
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.selectedImageLarge}
                  resizeMode="cover"
                />
              </View>
            )}

            <TouchableOpacity style={styles.actionButton} onPress={clearImageCache}>
              <RefreshCw size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {cacheDemo ? 'Clearing...' : 'Clear Cache'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Image Caching Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Image Caching System</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Caching Performance Demo</Text>
            
            <View style={styles.cachingDemo}>
              <View style={styles.cacheCard}>
                <Text style={styles.cacheTitle}>Local Images</Text>
                <Text style={styles.cacheDescription}>
                  Bundled with app, instant loading
                </Text>
                <View style={styles.localImageExample}>
                  <View style={styles.placeholderImage}>
                    <Camera size={32} color="#6B7280" />
                    <Text style={styles.placeholderText}>App Icon</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cacheCard}>
                <Text style={styles.cacheTitle}>Remote Images</Text>
                <Text style={styles.cacheDescription}>
                  Cached after first load, faster subsequent loads
                </Text>
                <View style={styles.cacheMetrics}>
                  <Text style={styles.metricText}>First load: ~1-3s</Text>
                  <Text style={styles.metricText}>Cached load: ~0..5s</Text>
                </View>
              </View>
            </View>

             
          </View>
        </View>

        {/* 3. Video Playback Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Video Playback</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Video Player Demo</Text>
            
            <View style={styles.videoDemo}>
              <Video
                ref={videoRef}
                style={styles.video}
                source={{
                  uri: 'https://vfss.b-cdn.net/library/4/4K-Full-Screen-Tony-Stark-Whatsapp-Status-Video/4K-Full-Screen-Tony-Stark-Whatsapp-Whatsapp-Status-Video-0.mp4'
                }}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                onPlaybackStatusUpdate={handleVideoStatusUpdate}
                shouldPlay={false}
              />
              
              <View style={styles.videoOverlay}>
                <Text style={styles.videoText}>Tony Stark 4K Video</Text>
                <Text style={styles.videoSubtext}>
                  Status: {videoStatus.isLoaded ? (isPlaying ? 'Playing' : 'Paused') : 'Loading...'}
                </Text>
                {videoStatus.isLoaded && (
                  <Text style={styles.videoDuration}>
                    {Math.floor((videoStatus.positionMillis || 0) / 1000)}s / {Math.floor((videoStatus.durationMillis || 0) / 1000)}s
                  </Text>
                )}
              </View>
              
              <View style={styles.videoControls}>
                <TouchableOpacity 
                  style={styles.videoButton}
                  onPress={handlePlayPause}
                  disabled={!videoStatus.isLoaded}
                >
                  {isPlaying ? <Pause size={20} color="#FFFFFF" /> : <Play size={20} color="#FFFFFF" />}
                  <Text style={styles.videoButtonText}>
                    {isPlaying ? 'Pause' : 'Play'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.videoButton}
                  onPress={handleVideoRestart}
                  disabled={!videoStatus.isLoaded}
                >
                  <RotateCcw size={20} color="#FFFFFF" />
                  <Text style={styles.videoButtonText}>Restart</Text>
                </TouchableOpacity>
              </View>


            </View>
          </View>
        </View>

        {/* 4. Animated API Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Animated API Basics</Text>
          
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>⚡ React Native Animations</Text>
            
            <View style={styles.animationPlayground}>
              {/* Bounce Animation */}
              <View style={styles.animationItem}>
                <View style={styles.animationContainer}>
                  <Animated.View 
                    style={[
                      styles.animatedBox,
                      styles.bounceBox,
                      { transform: [{ translateY: bounceAnim }] }
                    ]}
                  >
                    <Zap size={24} color="#FFFFFF" />
                  </Animated.View>
                </View>
                <View style={styles.animationControls}>
                  <TouchableOpacity 
                    style={bounceActive ? styles.stopButton : styles.playButton}
                    onPress={bounceActive ? stopBounceAnimation : startBounceAnimation}
                  >
                    <Text style={styles.controlButtonText}>
                      {bounceActive ? 'Stop' : 'Bounce'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Rotation Animation */}
              <View style={styles.animationItem}>
                <View style={styles.animationContainer}>
                  <Animated.View 
                    style={[
                      styles.animatedBox,
                      styles.rotateBox,
                      { transform: [{ rotate: rotateInterpolation }] }
                    ]}
                  >
                    <RefreshCw size={24} color="#FFFFFF" />
                  </Animated.View>
                </View>
                <View style={styles.animationControls}>
                  <TouchableOpacity 
                    style={rotationActive ? styles.stopButton : styles.playButton}
                    onPress={rotationActive ? stopRotationAnimation : startRotationAnimation}
                  >
                    <Text style={styles.controlButtonText}>
                      {rotationActive ? 'Stop' : 'Rotate'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Scale Animation */}
              <View style={styles.animationItem}>
                <View style={styles.animationContainer}>
                  <Animated.View 
                    style={[
                      styles.animatedBox,
                      styles.scaleBox,
                      { transform: [{ scale: scaleAnim }] }
                    ]}
                  >
                    <Sparkles size={24} color="#FFFFFF" />
                  </Animated.View>
                </View>
                <View style={styles.animationControls}>
                  <TouchableOpacity 
                    style={scaleActive ? styles.stopButton : styles.playButton}
                    onPress={scaleActive ? stopScaleAnimation : startScaleAnimation}
                  >
                    <Text style={styles.controlButtonText}>
                      {scaleActive ? 'Stop' : 'Scale'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.complexButton, complexAnimActive && styles.disabledButton]}
              onPress={startComplexAnimation}
              disabled={complexAnimActive}
            >
              <Text style={styles.complexButtonText}>
                {complexAnimActive ? 'Running Complex Animation...' : 'Run Complex Animation'}
              </Text>
            </TouchableOpacity>

            {/* Complex Animation Target */}
            <View style={styles.complexAnimationArea}>
              <Animated.View 
                style={[
                  styles.complexAnimatedBox,
                  { 
                    opacity: fadeAnim,
                    transform: [
                      { translateX: slideAnim },
                      { scale: scaleAnim }
                    ] 
                  }
                ]}
              >
                <Text style={styles.complexAnimText}>🎭</Text>
              </Animated.View>
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
    color: '#FCE7F3',
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
  
  // Image Gallery Styles
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    flex: 1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImage: {
    borderColor: '#EC4899',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imageError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    textAlign: 'center',
  },
  imageStatus: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedImageView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  selectedImageLarge: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedUrl: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actionButton: {
    backgroundColor: '#EC4899',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Caching Demo Styles
  cachingDemo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cacheCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cacheTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  cacheDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  localImageExample: {
    alignItems: 'center',
  },
  placeholderImage: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  placeholderText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  cacheMetrics: {
    alignItems: 'center',
  },
  metricText: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 2,
  },
  cachingTips: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
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
  
  // Video Demo Styles
  videoDemo: {
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#000000',
  },
  videoOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  videoDuration: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  videoPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  videoSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  videoControls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  videoButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  videoInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  videoInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 8,
  },
  videoInfoText: {
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 4,
  },
  
  // Animation Playground Styles
  animationPlayground: {
    marginBottom: 16,
  },
  animationItem: {
    marginBottom: 16,
  },
  animationContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  animatedBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bounceBox: {
    backgroundColor: '#10B981',
  },
  rotateBox: {
    backgroundColor: '#3B82F6',
  },
  scaleBox: {
    backgroundColor: '#F59E0B',
  },
  animationControls: {
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  complexButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  complexButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  complexAnimationArea: {
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  complexAnimatedBox: {
    width: 50,
    height: 50,
    backgroundColor: '#EC4899',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  complexAnimText: {
    fontSize: 24,
  },
  
  // Advanced Animations Styles
  advancedAnimations: {
    gap: 16,
    marginBottom: 16,
  },
  reanimatedCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  lottieCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 12,
  },
  featureText: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  installButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  installButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  animationComparison: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  comparisonTable: {
    gap: 8,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  comparisonValue: {
    fontSize: 14,
    color: '#6B7280',
  },
});