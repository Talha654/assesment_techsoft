import { StyleSheet, Platform } from 'react-native';
import { Colors } from './Colors';
import { wp, hp } from './Responsive';
import { Fonts } from './Fonts';

export const GlobalStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: wp(6),
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowSm: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  shadowMd: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mt1: { marginTop: hp(1) },
  mt2: { marginTop: hp(2) },
  mt3: { marginTop: hp(3) },
  mb1: { marginBottom: hp(1) },
  mb2: { marginBottom: hp(2) },
  mb3: { marginBottom: hp(3) },
});

export default GlobalStyles;
