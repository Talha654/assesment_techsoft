import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, GlobalStyles, wp, hp } from '../../constants';
import { supabase } from '../../services/supabase';
import { Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemListItem from '../../components/ItemsList/ItemListItem';
import ItemsListHeader from '../../components/ItemsList/ItemsListHeader';
import EmptyState from '../../components/ItemsList/EmptyState';
import ErrorState from '../../components/ItemsList/ErrorState';
import FooterLoader from '../../components/ItemsList/FooterLoader';
import ContinueBanner from '../../components/ItemsList/ContinueBanner';

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
    AsyncStorage.getItem(LAST_VIEWED_KEY).then(setLastViewedId);
  }, [fetchItems]);

  const navigateToDetail = useCallback((id: string) => {
    navigation.navigate('ItemDetail', { id });
  }, [navigation]);

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

  const renderItem = useCallback(({ item }: { item: Item }) => (
    <ItemListItem item={item} onPress={() => navigateToDetail(item.id)} />
  ), [navigateToDetail]);

  const keyExtractor = useCallback((item: Item) => item.id, []);

  const renderFooter = useCallback(() =>
    loadingMore ? <FooterLoader /> : null,
  [loadingMore]);

  const renderEmpty = useCallback(() => (
    <EmptyState loading={loading} onRefresh={() => fetchItems(0)} />
  ), [loading, fetchItems]);

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={Colors.primary}
    />
  ), [refreshing, handleRefresh]);

  if (error) {
    return (
      <SafeAreaView style={GlobalStyles.safeArea}>
        <ItemsListHeader onLogout={signOut} />
        <ErrorState message={error} onRetry={() => fetchItems(0)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ItemsListHeader onLogout={signOut} />

      {lastViewedId && (
        <ContinueBanner onPress={() => navigateToDetail(lastViewedId)} />
      )}

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: wp(6),
    paddingBottom: hp(5),
  },
});

export default ItemsListScreen;
