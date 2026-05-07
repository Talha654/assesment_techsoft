import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, wp, hp, GlobalStyles } from '../../constants';
import { AppText, AppButton, AppCard } from '../../components';
import { supabase } from '../../services/supabase';
import { Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ItemsListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ItemsList'>;

interface ItemsListScreenProps {
  navigation: ItemsListNavigationProp;
}

const PAGE_SIZE = 20;
const LAST_VIEWED_KEY = 'last_viewed_item_id';

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
        if (isRefresh) {
          setItems(data);
          setPage(0);
        } else {
          setItems(prev => [...prev, ...data]);
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

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchItems(nextPage);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <AppCard
      elevated
      style={styles.itemCard}
      onTouchEnd={() => navigation.navigate('ItemDetail', { id: item.id })}>
      <View style={GlobalStyles.rowBetween}>
        <View style={{ flex: 1 }}>
          <AppText variant="heading3">{item.name}</AppText>
          <AppText variant="bodySmall" numberOfLines={2} style={GlobalStyles.mt1}>
            {item.description}
          </AppText>
        </View>
        <AppText variant="label" color={Colors.primary}>
          {item.price ? `$${item.price}` : ''}
        </AppText>
      </View>
    </AppCard>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.centerContainer}>
        <AppText variant="heading3">No items found</AppText>
        <AppButton title="Retry" onPress={() => fetchItems(0)} style={GlobalStyles.mt2} size="sm" />
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.centerContainer}>
      <AppText variant="heading3" color={Colors.error}>Oops!</AppText>
      <AppText variant="body" align="center" style={GlobalStyles.mt1}>{error}</AppText>
      <AppButton title="Try Again" onPress={() => fetchItems(0)} style={GlobalStyles.mt2} size="sm" />
    </View>
  );

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={styles.header}>
        <AppText variant="heading2">Explore Items</AppText>
        <TouchableOpacity onPress={signOut}>
          <AppText variant="label" color={Colors.secondary}>Sign Out</AppText>
        </TouchableOpacity>
      </View>

      {lastViewedId && (
        <View style={styles.persistenceBanner}>
          <AppButton
            title="Continue where you left off"
            onPress={() => navigation.navigate('ItemDetail', { id: lastViewedId })}
            variant="ghost"
            size="sm"
          />
        </View>
      )}

      {error ? (
        renderError()
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchItems(0, true)}
              tintColor={Colors.primary}
            />
          }
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
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  persistenceBanner: {
    paddingHorizontal: wp(5),
    marginBottom: hp(1),
  },
  listContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
  },
  itemCard: {
    marginBottom: hp(1.5),
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
