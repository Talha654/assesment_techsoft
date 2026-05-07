import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, wp, hp, GlobalStyles } from '../../constants';
import { AppText } from '../../components';
import { supabase } from '../../services/supabase';
import { Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getOptimisticFavoriteState } from '../../utils/logic';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppText variant="label" color={Colors.primary}>Back</AppText>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavorite} disabled={toggling}>
          <AppText variant="heading3" color={isFavorite ? Colors.secondary : Colors.textMuted}>
            {isFavorite ? '❤️' : '🤍'}
          </AppText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imagePlaceholder}>
          <AppText variant="hero">📦</AppText>
        </View>

        <View style={styles.info}>
          <View style={GlobalStyles.rowBetween}>
            <AppText variant="heading1" style={{ flex: 1 }}>{item.name}</AppText>
            <AppText variant="heading2" color={Colors.primary}>
              {item.price ? `$${item.price}` : ''}
            </AppText>
          </View>

          <AppText variant="label" style={GlobalStyles.mt3}>Description</AppText>
          <AppText variant="body" style={GlobalStyles.mt1}>
            {item.description}
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  content: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
  },
  imagePlaceholder: {
    width: '100%',
    height: hp(30),
    backgroundColor: Colors.backgroundElevated,
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  info: {
    flex: 1,
  },
});

export default ItemDetailScreen;
