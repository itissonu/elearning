import React from 'react'
import { Text, View } from 'react-native'

const LoginScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'blue' }}>Welcome to E-learning</Text>
        <Text>Login Sceen</Text>
        <Text>Welcome back! Please log in to continue.</Text>
        <Text>Enter your credentials below.</Text>
    </View>
  )
}

export default LoginScreen