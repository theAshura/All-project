import { AuthProvider } from '@context/auth';
import UserInfoProvider from '@context/auth/UserInfoContext';
import Images from '@images';
import { Colors } from '@namo-workspace/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { MainTab, SearchRouter } from '@routes/routes.constants';
import * as Sentry from '@sentry/react-native';
import { navigationService } from '@services/navigation';
import { messageService } from '@services/showMessage';
import { withWalletConnect } from '@walletconnect/react-native-dapp';
import React, { useEffect, useRef } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import codePush from 'react-native-code-push';
import DropdownAlert from 'react-native-dropdownalert';
import SplashScreen from 'react-native-lottie-splash-screen';
import { Host } from 'react-native-portalize';
import NetworkInspector from './containers/__DEV__/NetworkInspector';
import RootRoute from './routes/Root.route';

const { IcSuccess, IcInfo } = Images;

Sentry.init({
  dsn: 'https://593bbcf0775d4d1b9ccb9ade16973e01@o1324755.ingest.sentry.io/6583409',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});
codePush.getUpdateMetadata().then((update) => {
  if (update) {
    Sentry.init({
      dsn: 'https://593bbcf0775d4d1b9ccb9ade16973e01@o1324755.ingest.sentry.io/6583409',
      tracesSampleRate: 1.0,
      release: `${update.appVersion}+codepush:${update.label}`,
      dist: update.label,
    });
  }
});

export const App = () => {
  const isConnected = useRef<boolean>(null);

  useEffect(() => {
    SplashScreen.hide();
    return NetInfo.addEventListener((state) => {
      if (isConnected?.current !== state.isConnected) {
        isConnected.current = state.isConnected;
        if (!state.isConnected) {
          navigationService?.navigator.goBack();
          navigationService?.navigator?.navigate(MainTab.SEARCH_STACK, {
            screen: SearchRouter.NO_INTERNET,
          });
        }
      }
    });
  }, []);

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <Host>
        <AuthProvider>
          <UserInfoProvider>
            <View style={{ flex: 1, backgroundColor: Colors.secondary }}>
              <NetworkInspector />
              <RootRoute />
            </View>
          </UserInfoProvider>
        </AuthProvider>
      </Host>
      <DropdownAlert
        ref={(ref) => {
          messageService.ref = ref;
        }}
        // infoImageSrc={IcInfo}
        successImageSrc={IcInfo}
        warnImageSrc={IcSuccess}
        errorImageSrc={IcSuccess}
        imageStyle={{
          width: 20,
          height: 20,
          alignSelf: 'center',
          resizeMode: 'contain',
        }}
        infoColor={'#FFCF54'}
        closeInterval={5000}
        translucent={true}
      />
    </>
  );
};

export default Sentry.wrap(
  codePush(
    withWalletConnect(App, {
      redirectUrl:
        Platform.OS === 'web' ? window.location.origin : 'namomobile://',
      storageOptions: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        asyncStorage: AsyncStorage as any,
      },
      clientMeta: {
        description: 'Connect with WalletConnect',
        url: 'https://dev.namo.network',
        icons: ['https://dev.namo.network/favicon.ico'],
        name: 'NamoPlatform',
      },
    })
  )
);
