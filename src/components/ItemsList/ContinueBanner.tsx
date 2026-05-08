import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../index';
import { wp, hp } from '../../constants';

interface ContinueBannerProps {
  onPress: () => void;
}

const ContinueBanner = ({ onPress }: ContinueBannerProps) => (
  <View style={styles.container}>
    <AppButton
      title="Continue where you left off."
      onPress={onPress}
      variant="secondary"
      size="sm"
      style={{ borderRadius: wp(10) }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(6),
    marginBottom: hp(2),
  },
});

export default ContinueBanner;
