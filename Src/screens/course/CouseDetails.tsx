import React, { useState, useEffect, useRef } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    StatusBar,
    Alert,
    StyleProp, ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width, height } = Dimensions.get('window');

const CourseDetailsScreen = () => {
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
    const [enrolled, setEnrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Animation values
    const scrollY = useRef(new Animated.Value(0)).current;
    const slideInAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const buttonScaleAnim = useRef(new Animated.Value(1)).current;

    // Mock course data
    const courseData = {
        id: 1,
        title: 'Complete React Native Development',
        instructor: 'John Smith',
        instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 4.8,
        ratingCount: 2340,
        price: '$99.99',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
        duration: '45 hours',
        students: '12,500',
        description: 'Master React Native from beginner to advanced level. Build real-world mobile apps with the latest React Native features.',
        modules: [
            {
                id: 1,
                title: 'Introduction to React Native',
                lessons: 8,
                duration: '2h 30m',
                lessons_list: [
                    'What is React Native?',
                    'Setting up Development Environment',
                    'Your First App',
                    'Understanding JSX'
                ]
            },
            {
                id: 2,
                title: 'React Native Components',
                lessons: 12,
                duration: '4h 15m',
                lessons_list: [
                    'Core Components',
                    'Styling Components',
                    'Lists and ScrollViews',
                    'Navigation Basics'
                ]
            },
            {
                id: 3,
                title: 'Advanced React Native',
                lessons: 15,
                duration: '5h 45m',
                lessons_list: [
                    'State Management',
                    'API Integration',
                    'Native Modules',
                    'Performance Optimization'
                ]
            }
        ]
    };

    // Shimmer effect for loading
    useEffect(() => {


        // Simulate loading
        setTimeout(() => {
            setIsLoading(false);

            // Slide in animation
            Animated.parallel([
                Animated.timing(slideInAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();
        }, 1500);
    }, []);

    // Header opacity based on scroll
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // Image scale based on scroll
    const imageScale = scrollY.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [1.2, 1, 0.9],
        extrapolate: 'clamp',
    });

    // Button press animation
    const animateButtonPress = () => {
        Animated.sequence([
            Animated.timing(buttonScaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
    };

    const toggleModule = (moduleId: number) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    const handleEnroll = () => {
        animateButtonPress();
        setEnrolled(true);
        Alert.alert('Success!', 'You have successfully enrolled in this course.');
    };

    const handleResume = () => {
        animateButtonPress();
        Alert.alert('Resume Course', 'Redirecting to video player...');
    };



   

    return (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    

    <ScrollView style={styles.scrollView}>
      {/* Course Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: courseData.image }} style={styles.courseImage} />
        <View style={styles.imageOverlay} />
      </View>

      <View style={styles.content}>
        
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{courseData.title}</Text>

          <View style={styles.instructorRow}>
            <Image source={{ uri: courseData.instructorImage }} style={styles.instructorImage} />
            <Text style={styles.instructorName}>{courseData.instructor}</Text>
          </View>

          <View style={styles.statsRow}>
            
          </View>

          <Text style={styles.description}>{courseData.description}</Text>
        </View>

     
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.enrollButton, enrolled && styles.enrolledButton]}
            onPress={enrolled ? handleResume : handleEnroll}
            activeOpacity={0.7}
          >
            <Text style={[styles.enrollButtonText, enrolled && styles.enrolledButtonText]}>
              {enrolled ? 'Resume Course' : `Enroll Now - ${courseData.price}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Course Modules */}
        <View style={styles.modulesContainer}>
          <Text style={styles.sectionTitle}>Course Content</Text>

          {courseData.modules.map((module) => (
            <View key={module.id} style={styles.moduleCard}>
              <TouchableOpacity
                style={styles.moduleHeader}
                onPress={() => toggleModule(module.id)}
                activeOpacity={0.7}
              >
                <View style={styles.moduleHeaderLeft}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleInfo}>
                    {module.lessons} lessons • {module.duration}
                  </Text>
                </View>
                <View style={styles.moduleArrow}>
                  <Text style={styles.arrowIcon}>
                    {expandedModules[module.id] ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedModules[module.id] && (
                <View style={styles.lessonsList}>
                  {module.lessons_list.map((lesson, index) => (
                    <View key={index} style={styles.lessonItem}>
                      <Text style={styles.lessonTitle}>{lesson}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        height: 250,
        overflow: 'hidden',
    },
    courseImage: {
        width: width,
        height: 250,
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        padding: 20,
    },
    courseInfo: {
        marginBottom: 20,
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    instructorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    instructorImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    instructorName: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    buttonContainer: {
        marginBottom: 30,
    },
    enrollButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#4A90E2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    enrolledButton: {
        backgroundColor: '#27AE60',
    },
    enrollButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    enrolledButtonText: {
        color: '#FFFFFF',
    },
    modulesContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    moduleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    moduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    moduleHeaderLeft: {
        flex: 1,
    },
    moduleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    moduleInfo: {
        fontSize: 14,
        color: '#666',
    },
    moduleArrow: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowIcon: {
        fontSize: 12,
        color: '#4A90E2',
    },
    lessonsList: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    lessonItem: {
        paddingVertical: 10,
        paddingLeft: 10,

        borderLeftColor: '#4A90E2',
        backgroundColor: '#F8F9FA',
        marginBottom: 5,
        borderRadius: 5,
    },
    lessonTitle: {
        fontSize: 14,
        color: '#333',
    },
    // Loading states
    loadingContainer: {
        flex: 1,
        padding: 20,
    },
    shimmerBackground: {
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        //: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
    },
    shimmerImage: {
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    shimmerTitle: {
        height: 30,
        borderRadius: 5,
        marginBottom: 15,
    },
    shimmerText: {
        height: 20,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
    },
    shimmerButton: {
        height: 50,
        borderRadius: 10,
        marginTop: 20,
    },
});

export default CourseDetailsScreen;