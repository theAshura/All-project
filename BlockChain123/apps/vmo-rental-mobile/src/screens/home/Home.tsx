import CustomCarousel from '@containers/common/CustomCarousel';
import { Footer } from '@containers/common/Footer';
import Images from '@images';
import { nftApi } from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import { Body1, Body3 } from '@namo-workspace/ui/Typography';
import TouchableOpacity from '@namo-workspace/ui/view/TouchableOpacity';
import {
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeRouter } from '@routes/routes.constants';
import { HomeStackParams } from '@routes/routes.model';
import ButtonSearch from '@screens/search/ButtonSearch';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {
  ArrowButton,
  ArrowContainer,
  BackgroundImage,
  Container,
  Dots,
  Home,
  Image,
  ImageContainer,
  InputSearchContainer,
} from './Home.styled';

type SearchScreenProps = NativeStackNavigationProp<HomeStackParams, 'HOME'>;

const { IcArrowRight } = Images;
const width = Dimensions.get('window').width;

const SearchScreen: FC = () => {
  const navigation = useNavigation<SearchScreenProps>();
  const { params } = useRoute<RouteProp<ParamListBase>>();
  const keySearch = params?.['keySearch'];
  const [isAuto, setIsAuto] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [topUsers, setTopUsers] = useState([]);
  const [listNFT, setListNFT] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const bannerRef = useRef(null);

  const images = [
    {
      id: 0,
      url: require('../../assets/images/first_banner.png'),
    },
    {
      id: 1,
      url: require('../../assets/images/second_banner.png'),
    },
    { id: 2, url: require('../../assets/images/third_banner.png') },
    {
      id: 3,
      url: require('../../assets/images/fourth_banner.png'),
    },
  ];

  const handleViewMoreNFT = () => {
    navigation.navigate(HomeRouter.VIEW_MORE_NFT);
  };
  const handleViewMoreUser = () => {
    navigation.navigate(HomeRouter.VIEW_MORE_USER);
  };

  const handleGetTopUsers = useCallback(async () => {
    setLoading(true);
    await nftApi.fetchListTopUser({ limit: 10, page: 1 }).then((res) => {
      setTopUsers(res.data);
    });
    await nftApi
      .getTrendingNFT({
        search: '',
        page: 1,
        limit: 10,
      })
      .then((res) => setListNFT(res.data));
    setLoading(false);
  }, []);

  const handleClear = useCallback(() => {
    navigation.setParams({
      keySearch: '',
    });
  }, [navigation]);

  const toNextItem = () => {
    setIsAuto(false);
    bannerRef.current.next();
  };

  const toPrevItem = () => {
    setIsAuto(false);
    bannerRef.current.prev();
  };

  useFocusEffect(
    useCallback(() => {
      handleGetTopUsers();
    }, [])
  );

  const renderDots = (item, index: number) => {
    return (
      <Dots
        key={item.id}
        style={{
          backgroundColor:
            currentIndex === index ? Colors.foreground : Colors.strokeLevel2,
        }}
      />
    );
  };

  return (
    <Home>
      <ScrollView showsVerticalScrollIndicator={false}>
        <InputSearchContainer>
          <ButtonSearch
            placeholder="Search NFTs, Lender name"
            value={keySearch}
            onPress={() =>
              navigation.navigate('NFT_SEARCH', { keySearch: keySearch })
            }
            handleClearValue={handleClear}
          />
        </InputSearchContainer>
        <Container>
          <BackgroundImage
            source={require('../../assets/images/img_first_bg.png')}
          />
          <Container justifyCenter>
            <Carousel
              ref={bannerRef}
              autoPlay={isAuto}
              width={width}
              height={width / 2}
              data={images}
              autoPlayInterval={5000}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }) => (
                <ImageContainer>
                  <Image source={item.url} />
                </ImageContainer>
              )}
            />
            <ArrowContainer justifySpaceBetween alignCenter flexRow>
              <ArrowButton
                hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
                onPress={toPrevItem}
              >
                <IcArrowRight style={{ transform: [{ rotate: '180deg' }] }} />
              </ArrowButton>
              <ArrowButton
                hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
                onPress={toNextItem}
              >
                <IcArrowRight />
              </ArrowButton>
            </ArrowContainer>
          </Container>
          <Container alignCenter mt={4}>
            <FlatList
              horizontal
              data={images}
              renderItem={({ item, index }) => renderDots(item, index)}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </Container>
        </Container>
        <Container px={3} mt={6} flexRow alignCenter justifySpaceBetween>
          <Body1 fontWeight="800" color={Colors.foreground}>
            Top Users
          </Body1>
          <TouchableOpacity onPress={handleViewMoreUser}>
            <Body3 fontWeight="800" color={Colors.primaryOrange}>
              View more
            </Body3>
          </TouchableOpacity>
        </Container>
        <CustomCarousel
          data={topUsers}
          auto={false}
          arrow={true}
          badge={true}
          isLoading={loading}
        />
        <Container px={3} mt={6} flexRow alignCenter justifySpaceBetween>
          <Body1 fontWeight="800" color={Colors.foreground}>
            Trending Now
          </Body1>
          <TouchableOpacity onPress={handleViewMoreNFT}>
            <Body3 fontWeight="800" color={Colors.primaryOrange}>
              View more
            </Body3>
          </TouchableOpacity>
        </Container>
        <CustomCarousel
          isNFT
          auto={false}
          data={listNFT.slice(0, 8)}
          isLoading={loading}
        />
        <Footer />
      </ScrollView>
    </Home>
  );
};
export default SearchScreen;
