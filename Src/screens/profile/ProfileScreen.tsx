import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
//import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Mock icon components (you'd replace these with proper icons from react-native-vector-icons)
const IconPlaceholder = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size, backgroundColor: color }]} />
);

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('courses');

  // Mock data
  const studentData = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "https://picsum.photos/120/120",
    stats: {
      enrolled: 12,
      completed: 8,
      certificates: 5,
      streak: 23,
      averageScore: 89,
      timeSpent: 145
    },
    currentLearningStreak: 23,
    coursesCompleted: 8,
    averageScore: 89,
    timeSpentLearning: 145,
    courses: [
      { id: 1, title: "React Fundamentals", progress: 85, instructor: "Sarah Chen", rating: 4.9 },
      { id: 2, title: "Python for Data Science", progress: 62, instructor: "Dr. Mike Rodriguez", rating: 4.7 },
      { id: 3, title: "UX Design Principles", progress: 94, instructor: "Emma Wilson", rating: 4.8 },
      { id: 4, title: "Machine Learning Basics", progress: 30, instructor: "Prof. James Liu", rating: 4.6 }
    ],
    saved: [
      { id: 5, title: "Advanced JavaScript", instructor: "John Doe", rating: 4.8 },
      { id: 6, title: "Cloud Computing AWS", instructor: "Lisa Brown", rating: 4.7 },
      { id: 7, title: "Mobile App Development", instructor: "Alex Turner", rating: 4.9 }
    ],
    weeklyProgress: [30, 45, 35, 50, 40, 60, 25]
  };

  const CircularProgress = ({ percentage, size = 120, color = '#4f46e5' }: { percentage: number; size?: number; color?: string }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        {/* <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </Svg> */}
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>{percentage}%</Text>
          </View>
        </View>
      </View>
    );
  };

  const ProgressBar = ({ progress, color = '#10b981' }: { progress: number; color?: string }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  );

  const StatCard = ({ iconName, title, value, description, gradient }: { iconName: string; title: string; value: string | number; description: string; gradient: object }) => (
    <View style={[styles.statCard, gradient]}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardText}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={styles.statCardValue}>{value}</Text>
          <Text style={styles.statCardDescription}>{description}</Text>
        </View>
        <View style={styles.statCardIconContainer}>
          <IconPlaceholder size={32} color="#ffffff40" />
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <View>
            {studentData.courses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <View style={styles.ratingContainer}>
                    <IconPlaceholder size={16} color="#fbbf24" />
                    <Text style={styles.rating}>{course.rating}</Text>
                  </View>
                </View>
                <Text style={styles.instructor}>by {course.instructor}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressLabels}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressValue}>{course.progress}%</Text>
                  </View>
                  <ProgressBar progress={course.progress} />
                </View>
                <TouchableOpacity style={styles.continueButton}>
                  <IconPlaceholder  size={20} color="#4f46e5" />
                  <Text style={styles.continueButtonText}>Continue Learning</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      case 'saved':
        return (
          <View style={styles.savedContainer}>
            {studentData.saved.map((course) => (
              <View key={course.id} style={styles.savedCard}>
                <View style={styles.savedHeader}>
                  <Text style={styles.savedTitle}>{course.title}</Text>
                  <IconPlaceholder size={20} color="#4f46e5" />
                </View>
                <Text style={styles.savedInstructor}>by {course.instructor}</Text>
                <View style={styles.savedRating}>
                  <IconPlaceholder size={16} color="#fbbf24" />
                  <Text style={styles.rating}>{course.rating}</Text>
                </View>
                <TouchableOpacity style={styles.enrollButton}>
                  <Text style={styles.enrollButtonText}>Enroll Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      case 'settings':
        return (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsSection}>
              <Text style={styles.settingsTitle}>Profile Settings</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <View style={styles.input}>
                  <Text style={styles.inputText}>{studentData.name}</Text>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.input}>
                  <Text style={styles.inputText}>{studentData.email}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.settingsSection}>
              <Text style={styles.settingsTitle}>Notifications</Text>
              {[
                'Email notifications for new courses',
                'Push notifications for assignments',
                'Weekly progress reports',
                'Course completion certificates'
              ].map((setting, index) => (
                <View key={index} style={styles.checkboxItem}>
                  <View style={styles.checkbox} />
                  <Text style={styles.checkboxLabel}>{setting}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.settingsButtons}>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: studentData.avatar }} style={styles.avatar} />
              <View style={styles.verificationBadge}>
                <IconPlaceholder  size={16} color="#ffffff" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{studentData.name}</Text>
              <View style={styles.emailContainer}>
                <IconPlaceholder  size={16} color="#6b7280" />
                <Text style={styles.email}>{studentData.email}</Text>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <View style={styles.statIcon}>
                    <IconPlaceholder  size={20} color="#3b82f6" />
                    <Text style={styles.statNumber}>{studentData.stats.enrolled}</Text>
                  </View>
                  <Text style={styles.statLabel}>Courses Enrolled</Text>
                </View>
                <View style={styles.stat}>
                  <View style={styles.statIcon}>
                    <IconPlaceholder  size={20} color="#10b981" />
                    <Text style={styles.statNumber}>{studentData.stats.completed}</Text>
                  </View>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.stat}>
                  <View style={styles.statIcon}>
                    <IconPlaceholder  size={20} color="#f59e0b" />
                    <Text style={styles.statNumber}>{studentData.stats.certificates}</Text>
                  </View>
                  <Text style={styles.statLabel}>Certificates Earned</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Progress Dashboard */}
        <View style={styles.dashboardGrid}>
          <StatCard
            iconName="target"
            title="Current Learning Streak"
            value={`${studentData.currentLearningStreak}`}
            description="Days in a row"
            gradient={styles.orangeGradient}
          />
          <StatCard
            iconName="check"
            title="Courses Completed"
            value={studentData.coursesCompleted}
            description="This month"
            gradient={styles.greenGradient}
          />
          <StatCard
            iconName="trending"
            title="Average Score"
            value={`${studentData.averageScore}%`}
            description="Across all courses"
            gradient={styles.blueGradient}
          />
          <StatCard
            iconName="clock"
            title="Time Spent Learning"
            value={`${studentData.timeSpentLearning}h`}
            description="This month"
            gradient={styles.purpleGradient}
          />
        </View>

        {/* Circular Progress Charts */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <View style={styles.progressChartsContainer}>
            <View style={styles.progressChart}>
              <CircularProgress percentage={75} color="#10b981" />
              <Text style={styles.progressChartTitle}>Overall Progress</Text>
              <Text style={styles.progressChartSubtitle}>Across all courses</Text>
            </View>
            <View style={styles.progressChart}>
              <CircularProgress percentage={89} color="#3b82f6" />
              <Text style={styles.progressChartTitle}>Average Score</Text>
              <Text style={styles.progressChartSubtitle}>Assignment performance</Text>
            </View>
            <View style={styles.progressChart}>
              <CircularProgress percentage={62} color="#8b5cf6" />
              <Text style={styles.progressChartTitle}>Completion Rate</Text>
              <Text style={styles.progressChartSubtitle}>Course completion</Text>
            </View>
          </View>
        </View>

        {/* Weekly Progress Bar */}
        <View style={styles.weeklyProgressSection}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.barChart}>
            {studentData.weeklyProgress.map((value, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.bar, { height: value * 2 }]} />
                <Text style={styles.dayLabel}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabbed Layout */}
        <View style={styles.tabContainer}>
          <View style={styles.tabHeader}>
            {[
              { id: 'courses', label: 'My Courses', icon: 'book' },
              { id: 'saved', label: 'Saved', icon: 'bookmark' },
              { id: 'settings', label: 'Settings', icon: 'settings' }
            ].map(({ id, label, icon }) => (
              <TouchableOpacity
                key={id}
                onPress={() => setActiveTab(id)}
                style={[
                  styles.tab,
                  activeTab === id && styles.activeTab
                ]}
              >
                <IconPlaceholder 
                  
                  size={20} 
                  color={activeTab === id ? '#4f46e5' : '#6b7280'} 
                />
                <Text style={[
                  styles.tabLabel,
                  activeTab === id && styles.activeTabLabel
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.tabContent}>
            {renderTabContent()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4f46e5',
  },
  verificationBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#10b981',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  email: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 16,
    gap: 16,
  },
  statCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCardText: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: 14,
    color: '#ffffff80',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statCardDescription: {
    fontSize: 12,
    color: '#ffffff70',
  },
  statCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeGradient: {
    backgroundColor: '#f97316',
  },
  greenGradient: {
    backgroundColor: '#10b981',
  },
  blueGradient: {
    backgroundColor: '#3b82f6',
  },
  purpleGradient: {
    backgroundColor: '#8b5cf6',
  },
  progressSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  progressChartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressChart: {
    alignItems: 'center',
    flex: 1,
  },
  progressChartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  progressChartSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  progressTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  weeklyProgressSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  bar: {
    width: '100%',
    backgroundColor: '#4f46e5',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabLabel: {
    color: '#4f46e5',
  },
  tabContent: {
    padding: 20,
  },
  courseCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#6b7280',
  },
  instructor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4f46e5',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4f46e5',
  },
  savedContainer: {
    gap: 16,
  },
  savedCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  savedInstructor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  savedRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  enrollButton: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#15803d',
  },
  settingsContainer: {
    gap: 20,
  },
  settingsSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  inputText: {
    fontSize: 16,
    color: '#1f2937',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4f46e5',
    borderRadius: 4,
    backgroundColor: '#4f46e5',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  settingsButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  iconPlaceholder: {
    borderRadius: 2,
  },
});

export default StudentProfile;