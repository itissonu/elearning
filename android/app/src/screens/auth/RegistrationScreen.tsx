import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Input from '../../components/reusable/Input';
import { useTheme } from '../../contex/ThemeContex';
import Button from '../../components/reusable/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';


const RegistrationScreen = () => {
const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { colors, isDark } = useTheme();

  const handleRegister = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    console.log('Register clicked:', { email, password });


  }
  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.background : 'white' }]}

    >
      <Text style={[styles.title, { color: colors.text }]} >Welcome!</Text>

      <Input
        label="Name"
        placeholder="Enter your name"
        leftIcon="email"
        value={name}
        onChangeText={setName}
        error={!email && error ? 'Email is required' : ''}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderRadius: 24, padding: 16, color: colors.text,marginBottom: 1}}
      />
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
        label="Phone"
        placeholder="Enter your phone number"
        leftIcon="email"
        value={phone}
        onChangeText={setPhone}
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

      <Input
        label="Confirm Password"
        placeholder="Confirm your password"
        showPasswordToggle
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={!confirmPassword && error ? 'Confirm password is required' : ''}
        style={{ borderRadius: 24, padding: 16 }}
      />

      <Button title="Sign up" onPress={handleRegister} type='custom' />

      {/* <Text style={[styles.register, { color: colors.text }]}>

        <Text style={[styles.link, { color: '#7774f3' }]} onPress={() => navigation.navigate('Register')}>
          Forgot password?
        </Text>
      </Text> */}

      <Text style={[styles.register, { color: colors.text, position: 'absolute', bottom: 20, left: 0, right: 0 }]}>
        Already have an account?{' '}
        <Text style={[styles.link, { color: '#7774f3' }]} onPress={() => navigation.navigate('Login')}>
         Login
        </Text>
      </Text>

    </View>
  )
}

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
    marginBottom: 20,
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


export default RegistrationScreen