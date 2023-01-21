import React, { useRef, useState, FC, useEffect } from 'react';
import { Dimensions, FlatList } from 'react-native';
import Images from '@images';
import { Colors } from '@namo-workspace/themes';
import styled from 'styled-components/native';
import TouchableOpacity from '@namo-workspace/ui/view/TouchableOpacity';
import View from '@namo-workspace/ui/view/View';
import FastImage from 'react-native-fast-image';
import { Body3, Body4 } from '@namo-workspace/ui/Typography';
import NoData from './NoData';
import { InfoNFT, UserInfo } from '@namo-workspace/services';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import ImageNFT from './ImageNFT';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParams } from '@routes/routes.model';
import { useNavigation } from '@react-navigation/native';
import { MainTab, ProfileRouter, SearchRouter } from '@routes/routes.constants';
import { useAuth } from '@context/auth';
import { parseWei } from '@namo-workspace/utils';
interface Item extends UserInfo, InfoNFT {
  url?: string;
  avatar?: string;
  name?: string;
}

interface CarouselProps {
  data: Array<Item>;
  auto?: boolean;
  isNFT?: boolean;
  arrow?: boolean;
  badge?: boolean;
  isLoading?: boolean;
}

const width = Dimensions.get('window').width;

const { IcPrev, IcNext, IcEthereum, IcTopRank, IcSecondRank, IcThirdRank } =
  Images;
type SearchScreenProps = NativeStackNavigationProp<HomeStackParams, 'HOME'>;

const CustomCarousel: FC<CarouselProps> = ({
  data,
  auto,
  isNFT,
  arrow,
  badge,
  isLoading,
}) => {
  const carouselRef = useRef(null);
  const navigation = useNavigation<SearchScreenProps>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
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

  const toPrevItem = () => {
    if (currentIndex >= 2) {
      setCurrentIndex(currentIndex - 2);
    }
  };

  const toNextItem = () => {
    if (currentIndex < data.length - 3) {
      setCurrentIndex(currentIndex + 2);
    }
  };

  useEffect(() => {
    if (data.length > 0 && arrow) {
      carouselRef.current?.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [arrow, currentIndex, data]);

  const renderBadge = (itemOrder: number) => {
    switch (itemOrder) {
      case 0:
        return <Badge source={IcTopRank} />;
      case 1:
        return <Badge source={IcSecondRank} />;
      case 2:
        return <Badge source={IcThirdRank} />;
      default:
        return (
          <CustomBadge alignCenter justifyCenter>
            <Body3 fontWeight="500" color="rgb(255, 122, 0)">
              {itemOrder + 1}
            </Body3>
          </CustomBadge>
        );
    }
  };

  const renderItem = (item: Item, index: number) => {
    return isNFT ? (
      <Square
        key={item.id}
        activeOpacity={0.7}
        alignCenter
        onPress={() => viewNFTDetail(item)}
      >
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
    ) : (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.7}
        onPress={() => handleNavigateProfile(item)}
      >
        <UserAvatar
          source={
            item.avatar
              ? { uri: item.avatar }
              : require('../../assets/images/img_avatar.png')
          }
        />
        <Body4 mt={2} fontWeight="800" center color={Colors.foreground}>
          {item.name || 'Unnamed'}
        </Body4>
        {badge ? renderBadge(index) : null}
      </TouchableOpacity>
    );
  };
  return (
    <Container mt={6} justifyCenter>
      <FlatList
        ref={carouselRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => renderItem(item, index)}
        ListEmptyComponent={() => (
          <ListEmptyComponent alignCenter>
            {isLoading ? (
              isNFT ? (
                <ContentLoader
                  speed={1}
                  width="100%"
                  height={170}
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ffffff"
                >
                  <Rect x="15" rx="10" ry="10" width="170" height="170" />
                  <Rect x="200" rx="10" ry="10" width="170" height="170" />
                </ContentLoader>
              ) : (
                <ContentLoader
                  speed={1}
                  width="100%"
                  height={100}
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ffffff"
                >
                  <Circle cx="70" cy="50" r="50" />
                  <Circle cx="200" cy="50" r="50" />
                  <Circle cx="330" cy="50" r="50" />
                </ContentLoader>
              )
            ) : (
              <NoData subTitle="" />
            )}
          </ListEmptyComponent>
        )}
      />
      {arrow && data.length > 3 ? (
        <ArrowButton
          hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
          onPress={toPrevItem}
          style={{ position: 'absolute' }}
        >
          <Ic source={IcPrev} />
        </ArrowButton>
      ) : null}
      {arrow && data.length > 3 ? (
        <ArrowButton
          hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
          onPress={toNextItem}
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
          }}
        >
          <Ic source={IcNext} />
        </ArrowButton>
      ) : null}
    </Container>
  );
};

export default CustomCarousel;

export const SearchContainer = styled.View`
  flex: 1;
`;
export const InputSearchContainer = styled.View`
  align-items: center;
  padding: 16px 16px 0 16px;
`;
export const ArrowButton = styled(TouchableOpacity)``;
export const ImageContainer = styled(View)`
  flex: 1;
  justify-content: center;
  margin-horizontal: 5px;
`;
export const ArrowContainer = styled(View)`
  position: absolute;
  width: 100%;
`;
export const Container = styled(View)`
  width: ${width}px;
`;
export const UserAvatar = styled(FastImage)`
  height: 100px;
  border-radius: 50px;
  width: 100px;
  margin-horizontal: 15px;
  border-width: 1px;
  border-color: ${Colors.strokeLevel2};
`;
export const Square = styled(TouchableOpacity)`
  border-radius: 10px;
  border-width: 1px;
  border-color: ${Colors.strokeLevel2};
  margin-horizontal: 15px;
`;

export const BackgroundImage = styled(FastImage)`
  width: 100%;
  height: 100%;
  position: absolute;
`;
export const Dots = styled(View)`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  margin-horizontal: 3px;
`;
export const Ic = styled(FastImage)`
  height: 50px;
  border-radius: 50px;
  width: 50px;
`;
export const Badge = styled(FastImage)`
  height: 33px;
  width: 30px;
  position: absolute;
  margin-left: 15px;
`;
export const CustomBadge = styled(View)`
  width: 28px;
  height: 28px;
  position: absolute;
  border-radius: 14px;
  border-width: 1px;
  margin-left: 15px;
  margin-top: 5.5px;
  border-color: rgb(255, 205, 132);
  background-color: rgb(255, 243, 224);
`;
export const PriceDescription = styled(View)`
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;
export const ListEmptyComponent = styled(View)`
  width: ${width}px;
`;
