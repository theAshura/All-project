import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParams } from '@routes/routes.model';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import Images from '@images';
import { Colors } from '@namo-workspace/themes';
import TouchableOpacity from '@namo-workspace/ui/view/TouchableOpacity';
import { Body3, Body4 } from '@namo-workspace/ui/Typography';
import { InfoNFT, nftApi } from '@namo-workspace/services';
import View from '@namo-workspace/ui/view/View';
import ImageNFT from '@containers/common/ImageNFT';
import styled from 'styled-components/native';
import NoData from '@containers/common/NoData';
import { ListSkeleton } from '@containers/common/ListSkeleton';
import NftFilter from '@containers/common/NftFilter';
import { useAuth } from '@context/auth';
import { ProfileRouter, SearchRouter } from '@routes/routes.constants';
import { parseWei } from '@namo-workspace/utils';

type ViewMoreNFTScreenProps = NativeStackNavigationProp<
  HomeStackParams,
  'HOME'
>;

const height = Dimensions.get('window').height * 0.7;
const { IcEthereum } = Images;

const valueStatus = [
  { label: 'For rent', value: 'FORRENT' },
  { label: 'Rented', value: 'RENTED' },
  { label: 'Unavailable', value: 'UNAVAILABLE' },
];

const ViewMoreNFT: FC = () => {
  const initialValue = useMemo(
    () => ({
      min: '',
      max: '',
    }),
    []
  );

  const navigation = useNavigation<ViewMoreNFTScreenProps>();
  const { params } = useRoute<RouteProp<ParamListBase>>();
  const keySearch = params?.['keySearch'];
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [count, setCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [listNFT, setListNFT] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const { address, isLoggedIn } = useAuth();

  const viewNFTDetail = (item: InfoNFT) => {
    if (isLoggedIn && address === item.rentalAddress) {
      navigation.navigate(ProfileRouter.NFT_DETAIL_FOR_RENT, {
        // id: item.id,
        tokenAddress: item.tokenAddress,
        tokenId: item.tokenId,
        rentalAddress: item.rentalAddress,
        title: item.name,
      });
    } else {
      navigation.navigate(SearchRouter.NFT_DETAIL, {
        // id: item.id,
        tokenAddress: item.tokenAddress,
        tokenId: item.tokenId,
        rentalAddress: item.rentalAddress,
        title: item.name,
      });
    }
  };

  const handleGetList = useCallback(async () => {
    await nftApi
      .getTrendingNFT({
        search: keySearch,
        page: 1,
        limit: 10,
      })
      .then((res) => {
        setListNFT(res.data);
        setCount(res.count);
        setCurrentPage(res.currentPage);
        setTotalPage(res.totalPage);
        setLoading(false);
        setRefreshing(false);
      });
  }, [keySearch]);

  const handleLoadMore = async () => {
    if (currentPage < totalPage) {
      setLoadingMore(true);
      await nftApi
        .getTrendingNFT({
          search: keySearch,
          page: currentPage + 1,
          limit: 10,
        })
        .then((res) => {
          setListNFT(listNFT.concat(res.data));
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
        <Square alignCenter onPress={() => viewNFTDetail(item)}>
          <ImageNFT detailNft={item} size={150} style={{ margin: 10 }} />
          <Body4 fontWeight="800" center color={Colors.foreground}>
            {item?.metaData?.name || 'Unnamed'}
          </Body4>
          <PriceDescription flexRow alignCenter justifyCenter pa={1.5} pb={2.5}>
            <IcEthereum width={20} height={20} />
            <Body4 ml={1} fontWeight="800" center color={Colors.foreground}>
              {item?.packageDurationMin
                ? `${parseWei(item?.packageDurationMin?.price)}/${
                    item?.packageDurationMin?.label
                  }`
                : '-/-'}
            </Body4>
          </PriceDescription>
        </Square>
      </Item>
    );
  };

  return (
    <Container>
      {listNFT.length !== 0 ? (
        <Body3 fontWeight="700" style={{ alignSelf: 'flex-end' }} mb={6} mr={2}>
          {count} items
        </Body3>
      ) : null}
      <FlatList
        data={listNFT}
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
      <NftFilter
        initialValue={initialValue}
        hidden={listNFT.length === 0}
        valueStatus={valueStatus}
        onSubmit={() => console.log('Submitted')}
        onReset={() => console.log('Reset')}
      />
    </Container>
  );
};
export default ViewMoreNFT;

export const Square = styled(TouchableOpacity)`
  border-radius: 10px;
  border-width: 1px;
  border-color: ${Colors.strokeLevel2};
  margin-horizontal: 15px;
`;

export const PriceDescription = styled(View)`
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

export const ListEmpty = styled(View)`
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
