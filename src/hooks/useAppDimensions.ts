import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface AppDimensions {
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
  wp: (percent: number) => number;
  hp: (percent: number) => number;
}

export const useAppDimensions = (): AppDimensions => {
  const [dimensions, setDimensions] = useState<ScaledSize>(
    Dimensions.get('window'),
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;

  return {
    width,
    height,
    isPortrait: height >= width,
    isLandscape: width > height,
    wp: (percent: number) => (width * percent) / 100,
    hp: (percent: number) => (height * percent) / 100,
  };
};

export default useAppDimensions;
