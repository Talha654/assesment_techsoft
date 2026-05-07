import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, wp, hp, GlobalStyles } from '../../constants';
import { AppText, AppButton } from '../../components';
import { supabase } from '../../services/supabase';
import { Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getOptimisticFavoriteState } from '../../utils/logic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Images from '../../constants/Images';

type ItemDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ItemDetail'>;

const LAST_VIEWED_KEY = 'last_viewed_item_id';

const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchItem();
    saveLastViewed();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setItem(data);

      if (user) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_id', id);
        
        setIsFavorite(!!favData && favData.length > 0);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const saveLastViewed = async () => {
    await AsyncStorage.setItem(LAST_VIEWED_KEY, id);
  };

  const toggleFavorite = async () => {
    if (!user || toggling) return;

    const { nextFavorite, rollbackFavorite } = getOptimisticFavoriteState(isFavorite);
    setIsFavorite(nextFavorite);
    setToggling(true);

    try {
      if (nextFavorite) {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, item_id: id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', id);
        if (error) throw error;
      }
    } catch (err: any) {
      setIsFavorite(rollbackFavorite);
      Alert.alert('Update Failed', 'Could not update favorites. Please try again.');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!item) return null;

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: item.image_url || Images.defaultItem }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          <View style={styles.headerOverlay}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                <AppText variant="heading2">{'<'}</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFavorite} disabled={toggling} style={styles.iconButton}>
                <AppText variant="heading3" color={isFavorite ? Colors.error : Colors.textSecondary}>
                  {isFavorite ? '❤️' : '🤍'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={GlobalStyles.rowBetween}>
            <AppText variant="heading1" style={{ flex: 1, marginRight: wp(4) }}>{item.name}</AppText>
            <AppText variant="hero" color={Colors.primary}>
              {item.price ? `$${item.price}` : ''}
            </AppText>
          </View>

          <View style={styles.divider} />

          <AppText variant="label" style={styles.sectionTitle}>Description</AppText>
          <AppText variant="body" style={styles.descriptionText}>
            {item.description}
          </AppText>
          
          {/* Add some dummy content to make the page look fuller */}
          <AppText variant="label" style={[styles.sectionTitle, GlobalStyles.mt3]}>Features</AppText>
          <AppText variant="body" style={styles.descriptionText}>
            • Premium quality materials{'\n'}
            • Designed for ultimate comfort{'\n'}
            • 1-year warranty included
          </AppText>
        </View>
      </ScrollView>

      <SafeAreaView style={styles.bottomBar}>
        <AppButton title="Add to Cart" onPress={() => Alert.alert('Added', `${item.name} added to cart!`)} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  heroContainer: {
    width: '100%',
    height: hp(45),
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: hp(5),
    left: 0,
    right: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingTop: hp(1), // Fallback if SafeAreaView doesn't add enough top padding
  },
  iconButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...GlobalStyles.shadowSm,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: wp(8),
    borderTopRightRadius: wp(8),
    marginTop: -wp(8), // Overlap with image
    paddingHorizontal: wp(6),
    paddingTop: hp(4),
    paddingBottom: hp(12), // Space for bottom bar
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: hp(3),
  },
  sectionTitle: {
    color: Colors.textMuted,
    marginBottom: hp(1),
  },
  descriptionText: {
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...GlobalStyles.shadowMd,
  },
});

export default ItemDetailScreen;
