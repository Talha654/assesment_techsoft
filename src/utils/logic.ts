export interface FavoriteState {
  isFavorite: boolean;
  isError: boolean;
}

export const getOptimisticFavoriteState = (
  currentFavorite: boolean,
): { nextFavorite: boolean; rollbackFavorite: boolean } => {
  return {
    nextFavorite: !currentFavorite,
    rollbackFavorite: currentFavorite,
  };
};

export const parseDeepLink = (url: string): string | null => {
  if (!url.startsWith('tectsoft-rn://item/')) return null;
  const id = url.split('tectsoft-rn://item/')[1];
  return id || null;
};
