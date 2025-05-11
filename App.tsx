import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  Header,
  LearnMoreLinks,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
//import { ThemeProvider, useTheme } from './android/app/src/contex/ThemeContex';
import Button from './android/app/src/components/reusable/Button';
import { ThemeProvider, useTheme } from './android/app/src/contex/ThemeContex';
import Dropdown from './android/app/src/components/reusable/Dropdown';
import Input from './android/app/src/components/reusable/Input';

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ children, title }: SectionProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Button
        title="Login"
        onPress={() => console.log('Clicked')}
        type="primary"
        size="small"
        loading={false}
        disabled={false}
      />

      <Text style={[styles.sectionDescription, { color: colors.text }]}>
        {children}
      </Text>
    </View>
  );
}

function Main(): React.JSX.Element {
  const { colors, isDark } = useTheme();

  const backgroundStyle = {
    backgroundColor: colors.background,
    flex: 1,
  };
    const handleOptionSelect = (option: string) => {
    console.log(`Selected: ${option}`);
  };
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!text) {
      setEmailError('Email is required');
    } else {
      setEmailError('');
    }
  };
console.log(email)
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <Header />
        <Section title="Step One">Edit App.tsx to change this screen.</Section>
        <Dropdown
        triggerElement={<Text style={{ color: 'white', fontSize: 18 }}>Show Options</Text>}
        options={['Option 1', 'Option 2', 'Option 3']}
        onOptionSelect={handleOptionSelect}
      />
    <Input
        label="Email"
        value={email}
        onChangeText={handleEmailChange}
        error={emailError}
        leftIcon="email"
        keyboardType="email-address"
      />
        <Section title="Reload Instructions"><ReloadInstructions /></Section>
        <Section title="Debug Instructions"><DebugInstructions /></Section>
        <LearnMoreLinks />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});