import React, { useRef, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  Animated,
  Pressable,
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

export const AppButton: React.FC<AppButtonProps> = React.memo(({
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

  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  }, [scaleValue]);

  const getPressableStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => [
      styles.base,
      styles[variant],
      styles[size],
      disabled && styles.disabled,
      pressed && !disabled && isGhost && { backgroundColor: Colors.borderLight },
    ],
    [variant, size, disabled, isGhost]
  );

  const animatedStyle = useMemo(() => [{ transform: [{ scale: scaleValue }] }, style], [scaleValue, style]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={getPressableStyle}>
        {loading ? (
          <ActivityIndicator color={isOutline || isGhost ? Colors.primary : Colors.white} />
        ) : (
          <AppText
            variant={size === 'sm' ? 'label' : 'heading3'}
            color={isOutline || isGhost ? Colors.primary : Colors.white}>
            {title}
          </AppText>
        )}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  base: {
    borderRadius: wp(4), // Squircle-like larger radius
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  sm: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
  },
  md: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    width: '100%',
  },
  lg: {
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(8),
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
