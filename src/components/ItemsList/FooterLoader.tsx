import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, hp } from '../../constants';

const FooterLoader = () => (
  <View style={styles.container}>
    <ActivityIndicator color={Colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(2),
  },
});

export default FooterLoader;
