import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, wp, hp, GlobalStyles } from '../../constants';
import { AppText, AppButton, AppCard } from '../../components';
import { supabase } from '../../services/supabase';
import { Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Images from '../../constants/Images';

type ItemsListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ItemsList'>;

interface ItemsListScreenProps {
  navigation: ItemsListNavigationProp;
}

const PAGE_SIZE = 20;
const LAST_VIEWED_KEY = 'last_viewed_item_id';

// Memoized Item Component to prevent unnecessary re-renders in FlatList
const ItemListItem = memo(({ item, onPress }: { item: Item; onPress: () => void }) => {
  return (
    <AppCard
      elevated
      style={styles.itemCard}
      onTouchEnd={onPress}>
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
            <AppText variant="heading3" style={{ flex: 1 }} numberOfLines={1}>{item.name}</AppText>
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
  );
});

const ItemsListScreen: React.FC<ItemsListScreenProps> = ({ navigation }) => {
  const { signOut } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [lastViewedId, setLastViewedId] = useState<string | null>(null);

  const fetchItems = useCallback(async (pageNum: number, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (pageNum > 0) setLoadingMore(true);
      else setLoading(true);

      setError(null);

      const { data, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      if (fetchError) throw fetchError;

      if (data) {
        if (pageNum === 0) {
          setItems(data);
          setPage(0);
        } else {
          setItems(prev => {
            const newItems = data.filter(d => !prev.some(p => p.id === d.id));
            return [...prev, ...newItems];
          });
        }
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(0);
    checkLastViewed();
  }, [fetchItems]);

  const checkLastViewed = async () => {
    const id = await AsyncStorage.getItem(LAST_VIEWED_KEY);
    setLastViewedId(id);
  };

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchItems(nextPage);
    }
  }, [loadingMore, hasMore, loading, page, fetchItems]);

  const handleRefresh = useCallback(() => {
    fetchItems(0, true);
  }, [fetchItems]);

  const navigateToDetail = useCallback((id: string) => {
    navigation.navigate('ItemDetail', { id });
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: Item }) => (
    <ItemListItem 
      item={item} 
      onPress={() => navigateToDetail(item.id)} 
    />
  ), [navigateToDetail]);

  const keyExtractor = useCallback((item: Item) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }, [loadingMore]);

  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <AppText variant="body" style={GlobalStyles.mt2}>Loading items...</AppText>
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <AppText variant="heading3">No items found</AppText>
        <AppButton title="Refresh" onPress={() => fetchItems(0)} style={GlobalStyles.mt2} size="sm" variant="outline" />
      </View>
    );
  }, [loading, fetchItems]);

  const renderError = useCallback(() => (
    <View style={styles.centerContainer}>
      <AppText variant="heading3" color={Colors.error}>Oops!</AppText>
      <AppText variant="body" align="center" style={GlobalStyles.mt1}>{error}</AppText>
      <AppButton title="Try Again" onPress={() => fetchItems(0)} style={GlobalStyles.mt2} size="sm" />
    </View>
  ), [error, fetchItems]);

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={Colors.primary}
    />
  ), [refreshing, handleRefresh]);

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={styles.header}>
        <View>
          <AppText variant="heading1">Discover</AppText>
          <AppText variant="bodySmall">Premium selections</AppText>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <AppText variant="label" color={Colors.error}>Log out</AppText>
        </TouchableOpacity>
      </View>

      {lastViewedId && (
        <View style={styles.persistenceBanner}>
          <AppButton
            title="Continue exploring"
            onPress={() => navigateToDetail(lastViewedId)}
            variant="secondary"
            size="sm"
            style={{ borderRadius: wp(10) }}
          />
        </View>
      )}

      {error ? (
        renderError()
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={refreshControl}
        />
      )}
    </SafeAreaView>
  );
};

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
  persistenceBanner: {
    paddingHorizontal: wp(6),
    marginBottom: hp(2),
  },
  listContent: {
    paddingHorizontal: wp(6),
    paddingBottom: hp(5),
  },
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
  footerLoader: {
    paddingVertical: hp(2),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(20),
  },
});

export default ItemsListScreen;
