import React from 'react'
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../context/contex/ThemeContex';

interface ButtonProps {
    title: string;
    onPress: () => void;
    type?: 'primary' | 'secondary' | 'outline' | 'text' | 'custom';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
}


const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    type = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon
}) => {

    const { colors } = useTheme();
    const getButtonStyle = () => {
        switch (type) {
            case 'primary':
                return {
                    backgroundColor: disabled ? colors.border : colors.primary,
                    borderColor: disabled ? colors.border : colors.primary,
                };
            case 'secondary':
                return {
                    backgroundColor: disabled ? colors.border : colors.secondary,
                    borderColor: disabled ? colors.border : colors.secondary,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: disabled ? colors.border : colors.primary,
                };
            case 'text':
                return {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                };
            case 'custom':
                return {
                    backgroundColor: disabled ? colors.border : colors.custom,
                    borderColor: disabled ? colors.border : colors.custom,
                };
            default:
                return {
                    backgroundColor: disabled ? colors.border : colors.primary,
                    borderColor: disabled ? colors.border : colors.primary,
                };
        }
    };
    // Button size styles
    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                };
            case 'medium':
                return {
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                };
            case 'large':
                return {
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                };
            default:
                return {
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                };
        }
    };
    const getTextColor = () => {
        if (disabled) {
            return colors.text + '80'; // With opacity
        }

        switch (type) {
            case 'primary':

            case 'secondary':
                return '#FFFFFF';
            case 'outline':
            case 'text':
                return colors.primary;
            case 'custom':
                return 'black';
            default:
                return '#FFFFFF';
        }
    };
    const getTextSize = () => {
        switch (size) {
            case 'small':
                return 14;
            case 'medium':
                return 16;
            case 'large':
                return 18;
            default:
                return 16;
        }
    };
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                getSizeStyle(),
                getButtonStyle(),
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={type === 'outline' || type === 'text' ? colors.primary : '#FFFFFF'}
                />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: getTextColor(),
                                fontSize: getTextSize(),
                                marginLeft: icon ? 8 : 0,
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}

        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
        borderWidth: 1,
    },
    text: {
        fontWeight: '600',
    },
})