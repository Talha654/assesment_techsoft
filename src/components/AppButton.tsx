import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { AppText } from './AppText';
import { wp, hp } from '../constants/Responsive';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}) => {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? Colors.primary : Colors.white} />
      ) : (
        <AppText
          variant={size === 'sm' ? 'label' : 'heading3'}
          color={isOutline || isGhost ? Colors.primary : Colors.white}>
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
  },
  md: {
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(5),
    width: '100%',
  },
  lg: {
    paddingVertical: hp(2.2),
    paddingHorizontal: wp(6),
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
