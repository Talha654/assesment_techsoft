import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

interface AppTextProps extends TextProps {
  variant?: 'hero' | 'heading1' | 'heading2' | 'heading3' | 'body' | 'bodySmall' | 'label';
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const AppText: React.FC<AppTextProps> = ({
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
};

const styles = StyleSheet.create({
  base: {
    color: Colors.textPrimary,
    fontFamily: Fonts.regular,
  },
  hero: {
    fontSize: 34,
    fontFamily: Fonts.bold,
    lineHeight: 41,
  },
  heading1: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    lineHeight: 34,
  },
  heading2: {
    fontSize: 22,
    fontFamily: Fonts.semibold,
    lineHeight: 28,
  },
  heading3: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
