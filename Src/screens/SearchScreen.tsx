import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  interface SearchResult {
    id: number;
    title: string;
    instructor: string;
    rating: number;
    image: string;
    price: string;
    category: string;
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Animation refs
  const slideInAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const filterAnimation = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;

  // Mock data
  const recentSearches = ['React Native', 'Flutter', 'Python', 'JavaScript'];
  const popularTags = ['Mobile Development', 'Web Development', 'Data Science', 'AI/ML', 'UI/UX'];
  const filters = ['Free', 'Paid', 'Beginner', 'Intermediate', 'Advanced', 'Certificate'];
  
  const mockResults = [
    {
      id: 1,
      title: 'Complete React Native Development',
      instructor: 'John Smith',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&h=150&fit=crop',
      price: '$99.99',
      category: 'Mobile Development'
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      instructor: 'Sarah Johnson',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=150&h=150&fit=crop',
      price: 'Free',
      category: 'Web Development'
    },
    {
      id: 3,
      title: 'Python for Data Science',
      instructor: 'Mike Chen',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=150&h=150&fit=crop',
      price: '$79.99',
      category: 'Data Science'
    }
  ];

  useEffect(() => {
    // Initial slide-in animation
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
  }, []);

  // Filter animation
  useEffect(() => {
    Animated.timing(filterAnimation, {
      toValue: showFilters ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showFilters]);

  // Search animation
  useEffect(() => {
    if (searchQuery.length > 0) {
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Simulate search
      setIsSearching(true);
      setTimeout(() => {
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 1000);
    } else {
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleFilterPress = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleTagPress = (tag: string) => {
    setSearchQuery(tag);
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
  };

  const filterHeight = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const ResultCard: React.FC<{ item: SearchResult; index: number }> = ({ item, index }) => {
    const cardAnimation = useRef(new Animated.Value(50)).current;
    const cardFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(cardAnimation, {
          toValue: 0,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        })
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.resultCard,
          {
            transform: [{ translateY: cardAnimation }],
            opacity: cardFade,
          }
        ]}
      >
        <Image source={{ uri: item.image }} style={styles.courseImage} />
        <View style={styles.courseInfo}>
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
        </View>
      </Animated.View>
    );
  };

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
          <Text style={styles.headerTitle}>Search Courses</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for courses, instructors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Text style={styles.filterIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <Animated.View
          style={[
            styles.filtersContainer,
            {
              height: filterHeight,
              opacity: filterAnimation,
            }
          ]}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilters.includes(filter) && styles.filterChipActive
                ]}
                onPress={() => handleFilterPress(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilters.includes(filter) && styles.filterTextActive
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Results */}
          <Animated.View
            style={[
              styles.resultsContainer,
              {
                opacity: searchAnimation,
                transform: [{
                  translateY: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                }]
              }
            ]}
          >
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View>
                <Text style={styles.sectionTitle}>
                  Search Results ({searchResults.length})
                </Text>
                {searchResults.map((item, index) => (
                  <ResultCard key={item.id} item={item} index={index} />
                ))}
              </View>
            ) : null}
          </Animated.View>

          {/* Recent Searches */}
          {searchQuery.length === 0 && (
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: searchAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <View style={styles.recentSearches}>
                {recentSearches.map((search) => (
                  <TouchableOpacity
                    key={search}
                    style={styles.recentSearchItem}
                    onPress={() => handleRecentSearchPress(search)}
                  >
                    <Text style={styles.recentSearchIcon}>🕐</Text>
                    <Text style={styles.recentSearchText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Popular Tags */}
          {searchQuery.length === 0 && (
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: searchAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.sectionTitle}>Popular Topics</Text>
              <View style={styles.tagsContainer}>
                {popularTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tagChip}
                    onPress={() => handleTagPress(tag)}
                  >
                    <Text style={styles.tagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    fontSize: 18,
  },
  filtersContainer: {
    overflow: 'hidden',
  },
  filtersContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  filterChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#4A90E2',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  recentSearches: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 10,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  recentSearchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseImage: {
    width: 80,
    height: 80,
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
    marginBottom: 8,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});

export default SearchScreen;