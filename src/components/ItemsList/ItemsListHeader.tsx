import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '../index';
import { Colors, GlobalStyles, wp, hp } from '../../constants';

interface ItemsListHeaderProps {
  onLogout: () => void;
}

const ItemsListHeader = ({ onLogout }: ItemsListHeaderProps) => (
  <View style={styles.header}>
    <View>
      <AppText variant="heading1">Discover</AppText>
      <AppText variant="bodySmall">Premium selections</AppText>
    </View>
    <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
      <AppText variant="label" color={Colors.error}>Log out</AppText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    paddingTop: hp(2),
    paddingBottom: hp(3),
  },
  logoutButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(5),
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default ItemsListHeader;
