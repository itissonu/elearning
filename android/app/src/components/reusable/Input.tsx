import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../contex/ThemeContex';


interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  showPasswordToggle?: boolean;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  onRightIconPress,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  ...rest
}) => {
  const { colors, isDark } = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: colors.text },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error 
              ? colors.error 
              : isFocused 
                ? colors.primary 
                : colors.border,
            backgroundColor: isDark ? colors.card : '#F3F4F6',
          },
        ]}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={error ? colors.error : colors.text + '80'}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 36 : 12,
              paddingRight: (rightIcon || showPasswordToggle) ? 40 : 12,
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.text + '60'}
          secureTextEntry={showPasswordToggle ? !passwordVisible : secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {(rightIcon || showPasswordToggle) && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={
              showPasswordToggle
                ? togglePasswordVisibility
                : onRightIconPress
            }
          >
            <Icon
              name={
                showPasswordToggle
                  ? passwordVisible
                    ? 'visibility-off'
                    : 'visibility'
                  : rightIcon || ''
              }
              size={20}
              color={colors.text + '80'}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={[
            styles.error,
            { color: colors.error },
            errorStyle,
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    position: 'relative',
  },
  input: {
    height: 48,
    fontSize: 16,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});
export default Input;