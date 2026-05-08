import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AppText, AppButton } from '../index';
import { Colors, GlobalStyles, hp } from '../../constants';

interface EmptyStateProps {
  loading: boolean;
  onRefresh: () => void;
}

const EmptyState = ({ loading, onRefresh }: EmptyStateProps) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <AppText variant="body" style={GlobalStyles.mt2}>Loading items...</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText variant="heading3">No items found</AppText>
      <AppButton
        title="Refresh"
        onPress={onRefresh}
        style={GlobalStyles.mt2}
        size="sm"
        variant="outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(20),
  },
});

export default EmptyState;
