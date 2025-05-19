// src/screens/home/HomeScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, TextInput } from 'react-native';
import Card from '../../components/reusable/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Input from '../../components/reusable/Input';
import Button from '../../components/reusable/Button';
import { useTheme } from '../../context/contex/ThemeContex';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const categories = [
    { id: '1', name: 'Art' },
    { id: '2', name: 'Design' },
    { id: '3', name: 'Programming' },

  ];
  const courses = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/14553713/pexels-photo-14553713.jpeg?auto=compress&cs=tinysrgb&w=600',
      name: 'Mastering React Native from Scratch',
      author: 'John Doe',
      rating: 4.8,
      reviews: 254,
      enrolled: 1200,
      price: 799,
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/14553713/pexels-photo-14553713.jpeg?auto=compress&cs=tinysrgb&w=600',
      name: 'UI/UX Design Essentials',
      author: 'Jane Smith',
      rating: 4.7,
      reviews: 321,
      enrolled: 980,
      price: 599,
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/14553713/pexels-photo-14553713.jpeg?auto=compress&cs=tinysrgb&w=600',
      name: 'Advanced JavaScript Techniques',
      author: 'Alex Dev',
      rating: 4.9,
      reviews: 400,
      enrolled: 1800,
      price: 899,
    },
  ];
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CourseDetail', { course: item })}>
      <View style={styles.cardCourse}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.author}>By {item.author}</Text>

          <View style={styles.metaRow}>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>⭐ {item.rating} ({item.reviews})</Text>
            </View>

            <View style={styles.users}>
              <Text style={styles.userText}>{item.enrolled}+ students</Text>
            </View>
          </View>

          <Text style={styles.prices}>₹ {item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const [selectedCategory, setSelectedCategory] = useState('Design');

  const { colors, isDark } = useTheme();
  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? colors.background : 'white' }]}>

      <View style={[styles.header, { borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingBottom: 40, backgroundColor: isDark ? '#363d36' : 'black' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/29996343/pexels-photo-29996343/free-photo-of-bright-yellow-gerbera-daisy-against-dark-background.jpeg?auto=compress&cs=tinysrgb&w=600',
              }}
              style={styles.profileImage}
            />
            <Text style={[styles.welcome, { color: 'white', marginLeft: 10 }]}>Hello, Student 👋</Text>
            <View style={{
              width: 30,
              height: 30,
              backgroundColor: 'gray',
              borderRadius: 5,
              borderBlockColor: 'white',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 6,
            }}>
              <Icon name="notifications" size={20} color={colors.text} />
            </View>
          </View>


        </View>

        {/* Search Input half inside, half outside */}
        <TextInput style={{
          position: 'absolute',
          bottom: -25, // Pulling it outside the header
          left: '60%',
          transform: [{ translateX: -150 }], // Half of the input width
          width: 280,
          height: 50,
          backgroundColor: '#fff',
          borderRadius: 25,
          justifyContent: 'center',
          paddingHorizontal: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 6,
          elevation: 5,

          color: 'black',
        }} placeholder='🔍 Search...' />

      </View>


      <View style={styles.headerCard}>
        <Text style={styles.statsText}>25+ Lecture     45 Enrolled     4.8 Rating</Text>
        <Text style={styles.title}>Ui/Ux Design{"\n"}Live class</Text>

        <Icon name="arrow-forward" size={18} color="black" />
        <View style={styles.instructorRow}>
          <Image source={{ uri: 'https://i.pravatar.cc/50?img=1' }} style={styles.avatar} />
          <Text style={styles.instructor}>Alfie Mason</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.seats}>30{"\n"}Seat Available</Text>
          <TouchableOpacity style={styles.bookNow}>
            <Text style={styles.bookNowText}>Book Now</Text>

            <Icon name="arrow-forward" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          title="Go to Video Call"
          onPress={() => navigation.navigate('VideoCall')}
        />
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {/* Category */}
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.chipContainer, { paddingHorizontal: 20 }]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedCategory === item.name && styles.chipActive,
              ]}
              onPress={() => setSelectedCategory(item.name)}
            >
              <Text
                style={[
                  styles.chipText, { color: isDark ? 'white' : 'black' },
                  selectedCategory === item.name && styles.chipTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />


        {/* Cards */}
        <View >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 30 }}
            contentContainerStyle={{ gap: 12 }}
          >
            <View style={styles.carde}>
              <Text style={styles.level}>Beginner</Text>
              <Text style={[styles.price, { color: 'white' }]}>$90</Text>
              <Text style={styles.course}>web design</Text>
              <View style={styles.detailsRow}>
                {/* <Icon name="checkmark-circle-outline" color="#ccc" size={16} /> */}
                <Text style={styles.detailsText}>Certificate</Text>
                <Text style={styles.detailsText}>6h 45m</Text>
              </View>
            </View>
            <View style={styles.carde}>
              <Text style={styles.level}>Beginner</Text>
              <Text style={styles.price}>$90</Text>
              <Text style={styles.course}>web design</Text>
              <View style={styles.detailsRow}>
                {/* <Icon name="checkmark-circle-outline" color="#ccc" size={16} /> */}
                <Text style={styles.detailsText}>Certificate</Text>
                <Text style={styles.detailsText}>6h 45m</Text>
              </View>
            </View>

            <View style={[styles.carde, styles.cardActive]}>
              <Text style={[styles.level, { color: 'black' }]}>Advance</Text>
              <Text style={[styles.price, { color: 'black' }]}>$150</Text>
              <Text style={[styles.course, { color: 'black' }]}>Ui Design</Text>
              <View style={styles.detailsRow}>
                {/* <Icon name="checkmark-circle-outline" color="#000" size={16} /> */}
                <Text style={[styles.detailsText, { color: 'black' }]}>Certificate</Text>
                <Text style={[styles.detailsText, { color: 'black' }]}>6h 45m</Text>
              </View>
            </View>
            <View style={styles.carde}>
              <Text style={styles.level}>Beginner</Text>
              <Text style={styles.price}>$90</Text>
              <Text style={styles.course}>web design</Text>
              <View style={styles.detailsRow}>
                {/* <Icon name="checkmark-circle-outline" color="#ccc" size={16} /> */}
                <Text style={styles.detailsText}>Certificate</Text>
                <Text style={styles.detailsText}>6h 45m</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Instructors */}
        <Text style={styles.sectionTitle}>Instructor</Text>
        <View style={styles.instructorContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 30 }}
            contentContainerStyle={{ gap: 12 }}
          >
            {['Aharli Kane', 'Alfie Mason', 'Jane Co', 'FB Barcelona'].map((name, i) => (
              <View key={i} style={styles.instructorCard}>
                <Image source={{ uri: `https://i.pravatar.cc/50?img=${i + 2}` }} style={styles.avatar} />
                <Text style={styles.instructorName}>{name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Courses</Text>
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>



    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F5F5F5', // or use theme colors

  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between', // or 'flex-start' if you want icon close to text

    paddingVertical: 12,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    backgroundColor: '#363d36', // or use theme colors
    paddingTop: 50,
    paddingHorizontal: 20,
    position: 'relative',
    marginBottom: 40,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    height: 150
  },




  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 12,
  },
  welcome: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1, // makes text take available space
    color: '#000', // or use theme colors
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseName: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  progress: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  headerCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    marginRight: 16,
    marginLeft: 16,
    shadowColor: 'rgb(235, 22, 22)',
    shadowOpacity: 1,
    shadowOffset: { width: 10, height: 4 },
    shadowRadius: 10,
  },
  statsText: {
    color: '#aaa',
    marginBottom: 8,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 32,
    marginRight: 8,
  },
  instructor: {
    color: 'white',
  },
  footerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seats: {
    color: '#aaa',
    fontSize: 12,
  },
  bookNow: {
    backgroundColor: '#def358',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookNowText: {
    fontWeight: 'bold',
    marginRight: 6,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: '#def358',
  },
  chipText: {
    color: 'white',
  },
  chipTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  carde: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 16,
    width: 140,
  },
  cardActive: {
    backgroundColor: '#def358',
  },
  level: {
    color: '#999',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  course: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailsText: {
    fontSize: 12,
    color: '#ccc',
  },
  instructorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
  },
  instructorCard: {
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  instructorName: {
    color: 'white',
    marginTop: 4,
    fontSize: 12,
  },
  cardCourse: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
    padding: 12,
  },
  image: {
    padding: 12,
    resizeMode: 'cover',
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  author: {
    fontSize: 12,
    color: '#f15929',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: 'white',
  },
  users: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#d5d26a',
  },
  prices: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
