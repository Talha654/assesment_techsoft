import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AppCard, AppText } from '../index';
import { Colors, GlobalStyles, wp, hp } from '../../constants';
import Images from '../../constants/Images';
import { Item } from '../../types';

interface ItemListItemProps {
  item: Item;
  onPress: () => void;
}

const ItemListItem = memo(({ item, onPress }: ItemListItemProps) => (
  <AppCard elevated style={styles.itemCard} onTouchEnd={onPress}>
    <View style={GlobalStyles.row}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_url || Images.defaultItem }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.itemContent}>
        <View style={GlobalStyles.rowBetween}>
          <AppText variant="heading3" style={{ flex: 1 }} numberOfLines={1}>
            {item.name}
          </AppText>
          <AppText variant="heading3" color={Colors.primary}>
            {item.price ? `$${item.price}` : ''}
          </AppText>
        </View>
        <AppText variant="bodySmall" numberOfLines={2} style={GlobalStyles.mt1}>
          {item.description}
        </AppText>
      </View>
    </View>
  </AppCard>
));

const styles = StyleSheet.create({
  itemCard: {
    marginBottom: hp(2),
    padding: wp(3),
  },
  imageContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(3),
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
    marginRight: wp(4),
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ItemListItem;
