import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './index';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['tectsoft-rn://'],
  config: {
    screens: {
      ItemsList: 'items',
      ItemDetail: 'item/:id',
      Login: 'login',
    },
  },
};

export { linking };
