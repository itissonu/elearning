import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/reusable/Input';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../../components/reusable/Button';
import { useTheme } from '../../contex/ThemeContex';
import { Icon } from 'react-native-vector-icons/Icon';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { colors, isDark } = useTheme();

  const handleLogin = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    console.log('Login clicked:', { email, password });

    // Navigate to your main app or dashboard after login
    // navigation.replace('Main'); // if you have a main tab navigator
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.background : 'white' }]}

    >
      <Text style={[styles.title, { color: colors.text }]} >Hello again!</Text>

      <Input
        label="Email"
        placeholder="Enter your email"
        leftIcon="email"
        value={email}
        onChangeText={setEmail}
        error={!email && error ? 'Email is required' : ''}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderRadius: 24, padding: 16, color: colors.text }}
      />


      <Input
        label="Password"
        placeholder="Enter your password"

        showPasswordToggle
        value={password}
        onChangeText={setPassword}
        error={!password && error ? 'Password is required' : ''}
        style={{ borderRadius: 24, padding: 16 }}

      />

      <Button title="Login" onPress={handleLogin} type='custom' />

      <Text style={[styles.register, { color: colors.text }]}>

        <Text style={[styles.link, { color: '#7774f3' }]} onPress={() => navigation.navigate('Register')}>
          Forgot password?
        </Text>
      </Text>

      <Text style={[styles.register, { color: colors.text ,position: 'absolute', bottom: 20, left: 0, right: 0}]}>
        Don't have an account?{' '}
        <Text style={[styles.link, { color: '#7774f3' }]} onPress={() => navigation.navigate('Register')}>
          Register
        </Text>
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(10, 10, 9)',



  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  register: {
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
