import Config from 'react-native-config';

export const environment = {
  ...Config,
  mainnetChainIdNumber: +Config.mainnetChainIdNumber,
};
