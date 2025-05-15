import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Animated,
    StatusBar,
    Image,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MyCoursesScreen = () => {
    type TabKey = keyof typeof coursesData;
    const [activeTab, setActiveTab] = useState<TabKey>('ongoing');
    const [isLoading, setIsLoading] = useState(true);

    // Animation refs
    const slideInAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

    // Mock data
    const coursesData = {
        ongoing: [
            {
                id: 1,
                title: 'React Native Complete Guide',
                instructor: 'John Smith',
                progress: 0.65,
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&h=150&fit=crop',
                duration: '12h left',
                category: 'Mobile Development',
                lastWatched: '2 days ago'
            },
            {
                id: 2,
                title: 'Advanced JavaScript Concepts',
                instructor: 'Sarah Johnson',
                progress: 0.8,
                image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=150&h=150&fit=crop',
                duration: '5h left',
                category: 'Web Development',
                lastWatched: '1 day ago'
            },
            {
                id: 3,
                title: 'Python for Beginners',
                instructor: 'Mike Chen',
                progress: 0.3,
                image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=150&h=150&fit=crop',
                duration: '25h left',
                category: 'Programming',
                lastWatched: '1 week ago'
            }
        ],
        completed: [
            {
                id: 4,
                title: 'Introduction to Machine Learning',
                instructor: 'Dr. Emily Wilson',
                completedDate: '2024-11-15',
                image: 'https://images.unsplash.com/photo-1555949963-aa79dcacd3d4?w=150&h=150&fit=crop',
                certificate: true,
                rating: 4.5,
                category: 'AI/ML'
            },
            {
                id: 5,
                title: 'UI/UX Design Fundamentals',
                instructor: 'Alex Brown',
                completedDate: '2024-10-22',
                image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=150&h=150&fit=crop',
                certificate: true,
                rating: 5.0,
                category: 'Design'
            }
        ],
        wishlist: [
            {
                id: 6,
                title: 'Advanced React Patterns',
                instructor: 'David Kim',
                price: '$89.99',
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&h=150&fit=crop',
                rating: 4.8,
                category: 'Web Development'
            },
            {
                id: 7,
                title: 'DevOps with Docker',
                instructor: 'Lisa Martinez',
                price: '$129.99',
                image: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fcc3?w=150&h=150&fit=crop',
                rating: 4.7,
                category: 'DevOps'
            }
        ]
    };

    const tabs = [
        { key: 'ongoing', label: 'Ongoing', count: coursesData.ongoing.length },
        { key: 'completed', label: 'Completed', count: coursesData.completed.length },
        { key: 'wishlist', label: 'Wishlist', count: coursesData.wishlist.length }
    ];

    useEffect(() => {
        // Initial load animation
        setTimeout(() => {
            setIsLoading(false);
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
        }, 800);
    }, []);

    // Tab indicator animation
    useEffect(() => {
        const tabIndex = tabs.findIndex(tab => tab.key === activeTab);
        Animated.timing(tabIndicatorAnim, {
            toValue: tabIndex,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [activeTab]);

    const OngoingCourseCard: React.FC<{ item: typeof coursesData.ongoing[0]; index: number }> = ({ item, index }) => {
        const cardAnimation = useRef(new Animated.Value(50)).current;
        const progressAnimation = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(cardAnimation, {
                toValue: 0,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                Animated.timing(progressAnimation, {
                    toValue: item.progress,
                    duration: 1000,
                    useNativeDriver: false,
                }).start();
            }, 500);
        }, []);

        return (
            <Animated.View
                style={[
                    styles.courseCard,
                    {
                        transform: [{ translateY: cardAnimation }]
                    }
                ]}
            >
                <Image source={{ uri: item.image }} style={styles.courseImage} />
                <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.instructorName}>{item.instructor}</Text>
                    <Text style={styles.lastWatched}>Last watched: {item.lastWatched}</Text>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: progressAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%'],
                                        })
                                    }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {Math.round(item.progress * 100)}%
                        </Text>
                    </View>

                    <View style={styles.courseFooter}>
                        <Text style={styles.duration}>{item.duration}</Text>
                        <TouchableOpacity style={styles.resumeButton}>
                            <Text style={styles.resumeButtonText}>Resume</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    };

    const CompletedCourseCard = ({ item, index }:{item:any,index:any}) => (
        <Animated.View
            style={[
                styles.courseCard,
                {
                    transform: [{
                        translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                        })
                    }],
                    opacity: fadeAnim
                }
            ]}
        >
            <Image source={{ uri: item.image }} style={styles.courseImage} />
            <View style={styles.courseInfo}>
                <View style={styles.certificateBadge}>
                    <Text style={styles.certificateIcon}>🏆</Text>
                </View>
                <Text style={styles.courseTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.instructorName}>{item.instructor}</Text>
                <Text style={styles.completedDate}>
                    Completed: {new Date(item.completedDate).toLocaleDateString()}
                </Text>

                <View style={styles.courseFooter}>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>⭐ {item.rating}</Text>
                    </View>
                    <TouchableOpacity style={styles.certificateButton}>
                        <Text style={styles.certificateButtonText}>Certificate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );

    const WishlistCourseCard = ({ item, index }:{item:any,index:any}) => (
        <Animated.View
            style={[
                styles.courseCard,
                {
                    transform: [{
                        translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                        })
                    }],
                    opacity: fadeAnim
                }
            ]}
        >
            <Image source={{ uri: item.image }} style={styles.courseImage} />
            <View style={styles.courseInfo}>
                <TouchableOpacity style={styles.wishlistIcon}>
                    <Text style={styles.heartIcon}>❤️</Text>
                </TouchableOpacity>
                <Text style={styles.courseTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.instructorName}>{item.instructor}</Text>

                <View style={styles.courseFooter}>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>⭐ {item.rating}</Text>
                    </View>
                    <Text style={styles.price}>{item.price}</Text>
                </View>

                <TouchableOpacity style={styles.enrollButton}>
                    <Text style={styles.enrollButtonText}>Enroll Now</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );

    const renderContent = () => {
        const data = coursesData[activeTab];

        if (activeTab === 'ongoing') {
            return data
                .filter((item): item is typeof coursesData.ongoing[0] => 'progress' in item)
                .map((item, index) => (
                    <OngoingCourseCard key={item.id} item={item} index={index} />
                ));
        } else if (activeTab === 'completed') {
            return data.map((item, index) => (
                <CompletedCourseCard key={item.id} item={item} index={index} />
            ));
        } else {
            return data.map((item, index) => (
                <WishlistCourseCard key={item.id} item={item} index={index} />
            ));
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading your courses...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <Animated.View
                style={[
                    styles.content,
                    {
                        transform: [{ translateY: slideInAnim }],
                        opacity: fadeAnim,
                    }
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Courses</Text>
                    <TouchableOpacity style={styles.sortButton}>
                        <Text style={styles.sortIcon}>⚙️</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <View style={styles.tabs}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[
                                    styles.tab,
                                    activeTab === tab.key && styles.activeTab
                                ]}
                                onPress={() => setActiveTab(tab.key as TabKey)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === tab.key && styles.activeTabText
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{tab.count}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Animated.View
                        style={[
                            styles.tabIndicator,
                            {
                                transform: [{
                                    translateX: tabIndicatorAnim.interpolate({
                                        inputRange: [0, 1, 2],
                                        outputRange: [0, width / 3, (width * 2) / 3],
                                    })
                                }]
                            }
                        ]}
                    />
                </View>

                {/* Course List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.coursesList}
                >
                    {renderContent()}
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    sortButton: {
        padding: 10,
    },
    sortIcon: {
        fontSize: 18,
    },
    tabsContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        borderRadius: 25,
        padding: 4,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    activeTabText: {
        color: '#4A90E2',
        fontWeight: '600',
    },
    countBadge: {
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    countText: {
        fontSize: 12,
        color: '#666',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        width: width / 3,
        backgroundColor: '#4A90E2',
        borderRadius: 1.5,
    },
    coursesList: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    courseCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    courseImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
        marginRight: 12,
    },
    courseInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    instructorName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    lastWatched: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        marginRight: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4A90E2',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 14,
        color: '#4A90E2',
        fontWeight: '600',
    },
    courseFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    duration: {
        fontSize: 12,
        color: '#999',
    },
    resumeButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
    },
    resumeButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    // Completed course styles
    certificateBadge: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    certificateIcon: {
        fontSize: 20,
    },
    completedDate: {
        fontSize: 12,
        color: '#27AE60',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 14,
        color: '#333',
    },
    certificateButton: {
        backgroundColor: '#27AE60',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    certificateButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    // Wishlist course styles
    wishlistIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    heartIcon: {
        fontSize: 20,
        color: '#FF3D00',
    },

   
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    enrollButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    enrollButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default MyCoursesScreen;