import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStackParams } from './routes.model';
import { HomeRouter, SearchRouter } from './routes.constants';
import { Colors } from '@namo-workspace/themes';
import HomeScreen from '@screens/home/Home';
import NoInternet from '@screens/noInternet/NoInternet';
import {
  checkoutRoutes,
  nftDetailRoutes,
  publicProfileRoutes,
} from '@routes/reusableRoutes';
import HeaderLeft from '@containers/navigator/HeaderLeft';
import SearchNFT from '@screens/search/SearchNFT';
import ViewMoreNFT from '@screens/view-more/ViewMoreNFT';
import ViewMoreUser from '@screens/view-more/ViewMoreUser';

const Stack = createNativeStackNavigator<SearchStackParams>();

const HomeStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        orientation: 'portrait',
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerShown: false,
        animationTypeForReplace: 'push',
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.foreground,
        headerShadowVisible: false,
        headerLeft: HeaderLeft,
      }}
      initialRouteName={HomeRouter.HOME}
    >
      <Stack.Screen
        name={HomeRouter.HOME}
        component={HomeScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      {nftDetailRoutes(Stack)}
      {publicProfileRoutes(Stack)}
      {checkoutRoutes(Stack)}
      <Stack.Screen
        name={SearchRouter.NFT_SEARCH}
        component={SearchNFT}
        options={{
          headerShown: false,
          headerBackVisible: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name={HomeRouter.VIEW_MORE_NFT}
        component={ViewMoreNFT}
        options={{
          title: 'Explore NFTs',
          headerShown: true,
          headerLeft: HeaderLeft,
        }}
      />
      <Stack.Screen
        name={HomeRouter.VIEW_MORE_USER}
        component={ViewMoreUser}
        options={{
          title: 'Explore Users',
          headerShown: true,
          headerLeft: HeaderLeft,
        }}
      />
      <Stack.Screen
        name={SearchRouter.NO_INTERNET}
        component={NoInternet}
        options={{
          title: 'NAMO',
          headerShown: true,
          headerLeft: HeaderLeft,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
