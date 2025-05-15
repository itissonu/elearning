import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Button from '../components/reusable/Button';
import { useNavigation, NavigationProp } from '@react-navigation/native';

 type AuthStackParamList = {
  GetStarted: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

const GetStartedScreen = () => {

     const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Get support{'\n'}
                in your{'\n'}
                new career
            </Text>

            <Image
                source={require('../assets/entry.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <TouchableOpacity>
                <Button 
                    title="Next" 
                    onPress={() => navigation.navigate('Login')}
                />
                <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2F659',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 50,
    },
    nextText: {
        fontSize: 18,
        textDecorationLine: 'underline',
    },
});

export default GetStartedScreen;
