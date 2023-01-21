import { NFT_STATUS, STATUS } from '@constants/rent';
import ImageNFT from '@containers/common/ImageNFT';
import { useAuth } from '@context/auth';
import { useUserInfo } from '@context/auth/UserInfoContext';
import Images from '@images';
import {
  convertPricePerDay,
  formDateWithoutTime,
  InfoNFT,
  nftApi,
  Packages,
  parseMetaDataToMoralis,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { toLower, upperCase } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, ScrollView, Switch } from 'react-native';
import Collapsible from 'react-native-collapsible';
import {
  MainTab,
  ProfileRouter,
  SearchRouter,
} from '../../routes/routes.constants';
import { SearchStackParams } from '../../routes/routes.model';
import {
  Avatar,
  ContentContainer,
  CopyField,
  CopyToast,
  DetailContainer,
  Duration,
  DurationText,
  DurationValue,
  ErrorField,
  FooterContainer,
  GroupNFTAction,
  HeaderMore,
  HistoryBox,
  ImageAvatar,
  LenderContainer,
  LenderName,
  NFTAction,
  NFTActionName,
  NFTActionTitle,
  NFTHeader,
  NFTHeaderText,
  NFTItem,
  NFTLabel,
  NFTName,
  NFTValue,
  NFTValueInfo,
  NFTValueText,
  Price,
  PriceLabel,
  PricePerDay,
  Status,
  StatusText,
  SwitchContainer,
  Total,
  Visibility,
  WrapPrice,
} from './NFTDetail.style';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import CustomCarousel from '@containers/common/CustomCarousel';
import FastImage from 'react-native-fast-image';
import TouchableOpacity from '@namo-workspace/ui/view/TouchableOpacity';
import environment from 'react-native-config';

const {
  IcArrowDown,
  IcCopy,
  IcEthereum,
  IcArrowUp,
  IcError,
  IcFavourite,
  IcUnfavourite,
} = Images;

export type NFTDetailContainerProp = NativeStackNavigationProp<
  SearchStackParams,
  'NFT_DETAIL'
>;

const handleTail = (val: string) => {
  if (!val || val?.length < 15) return val;
  return `${val.slice(0, 6)}...${val.slice(val.length - 4, val.length)}`;
};

const { width } = Dimensions.get('window');
const margin = 16;
const IMAGE_SIZE = width - margin * 2;

const NFTDetailContainer = () => {
  const navigation = useNavigation<NFTDetailContainerProp>();
  const routes = navigation.getParent()?.getState();

  const prevRoute = routes?.routeNames?.[routes?.index];
  const [listMore, setListMore] = useState([]);
  const { params } = useRoute<RouteProp<ParamListBase & InfoNFT>>();
  const tokenAddress: string = params['tokenAddress'];
  const tokenId: string = params['tokenId'];
  const rentalAddress: string = params['rentalAddress'];
  const { address, isLoggedIn } = useAuth();
  const [isCollapse, setIsCollapse] = useState({
    info: false,
    property: false,
    description: false,
    rent: false,
    transactions: false,
  });

  const [detail, setDetail] = useState<InfoNFT>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chooseDuration, setChooseDuration] = useState<Packages>({
    duration: 0,
    label: '',
    price: 0,
    id: '',
    unitId: '',
    orderNumber: '',
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [copy, setCopy] = useState(false);
  const { userInfo } = useUserInfo();
  const [error, setError] = useState<boolean>(false);
  const scrollViewRef = useRef(null);

  const [addressCopied, setAddressCopied] = useState<string>('');
  const [favourite, setFavourite] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const nftInfo = useMemo(() => {
    if (!detail) {
      return null;
    }
    return [
      {
        id: '1',
        label: 'Contract Address',
        value: detail.tokenAddress || '',
      },
      { id: '2', label: 'Token ID', value: detail.tokenId || '' },
      { id: '3', label: 'Token Standard', value: detail.contractType || '' },
      { id: '4', label: 'Blockchain', value: detail.chain },
    ];
  }, [detail]);

  const GroupNFTAttributes = useMemo(() => {
    if (!detail) {
      return null;
    }
    const attributesMetaData = detail.metaData?.attributes;
    if (!attributesMetaData) return;
    if (attributesMetaData && Array.isArray(attributesMetaData)) {
      return attributesMetaData.map((item, index) => {
        return (
          <NFTAction key={index}>
            <NFTActionTitle fontWeight="500">
              {upperCase(item.trait_type)}
            </NFTActionTitle>
            <NFTActionName fontWeight="600">{item.value}</NFTActionName>
          </NFTAction>
        );
      });
    } else if (typeof attributesMetaData === 'object') {
      return Object.entries(attributesMetaData).map(([key, value], index) => {
        return (
          <NFTAction key={index}>
            <NFTActionTitle fontWeight="500">{upperCase(key)}</NFTActionTitle>
            <NFTActionName fontWeight="600">{value}</NFTActionName>
          </NFTAction>
        );
      });
    }
  }, [detail]);

  const handleFavourite = () => {
    setFavourite(!favourite);
    if (favourite) {
      setCount(count - 1);
    } else setCount(count + 1);
    nftApi
      .setFavouriteNft({
        tokenAddress: detail.tokenAddress,
        tokenId: detail.tokenId,
        isFavourite: !favourite,
      })
      .then(() => {
        setFavourite(!favourite);
        nftApi
          .getNftDetail({
            tokenAddress,
            tokenId,
            chainId: +environment.mainnetChainIdNumber,
          })
          .then((res) => setCount(res.data.favouriteUsersCount));
      })
      .catch((err) => {
        setFavourite(favourite);
        setCount(count);
      });
  };

  const handleVisible = () => {
    setIsEnabled(!isEnabled);
    nftApi.updateVisible([
      {
        isVisible: isEnabled,
        tokenAddress: detail.tokenAddress,
        tokenId: detail.tokenId,
      },
    ]);
  };

  const handleFindNFT = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await nftApi.getNftDetail({
        tokenAddress,
        tokenId,
        chainId: +environment.mainnetChainIdNumber,
      });
      setCount(res.data.favouriteUsersCount);
      setDetail(await parseMetaDataToMoralis(res.data));
      await nftApi
        .fetchListNFT({
          viewNumber: 'DESC',
          isVisible: true,
          limit: 8,
          rentalAddress: rentalAddress,
        })
        .then((res) => setListMore(res.data));
    } finally {
      setIsLoading(false);
    }
  }, [rentalAddress, tokenAddress, tokenId]);

  const handleCollapse = (type: string) => {
    const isCollapseTemp = {};
    isCollapseTemp[type] = !isCollapse[type];
    setIsCollapse({ ...isCollapse, ...isCollapseTemp });
  };

  const handleCopyAddress = (value: string) => {
    setAddressCopied(value);
    Clipboard.setString(value);
    setCopy(!copy);
  };

  const handleNavigateProfile = () => {
    if (isLoggedIn && address === detail.rentalAddress) {
      navigation.navigate(MainTab.PROFILE_STACK, {
        screen: ProfileRouter.PROFILE,
      });
    } else {
      navigation.navigate(SearchRouter.PUBLIC_PROFILE, {
        rentalAddress: detail.rentalAddress,
      });
    }
  };

  const handleChooseDuration = (item: Packages) => {
    setChooseDuration(item);
    setError(false);
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      if (chooseDuration.duration === 0) {
        setError(true);
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      } else {
        navigation.navigate(SearchRouter.CHECKOUT, {
          detail: JSON.stringify(detail),
          chooseDuration: chooseDuration,
        });
      }
    } else
      navigation.navigate(MainTab.PROFILE_STACK, {
        screen: ProfileRouter.PROFILE,
        params: {
          previousRoute: prevRoute,
          tokenId: detail.tokenId,
          tokenAddress: detail.tokenAddress,
          prevUser: detail.rentalAddress,
          title: detail.metaData?.name
            ? detail.metaData?.name
            : detail.metadata
            ? JSON.parse(detail.metadata)?.name
            : 'Unnamed',
        },
      });
  };

  const checkFavouriteNft = useCallback(() => {
    if (isLoggedIn && detail) {
      nftApi.getUserFavouriteNfts().then((res) => {
        setFavourite(
          !!res.data.find(
            (nft) =>
              nft.tokenAddress === detail.tokenAddress &&
              nft.tokenId === detail.tokenId
          )
        );
      });
    }
  }, [isLoggedIn, detail]);

  useFocusEffect(
    useCallback(() => {
      handleFindNFT();
    }, [handleFindNFT])
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (copy) {
        setCopy(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [copy]);

  useEffect(() => {
    if (
      detail &&
      Array.isArray(detail.packages) &&
      detail.packages.length === 1
    ) {
      setChooseDuration(detail.packages[0]);
    }
  }, [detail]);

  useEffect(() => {
    if (
      detail &&
      userInfo &&
      toLower(detail.rentalAddress) === toLower(userInfo.address)
    ) {
      navigation.replace(ProfileRouter.NFT_DETAIL_FOR_RENT, {
        tokenId: detail.tokenId,
        tokenAddress: detail.tokenAddress,
        title: detail.metaData?.name
          ? detail.metaData?.name
          : detail.metadata
          ? JSON.parse(detail.metadata)?.name
          : 'Unnamed',
      });
    }
  }, [detail, navigation, userInfo]);

  useEffect(() => {
    checkFavouriteNft();
  }, [checkFavouriteNft]);

  const renderGroupActions = () => (
    <FooterContainer>
      {userInfo?.address === detail?.rentalAddress ? (
        <Visibility>
          <PriceLabel color={Colors.textLevel1} fontSize={14} fontWeight="700">
            Set Visibility
          </PriceLabel>
          <SwitchContainer
            style={
              isEnabled
                ? { backgroundColor: Colors.primaryOrange }
                : { backgroundColor: Colors.border }
            }
          >
            <Switch
              trackColor={{ false: Colors.border, true: Colors.primaryOrange }}
              thumbColor={Colors.white}
              onValueChange={handleVisible}
              value={isEnabled}
              disabled={userInfo?.address !== detail?.rentalAddress}
            />
          </SwitchContainer>
        </Visibility>
      ) : null}
      <Button
        size="medium"
        full
        onPress={handleCheckout}
        disabled={
          detail?.status === NFT_STATUS.PROCESSING ||
          detail?.status === NFT_STATUS.RENTED ||
          detail?.status === NFT_STATUS.ORDERED
        }
      >
        Rent Now
      </Button>
    </FooterContainer>
  );
  return isLoading ? (
    <ContentLoader
      speed={1}
      height="100%"
      backgroundColor="#f3f3f3"
      foregroundColor="#ffffff"
      style={{ marginHorizontal: 16 }}
    >
      <Rect y="56" rx="6" ry="6" width="100%" height="360" />
      <Rect y="450" rx="4" ry="4" width="100%" height="60" />
      <Circle cx="15" cy="30" r="15" />
    </ContentLoader>
  ) : (
    <DetailContainer>
      <ScrollView ref={scrollViewRef} showsHorizontalScrollIndicator={false}>
        {error ? (
          <ErrorField>
            <IcError />
            <PriceLabel
              fontWeight="500"
              fontSize={14}
              color={Colors.textLevel2}
              ml={2.5}
            >
              Please choose a package to rent
            </PriceLabel>
          </ErrorField>
        ) : null}
        <TouchableOpacity onPress={handleNavigateProfile}>
          <LenderContainer>
            {detail?.avatarOfOwner ? (
              <Avatar
                source={{ uri: detail?.avatarOfOwner }}
                resizeMode="cover"
              />
            ) : (
              <ImageAvatar
                source={require('../../assets/images/img_avatar.png')}
              />
            )}
            <LenderName>{detail?.ownerName || 'Unnamed'}</LenderName>
          </LenderContainer>
        </TouchableOpacity>
        <PriceLabel
          fontWeight="800"
          color={Colors.textLevel3}
          style={{ textAlign: 'right', marginRight: 16, marginBottom: 16 }}
        >
          {detail?.viewNumber} views
        </PriceLabel>
        <ImageNFT
          detailNft={detail}
          size={IMAGE_SIZE}
          borderRadius={16}
          style={{ marginHorizontal: 16 }}
        />
        <Total>
          {STATUS[detail?.status] === STATUS.UNAVAILABLE ? (
            <WrapPrice />
          ) : (
            <TouchableOpacity flexRow alignCenter onPress={handleFavourite}>
              {favourite ? (
                <FastImage
                  source={IcFavourite}
                  style={{ width: 20, height: 18 }}
                />
              ) : (
                <FastImage
                  source={IcUnfavourite}
                  style={{ width: 22, height: 22 }}
                />
              )}
              <PriceLabel ml={1.5} fontWeight="800" color={Colors.textLevel3}>
                {count} favorites
              </PriceLabel>
            </TouchableOpacity>
          )}
          {detail?.status && detail.status !== NFT_STATUS.PROCESSING && (
            <Status status={STATUS[detail?.status]}>
              <StatusText fontWeight="600" status={STATUS[detail?.status]}>
                {STATUS[detail?.status]}
              </StatusText>
            </Status>
          )}
        </Total>

        {detail?.packages
          ? detail?.packages.map((item: Packages) => (
              <Duration
                key={item.id}
                onPress={() => handleChooseDuration(item)}
                disabled={
                  detail?.status === NFT_STATUS.RENTED ||
                  detail?.status === NFT_STATUS.ORDERED
                }
                style={
                  item === chooseDuration
                    ? {
                        borderColor: Colors.primaryOrange,
                        backgroundColor: Colors.secondary,
                      }
                    : {
                        backgroundColor: Colors.white,
                        borderColor: Colors.strokeLevel3,
                      }
                }
              >
                <WrapPrice style={{ marginBottom: 4 }}>
                  <IcEthereum width={20} height={20} />
                  <Price fontWeight="600">
                    {' '}
                    {item?.price / Math.pow(10, 18)}
                  </Price>
                  <PricePerDay>
                    (
                    {convertPricePerDay(
                      item?.price / Math.pow(10, 18),
                      item?.duration
                    )}
                    /day)
                  </PricePerDay>
                </WrapPrice>
                <DurationText>
                  Rental Duration:{' '}
                  <DurationValue fontWeight="600">{item.label}</DurationValue>
                </DurationText>
              </Duration>
            ))
          : null}

        <NFTName fontWeight="700" mt={2}>
          {detail?.metaData?.name
            ? detail?.metaData?.name
            : detail?.metadata
            ? JSON.parse(detail?.metadata)?.name
            : 'Unnamed'}
        </NFTName>
        <NFTHeader
          onPress={() => handleCollapse('info')}
          isCollapse={isCollapse.info}
        >
          <NFTHeaderText fontWeight="700">Information</NFTHeaderText>
          {isCollapse.info ? <IcArrowDown /> : <IcArrowUp />}
        </NFTHeader>
        <Collapsible collapsed={isCollapse.info}>
          <ContentContainer>
            {nftInfo?.map((item, index) => (
              <NFTItem key={item.id}>
                <NFTLabel ellipsizeMode={'tail'} fontWeight="500">
                  {item.label}
                </NFTLabel>
                <NFTValue onPress={() => handleCopyAddress(item.value)}>
                  <NFTValueText isBlue={index < 2}>
                    {handleTail(item.value)}
                  </NFTValueText>
                  {index < 2 && item?.value?.length ? <IcCopy /> : null}
                  {index < 2 &&
                  item?.value?.length &&
                  copy &&
                  item.value === addressCopied ? (
                    <CopyToast>
                      <PriceLabel
                        fontWeight="400"
                        fontSize={14}
                        color={Colors.white}
                      >
                        Copied
                      </PriceLabel>
                    </CopyToast>
                  ) : null}
                </NFTValue>
              </NFTItem>
            ))}
          </ContentContainer>
        </Collapsible>

        <NFTHeader
          onPress={() => handleCollapse('property')}
          isCollapse={isCollapse.property}
        >
          <NFTHeaderText fontWeight="700">Properties</NFTHeaderText>
          {isCollapse.property ? <IcArrowDown /> : <IcArrowUp />}
        </NFTHeader>

        <Collapsible collapsed={isCollapse.property}>
          {detail?.metaData?.attributes ? (
            <GroupNFTAction>{GroupNFTAttributes}</GroupNFTAction>
          ) : (
            <NFTValueInfo>No Properties</NFTValueInfo>
          )}
        </Collapsible>

        <NFTHeader
          onPress={() => handleCollapse('description')}
          isCollapse={isCollapse.description}
        >
          <NFTHeaderText fontWeight="700">Description</NFTHeaderText>
          {isCollapse.description ? <IcArrowDown /> : <IcArrowUp />}
        </NFTHeader>
        <Collapsible collapsed={isCollapse.description}>
          <NFTValueInfo>
            {detail?.metaData?.description || 'No Description'}
          </NFTValueInfo>
        </Collapsible>

        <NFTHeader
          onPress={() => handleCollapse('transactions')}
          isCollapse={isCollapse.description}
        >
          <NFTHeaderText fontWeight="700">Trading History</NFTHeaderText>
          {isCollapse.transactions ? <IcArrowDown /> : <IcArrowUp />}
        </NFTHeader>

        <Collapsible collapsed={isCollapse.transactions}>
          {detail &&
          detail?.transactions &&
          Array.isArray(detail?.transactions) &&
          detail?.transactions.length !== 0 ? (
            <ContentContainer>
              {detail?.transactions
                ?.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                .map((item) => (
                  <HistoryBox key={item.id}>
                    <NFTItem>
                      <NFTLabel fontWeight="500">Rental Period</NFTLabel>
                      <CopyField disabled={true}>
                        <PriceLabel
                          color={Colors.textLevel3}
                          style={{ textAlign: 'right' }}
                        >
                          {formDateWithoutTime(item.startDate)} -{' '}
                          {formDateWithoutTime(item.endDate)}
                        </PriceLabel>
                      </CopyField>
                    </NFTItem>
                    <NFTItem>
                      <NFTLabel fontWeight="500">Renter</NFTLabel>
                      <PriceLabel
                        color={Colors.textLevel3}
                        style={{ textAlign: 'right' }}
                      >
                        {item.renterName ?? 'Unnamed'}
                      </PriceLabel>
                    </NFTItem>
                    <NFTItem>
                      <NFTLabel fontWeight="500">Price</NFTLabel>
                      <CopyField disabled={true}>
                        <IcEthereum width={20} height={20} />
                        <PriceLabel fontWeight="600" color={Colors.textLevel2}>
                          {' '}
                          {item?.price / Math.pow(10, 18)}
                        </PriceLabel>
                      </CopyField>
                    </NFTItem>
                    <NFTItem>
                      <NFTLabel fontWeight="500">Transaction Hash</NFTLabel>
                      <CopyField onPress={() => handleCopyAddress(item.txHash)}>
                        <PriceLabel
                          fontWeight="400"
                          color={Colors.blue}
                          style={{ textAlign: 'right' }}
                        >
                          {handleTail(item.txHash)}{' '}
                        </PriceLabel>
                        <IcCopy />
                      </CopyField>
                      {copy && item.txHash === addressCopied ? (
                        <CopyToast>
                          <PriceLabel
                            fontWeight="400"
                            fontSize={14}
                            color={Colors.white}
                          >
                            Copied
                          </PriceLabel>
                        </CopyToast>
                      ) : null}
                    </NFTItem>
                    {isLoggedIn &&
                      address?.toLowerCase() ===
                        detail?.rentalAddress?.toLowerCase() &&
                      item.txHashReturn && (
                        <NFTItem>
                          <NFTLabel fontWeight="500">
                            Return Transaction Hash
                          </NFTLabel>
                          <CopyField
                            onPress={() => handleCopyAddress(item.txHashReturn)}
                          >
                            <PriceLabel
                              fontWeight="400"
                              color={Colors.blue}
                              style={{ textAlign: 'right' }}
                            >
                              {handleTail(item.txHashReturn)}{' '}
                            </PriceLabel>
                            <IcCopy />
                          </CopyField>
                          {copy && item.txHashReturn === addressCopied ? (
                            <CopyToast>
                              <PriceLabel
                                fontWeight="400"
                                fontSize={14}
                                color={Colors.white}
                              >
                                Copied
                              </PriceLabel>
                            </CopyToast>
                          ) : null}
                        </NFTItem>
                      )}
                  </HistoryBox>
                ))}
            </ContentContainer>
          ) : (
            <NFTValueInfo>This NFT has not been rented before.</NFTValueInfo>
          )}
        </Collapsible>
        <HeaderMore pb={4}>
          <NFTHeaderText pa={4} pb={1} fontWeight="700">
            More from this store
          </NFTHeaderText>
          <CustomCarousel isNFT auto={false} data={listMore} />
        </HeaderMore>
      </ScrollView>
      {detail?.status !== NFT_STATUS.UNAVAILABLE && renderGroupActions()}
    </DetailContainer>
  );
};
export default NFTDetailContainer;
