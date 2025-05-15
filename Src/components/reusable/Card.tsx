import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/contex/ThemeContex';


interface CardProps {
  title: string;
  subtitle?: string;
  image?: ImageSourcePropType | string;
  imageSize?: 'small' | 'medium' | 'large' | 'full';
  onPress?: () => void;
  rightIcon?: string;
  leftIcon?: string;
  extra?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  imageSize = 'medium',
  onPress,
  rightIcon,
  leftIcon,
  extra,
  style,
  children,
}) => {
  const { colors, isDark } = useTheme();

  const getImageHeight = () => {
    switch (imageSize) {
      case 'small':
        return 120;
      case 'medium':
        return 160;
      case 'large':
        return 200;
      case 'full':
        return 240;
      default:
        return 160;
    }
  };

  const renderImage = () => {
    if (!image) return null;

    let imageSource;
    if (typeof image === 'string') {
      imageSource = { uri: image };
    } else {
      imageSource = image;
    }

    return (
      <Image
        source={imageSource}
        style={[
          styles.image,
          { height: getImageHeight() },
        ]}
        resizeMode="cover"
      />
    );
  };

  const CardComponent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {renderImage()}
      <View style={styles.content}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={24}
            color={colors.primary}
            style={styles.leftIcon}
          />
        )}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              leftIcon && { marginLeft: 32 },
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: colors.text + '99' },
                leftIcon && { marginLeft: 32 },
              ]}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
          {children && <View style={styles.childrenContainer}>{children}</View>}
        </View>
        {rightIcon && (
          <Icon
            name={rightIcon}
            size={24}
            color={colors.text + '80'}
            style={styles.rightIcon}
          />
        )}
      </View>
      {extra && <View style={styles.extra}>{extra}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
      >
        {CardComponent}
      </TouchableOpacity>
    );
  }

  return CardComponent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
  },
  rightIcon: {
    marginLeft: 8,
  },
  childrenContainer: {
    marginTop: 8,
  },
  extra: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default Card;
