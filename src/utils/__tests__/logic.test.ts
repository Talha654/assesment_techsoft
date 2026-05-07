import { getOptimisticFavoriteState, parseDeepLink } from '../logic';

describe('Logic Utilities', () => {
  describe('Optimistic Favorite Logic', () => {
    it('should flip the favorite state for optimistic update', () => {
      const { nextFavorite, rollbackFavorite } = getOptimisticFavoriteState(false);
      expect(nextFavorite).toBe(true);
      expect(rollbackFavorite).toBe(false);
    });

    it('should provide correct rollback state when currently true', () => {
      const { nextFavorite, rollbackFavorite } = getOptimisticFavoriteState(true);
      expect(nextFavorite).toBe(false);
      expect(rollbackFavorite).toBe(true);
    });
  });

  describe('Deep Link Parser', () => {
    it('should extract ID from valid item deep link', () => {
      const url = 'tectsoft-rn://item/12345';
      const id = parseDeepLink(url);
      expect(id).toBe('12345');
    });

    it('should return null for invalid schemes', () => {
      const url = 'https://example.com/item/123';
      const id = parseDeepLink(url);
      expect(id).toBeNull();
    });

    it('should return null for invalid paths', () => {
      const url = 'tectsoft-rn://user/123';
      const id = parseDeepLink(url);
      expect(id).toBeNull();
    });

    it('should return null if ID is missing', () => {
      const url = 'tectsoft-rn://item/';
      const id = parseDeepLink(url);
      expect(id).toBeNull();
    });
  });
});
