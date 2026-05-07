import { StyleSheet } from 'react-native';
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
    paddingHorizontal: wp(5),
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
  mt1: { marginTop: hp(1) },
  mt2: { marginTop: hp(2) },
  mt3: { marginTop: hp(3) },
  mb1: { marginBottom: hp(1) },
  mb2: { marginBottom: hp(2) },
  mb3: { marginBottom: hp(3) },
});

export default GlobalStyles;
