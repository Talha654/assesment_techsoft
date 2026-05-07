import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { wp } from '../constants/Responsive';
import { GlobalStyles } from '../constants/GlobalStyles';

interface AppCardProps extends ViewProps {
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppCard: React.FC<AppCardProps> = React.memo(({ children, elevated = false, style, ...props }) => {
  return (
    <View style={[styles.card, elevated ? GlobalStyles.shadowMd : GlobalStyles.shadowSm, style]} {...props}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: wp(5), // More rounded corners
    padding: wp(5),
    borderWidth: 1,
    borderColor: Colors.borderLight, // Softer border
  },
});
