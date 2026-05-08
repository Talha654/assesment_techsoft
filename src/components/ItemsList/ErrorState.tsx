import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, AppButton } from '../index';
import { Colors, GlobalStyles, hp } from '../../constants';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <View style={styles.container}>
    <AppText variant="heading3" color={Colors.error}>Oops!</AppText>
    <AppText variant="body" align="center" style={GlobalStyles.mt1}>{message}</AppText>
    <AppButton title="Try Again" onPress={onRetry} style={GlobalStyles.mt2} size="sm" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(20),
  },
});

export default ErrorState;
