import React, { memo } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

interface AppTextProps extends TextProps {
  variant?: 'hero' | 'heading1' | 'heading2' | 'heading3' | 'body' | 'bodySmall' | 'label';
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const AppText: React.FC<AppTextProps> = memo(({
  children,
  variant = 'body',
  color,
  align = 'left',
  style,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        color ? { color } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
});

const styles = StyleSheet.create({
  base: {
    color: Colors.textPrimary,
    fontFamily: Fonts.regular,
    fontWeight: Fonts.weights.regular,
  },
  hero: {
    fontSize: 40,
    fontFamily: Fonts.bold,
    fontWeight: Fonts.weights.bold,
    lineHeight: 48,
    letterSpacing: -1,
  },
  heading1: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    fontWeight: Fonts.weights.bold,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heading2: {
    fontSize: 24,
    fontFamily: Fonts.semibold,
    fontWeight: Fonts.weights.semibold,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  heading3: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    fontWeight: Fonts.weights.semibold,
    lineHeight: 26,
    letterSpacing: -0.15,
  },
  body: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    fontWeight: Fonts.weights.regular,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    fontWeight: Fonts.weights.regular,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    fontWeight: Fonts.weights.medium,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
