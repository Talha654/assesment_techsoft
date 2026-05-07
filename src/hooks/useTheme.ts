import { useMemo } from 'react';
import { Colors, GlobalStyles, Fonts } from '../constants';

export const useTheme = () => {
  return useMemo(
    () => ({
      colors: Colors,
      styles: GlobalStyles,
      fonts: Fonts,
    }),
    [],
  );
};

export default useTheme;
