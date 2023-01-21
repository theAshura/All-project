import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParams } from '@routes/routes.model';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { Colors } from '@namo-workspace/themes';
import TouchableOpacity from '@namo-workspace/ui/view/TouchableOpacity';
import { Body3, Body4 } from '@namo-workspace/ui/Typography';
import { InfoNFT, nftApi, PAGE_LIMIT } from '@namo-workspace/services';
import View from '@namo-workspace/ui/view/View';
import styled from 'styled-components/native';
import NoData from '@containers/common/NoData';
import { ListSkeleton } from '@containers/common/ListSkeleton';
import FastImage from 'react-native-fast-image';
import { useAuth } from '@context/auth';
import { MainTab, ProfileRouter, SearchRouter } from '@routes/routes.constants';

type ViewMoreUserScreenProps = NativeStackNavigationProp<
  HomeStackParams,
  'HOME'
>;

const height = Dimensions.get('window').height * 0.7;

const ViewMoreUser: FC = () => {
  const navigation = useNavigation<ViewMoreUserScreenProps>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [count, setCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [listUser, setListUser] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const { address, isLoggedIn } = useAuth();

  const handleNavigateProfile = (item: InfoNFT) => {
    if (isLoggedIn && address === item.address) {
      navigation.navigate(MainTab.PROFILE_STACK, {
        screen: ProfileRouter.PROFILE,
      });
    } else {
      navigation.navigate(SearchRouter.PUBLIC_PROFILE, {
        rentalAddress: item.address,
      });
    }
  };

  const handleGetList = useCallback(async () => {
    await nftApi
      .fetchListTopUser({
        limit: PAGE_LIMIT,
        page: 1,
      })
      .then((res) => {
        setListUser(res.data);
        setCount(res.count);
        setCurrentPage(res.currentPage);
        setTotalPage(res.totalPage);
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  const handleLoadMore = async () => {
    if (currentPage < totalPage) {
      setLoadingMore(true);
      await nftApi
        .fetchListTopUser({
          page: currentPage + 1,
          limit: 10,
        })
        .then((res) => {
          setListUser(listUser.concat(res.data));
          setCurrentPage(res.currentPage);
          setTotalPage(res.totalPage);
          setLoadingMore(false);
        });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    handleGetList();
  };

  useEffect(() => {
    handleGetList();
  }, [handleGetList]);

  const renderItem = (item) => {
    return (
      <Item key={item.id}>
        <Square alignCenter onPress={() => handleNavigateProfile(item)}>
          <UserAvatar
            source={
              item.avatar
                ? { uri: item.avatar }
                : require('../../assets/images/img_avatar.png')
            }
          />
          <Body4 mb={2} fontWeight="800" center color={Colors.foreground}>
            {item.name}
          </Body4>
        </Square>
      </Item>
    );
  };

  return (
    <Container>
      {listUser.length !== 0 ? (
        <Body3 fontWeight="700" style={{ alignSelf: 'flex-end' }} mb={6} mr={2}>
          {count} items
        </Body3>
      ) : null}
      <FlatList
        data={listUser}
        renderItem={({ item }) => renderItem(item)}
        numColumns={2}
        onEndReached={handleLoadMore}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={() =>
          loading ? (
            <ListSkeleton />
          ) : (
            <ListEmpty>
              <NoData />
            </ListEmpty>
          )
        }
        ListFooterComponent={() =>
          loadingMore ? (
            <Body3
              fontWeight="bold"
              style={{
                textAlign: 'center',
                padding: 8,
                color: Colors.textLevel2,
              }}
            >
              Loading...
            </Body3>
          ) : null
        }
      />
    </Container>
  );
};
export default ViewMoreUser;

const Square = styled(TouchableOpacity)`
  border-radius: 10px;
  border-width: 1px;
  border-color: ${Colors.strokeLevel2};
  margin-horizontal: 15px;
`;

const ListEmpty = styled(View)`
  height: ${height}px;
`;

const Item = styled(View)`
  flex: 0.5;
  align-items: center;
  margin-bottom: 20px;
`;

const Container = styled(View)`
  flex: 1;
  padding: 10px;
`;

const UserAvatar = styled(FastImage)`
  height: 160px;
  border-radius: 8px;
  width: 150px;
  margin: 10px;
  border-width: 1px;
  border-color: ${Colors.strokeLevel2};
`;
