import { defaultAvatar } from '@assets/images';
import { ReactComponent as IcError } from '@assets/images/common/ic_error_red.svg';
import { ReactComponent as IcETH } from '@assets/images/ic-Etherium.svg';
import { ReactComponent as IcCopy } from '@assets/images/profile/ic-bx-copy.svg';
import Duration from '@components/DetailNFT/Duration';
import PropertiesNft from '@components/DetailNFT/PropertiesNft';
import ImageNFT from '@components/ImageNFT';
import ModalConfirm from '@components/Modal/ModalConfirm';
import ModalWaitingMetamask from '@components/Modal/ModalWaitingMetamask';
import { DEFAULT_USERNAME } from '@constants/common';
import { MY_NFT_ROUTES, ROUTES } from '@constants/routes';
import { HeaderCellS } from '@containers/order/order-list/order.styled';
import { useAuth } from '@context/auth';
import { MetamaskError, useWalletAuth } from '@context/wallet-auth';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import useToggle from '@hooks/useToggle';
import { environment } from '@namo-workspace/environments';
import {
  formDateWithoutTime,
  InfoNFT,
  ListNFTResponse,
  nftApi,
  NftVisible,
  Resolution,
  STATUS,
  STATUS_NFT,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
  CollapseItem,
} from '@namo-workspace/ui/Collapse';
import Label from '@namo-workspace/ui/Label';
import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';
import SwitchC from '@namo-workspace/ui/Switch';
import {
  ellipsisCenter,
  ERROR,
  parseWei,
  SUCCESS,
} from '@namo-workspace/utils';
import * as Sentry from '@sentry/react';
import tokenServices from '@services/token.services';
import { toLower } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Facebook, Instagram, List } from 'react-content-loader';
import { AiFillEye, AiFillHeart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import { Table } from 'reactstrap';
import {
  AvatarS,
  ButtonS,
  Container,
  Descriptions,
  DurationDescription,
  DurationWrapper,
  ErrorNoPackageS,
  ErrorNoPackageTextS,
  FavouriteCount,
  FavouriteNftContainer,
  IconViewer,
  InfoItemLabelS,
  InfoItemValue,
  InfoItemValueLinkS,
  InfoItemValueS,
  NameNTF,
  NameUser,
  NftOverviewWrapper,
  Tag,
  TradingDescription,
  WrapButton,
  WrapDuration,
  WrapperUser,
  WrapProperties,
  WrapSwitch,
  WrapTradingHistory,
} from './detailNFT.styled';
import FavouriteButton from './FavouriteButton';
import RecommendNFT from './RecommendNFT';

interface Props {
  isLoading?: boolean;
  infoNFT: InfoNFT | undefined;
  renderCustomAction?: React.ReactNode;
  refetchNft?: () => void;
}

const DetailNFT = ({
  isLoading,
  infoNFT,
  renderCustomAction,
  refetchNft,
}: Props) => {
  const navigate = useNavigate();
  const { account, web3, chainId, metamask } = useWalletAuth();
  const { userInfo, isLoggedIn } = useAuth();

  const { isOpen, open, close } = useToggle();
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [durationSelected, setDurationSelected] = useState<string>();
  const [errorNoPackage, setErrorNoPackage] = useState<boolean>(false);
  const [loadingStopRenting, setLoadingStopRenting] = useState(false);
  const isSmallMobile = useMediaQuery(QUERY.SMALL_MOBILE);
  const isDesktop = useMediaQuery(QUERY.DESKTOP);
  const [recommendNFT, setRecommendNFT] = useState<ListNFTResponse>();
  const refMess = useRef<HTMLDivElement | null>(null);

  const [isFavourite, setIsFavourite] = useState(false);
  const [isOpenConnect, setIsOpenConnect] = useState(false);
  useEffect(() => {
    if (infoNFT?.packages?.length === 1) {
      setDurationSelected(infoNFT.packages[0].id);
    }
  }, [infoNFT]);

  useEffect(() => {
    nftApi
      .fetchListRecommendNFT({
        viewNumber: 'DESC',
        isVisible: true,
      })
      .then((res) => {
        setRecommendNFT(res);
      });
  }, []);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [isLoading]);

  const checkFavouriteNft = useCallback(() => {
    if (isLoggedIn && infoNFT) {
      nftApi.getUserFavouriteNfts().then((res) => {
        setIsFavourite(
          !!res.data.find(
            (nft) =>
              nft.tokenAddress === infoNFT.tokenAddress &&
              nft.tokenId === infoNFT.tokenId
          )
        );
      });
    }
  }, [isLoggedIn, infoNFT]);

  useEffect(() => {
    checkFavouriteNft();
  }, [checkFavouriteNft]);
  //sort DESC
  // const sortHistoryTransaction = useMemo(
  //   () =>
  //     infoNFT?.transactions?.length &&
  //     infoNFT.transactions.sort((item, itemNext) => {
  //       const timeItem: number = new Date(item.updatedAt).getTime();
  //       const timeItemNext: number = new Date(itemNext.updatedAt).getTime();

  //       return timeItemNext - timeItem;
  //     }),
  //   [infoNFT]
  // );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopy(true);
  };

  const triggerValidateDuration = () => {
    if (durationSelected) {
      setErrorNoPackage(false);
      return true;
    }
    setErrorNoPackage(true);
    setTimeout(
      () => refMess.current && isSmallMobile && refMess.current.scrollIntoView()
    );

    return false;
  };

  const handleRentNow = () => {
    if (triggerValidateDuration()) {
      navigate(
        `${ROUTES.NFT}/${infoNFT?.tokenAddress}/${infoNFT?.tokenId}/renting/${durationSelected}`
      );
      // } else {
      //   navigate(ROUTES.LOGIN);
      // }
    }
  };

  const handleSetVisibility = useCallback(
    (checked: boolean) => {
      const params: NftVisible = {
        tokenAddress: infoNFT?.tokenAddress,
        tokenId: infoNFT?.tokenId,
        isVisible: checked,
      };

      nftApi.updateVisible([params]);
    },
    [infoNFT]
  );

  const handleFavourite = useCallback(
    async (isFavourite: boolean) => {
      if (!infoNFT) return;
      if (!isLoggedIn) {
        setIsOpenConnect(true);
        return;
      }
      const { tokenAddress = '', tokenId = '' } = infoNFT;
      await nftApi.setFavouriteNft({ tokenAddress, tokenId, isFavourite });
      refetchNft?.();
    },
    [infoNFT, isLoggedIn, refetchNft]
  );

  const handleStopRenting = useCallback(async () => {
    if (chainId && !environment.mainnetChainId.includes(chainId)) {
      toast.error(ERROR.ER_STOP_RENTING);
      return;
    }
    if (!infoNFT) {
      toast.error(ERROR.ER_STOP_RENTING);
      return;
    }
    if (web3 && account && metamask) {
      try {
        setLoadingStopRenting(true);
        await tokenServices.stopRenting(
          web3,
          infoNFT.contractAddress || environment.namoSmartContract,
          account,
          infoNFT.marketItem || '0'
        );
        setLoadingStopRenting(false);
        navigate('/profile/gallery');
        toast.success(SUCCESS.STOP_RENTING);
      } catch (error) {
        setLoadingStopRenting(false);
        Sentry.captureException(error);
        if ((error as MetamaskError).code === 4001) {
          toast.error(ERROR.ER_DENIED_METAMASK);
        } else if ((error as MetamaskError).message) {
          toast.error((error as MetamaskError).message);
        } else {
          toast.error(ERROR.ER_STOP_RENTING);
        }
      }
    } else {
      toast.error(ERROR.ER_NO_METAMASK);
    }
  }, [account, chainId, infoNFT, navigate, web3, metamask]);

  const renderFavouriteNft = () => {
    if (
      toLower(infoNFT?.rentalAddress) === toLower(userInfo?.address) ||
      toLower(infoNFT?.ownerOf) === toLower(userInfo?.address)
    ) {
      return null;
    }

    return (
      <FavouriteNftContainer>
        <div
          data-tip="Favorite"
          data-place="top"
          data-effect="solid"
          data-for="tooltip-favourite"
        >
          <FavouriteButton
            isFavourite={isFavourite}
            onClick={handleFavourite}
          />
        </div>

        <FavouriteCount className="ms-2 me-4">
          {infoNFT?.favouriteUsersCount || 0}
        </FavouriteCount>
      </FavouriteNftContainer>
    );
  };
  const renderImageNFT = () =>
    isLoading ? (
      <Instagram className="mb-2" />
    ) : (
      <div className="pl-4 pr-4">
        {isDesktop && renderFavouriteNft()}
        <ImageNFT
          className="mb-3 mb-sm-4 pl-4 pr-4"
          infoNFT={infoNFT}
          size={!isDesktop && !isSmallMobile ? Resolution.Low : Resolution.High}
        />
      </div>
    );
  const renderCollInfoNFT = () =>
    isLoading ? (
      <List className="mb-2" />
    ) : (
      <CollapseItem>
        <CollapseHeader targetId="collapse-information">
          Information
        </CollapseHeader>

        <CollapseBody accordionId="collapse-information">
          <div className="d-flex flex-column">
            {infoNFT?.tokenAddress && (
              <div className="d-flex flex-row mb-2 mb-md-3">
                <InfoItemLabelS>Contract Address</InfoItemLabelS>
                <InfoItemValueLinkS
                  onClick={() => handleCopy(infoNFT.tokenAddress || '')}
                >
                  {ellipsisCenter(infoNFT.tokenAddress || '')}
                  <IcCopy
                    data-tip="Copy"
                    data-place="top"
                    data-effect="solid"
                    data-for="tooltip-copy"
                  />
                </InfoItemValueLinkS>
              </div>
            )}

            {infoNFT?.tokenId && (
              <div className="d-flex flex-row mb-2 mb-md-3">
                <InfoItemLabelS>Token ID</InfoItemLabelS>
                <InfoItemValueLinkS
                  onClick={() => handleCopy(infoNFT.tokenId || '')}
                >
                  {ellipsisCenter(infoNFT.tokenId || '')}
                  <IcCopy
                    data-tip="Copy"
                    data-place="top"
                    data-effect="solid"
                    data-for="tooltip-copy"
                  />
                </InfoItemValueLinkS>
              </div>
            )}

            {infoNFT?.contractType && (
              <div className="d-flex flex-row mb-2 mb-md-3">
                <InfoItemLabelS>Token Standard</InfoItemLabelS>
                <InfoItemValueS>{infoNFT.contractType}</InfoItemValueS>
              </div>
            )}

            {infoNFT?.chain && (
              <div className="d-flex flex-row mb-2 mb-md-3">
                <InfoItemLabelS>Blockchain</InfoItemLabelS>
                <InfoItemValueS>{infoNFT.chain}</InfoItemValueS>
              </div>
            )}

            {!infoNFT?.tokenAddress &&
              !infoNFT?.tokenId &&
              !infoNFT?.contractType &&
              !infoNFT?.chain &&
              'No Information'}
          </div>
        </CollapseBody>
      </CollapseItem>
    );

  const renderProperties = () =>
    isLoading ? (
      <List className="mb-2" />
    ) : (
      <CollapseItem>
        <CollapseHeader targetId="collapse-properties">
          Properties
        </CollapseHeader>

        <CollapseBody accordionId="collapse-properties">
          {infoNFT?.metaData?.attributes?.length ? (
            <WrapProperties>
              {infoNFT.metaData.attributes.map((item) => {
                return (
                  <PropertiesNft
                    properties={item}
                    key={`${item.trait_type}${item.value}`}
                  />
                );
              })}
            </WrapProperties>
          ) : (
            'No Properties'
          )}
        </CollapseBody>
      </CollapseItem>
    );
  const renderTradingHistory = () =>
    isLoading ? (
      <List className="mb-2" />
    ) : (
      <WrapTradingHistory>
        <TradingDescription>Trading History</TradingDescription>
        <div className="row-12">
          {infoNFT?.metaData?.attributes?.length ? (
            <Table>
              <tr>
                <HeaderCellS>Rental Period</HeaderCellS>
                <HeaderCellS>Renter</HeaderCellS>
                <HeaderCellS>Price</HeaderCellS>
                <HeaderCellS>Transaction Hash</HeaderCellS>
                <HeaderCellS>Return Transaction Hash</HeaderCellS>
              </tr>
              <tr>
                <td>
                  {infoNFT?.transactions &&
                    infoNFT.transactions.length &&
                    infoNFT.transactions?.map((item) => {
                      return (
                        <InfoItemValue key={item.id}>
                          {formDateWithoutTime(item?.startDate)}-
                          {formDateWithoutTime(item?.endDate)}
                        </InfoItemValue>
                      );
                    })}
                </td>
                <td>
                  {infoNFT?.transactions &&
                    infoNFT.transactions.length &&
                    infoNFT.transactions?.map((item) => {
                      return (
                        <InfoItemValue key={item.id}>
                          {item?.renterName}
                        </InfoItemValue>
                      );
                    })}
                </td>
                <td>
                  {infoNFT?.transactions &&
                    infoNFT.transactions.length &&
                    infoNFT.transactions?.map((item) => {
                      return (
                        <InfoItemValue key={item.id}>
                          <IcETH width={16} height={16} />

                          {parseWei(item?.price)}
                        </InfoItemValue>
                      );
                    })}
                </td>

                <td>
                  {infoNFT?.transactions &&
                    infoNFT.transactions.length &&
                    infoNFT.transactions?.map((item) => {
                      return (
                        <InfoItemValueLinkS
                          key={item.id}
                          onClick={() => handleCopy(infoNFT.tokenAddress || '')}
                        >
                          <div>{ellipsisCenter(item.txHash)}</div>

                          <IcCopy
                            data-tip="Copy"
                            data-place="top"
                            data-effect="solid"
                            data-for="tooltip-copy"
                          />
                        </InfoItemValueLinkS>
                      );
                    })}
                </td>
                <td>
                  {infoNFT?.transactions &&
                    infoNFT.transactions.length &&
                    infoNFT.transactions?.map((item) => {
                      return (
                        <InfoItemValueLinkS
                          key={item.id}
                          onClick={() => handleCopy(infoNFT.tokenAddress || '')}
                        >
                          {item?.renterAddress?.includes(
                            userInfo?.address ? userInfo?.address : ''
                          )
                            ? ellipsisCenter(item?.txHashReturn)
                            : '-'}
                        </InfoItemValueLinkS>
                      );
                    })}
                </td>
              </tr>
            </Table>
          ) : (
            'This NFT has not been rented before'
          )}
        </div>
      </WrapTradingHistory>
    );

  const renderAvatarName = () =>
    isLoading ? (
      <Facebook className="mb-2" />
    ) : (
      <WrapperUser
        className="mb-2"
        to={
          userInfo?.address ===
          (infoNFT?.rentalAddress || infoNFT?.ownerOf)?.toLowerCase()
            ? `${ROUTES.PROFILE}`
            : `${ROUTES.PROFILE_PUBLIC}/${infoNFT?.rentalAddress}`
        }
      >
        <AvatarS image={infoNFT?.avatarOfOwner || defaultAvatar} />

        <NameUser>{infoNFT?.ownerName || DEFAULT_USERNAME}</NameUser>
      </WrapperUser>
    );

  const renderNameNFT = () =>
    isLoading ? (
      <List className="mb-2" />
    ) : (
      <div>
        <NameNTF className="mb-3 mb-md-4">
          {infoNFT?.metaData?.name || infoNFT?.name || DEFAULT_USERNAME}
        </NameNTF>
      </div>
    );

  const renderStatusNFT = () => {
    if (isLoading) return <List className="mb-2" />;

    if (infoNFT?.status && infoNFT?.status !== STATUS_NFT.PROCESSING) {
      return (
        <Tag
          className="mb-3 mb-md-4 mb-3 mt-3"
          colorBg={
            infoNFT.status === STATUS_NFT.FOR_RENT
              ? Colors.primaryGreen
              : infoNFT.status === STATUS_NFT.UNAVAILABLE
              ? Colors.background2
              : Colors.primaryRed
          }
          color={
            infoNFT.status === STATUS_NFT.UNAVAILABLE
              ? Colors.textLevel4
              : Colors.white
          }
          colorBr={
            infoNFT.status === STATUS_NFT.FOR_RENT
              ? Colors.primaryGreen
              : infoNFT.status === STATUS_NFT.UNAVAILABLE
              ? Colors.strokeLevel3
              : Colors.primaryRed
          }
        >
          {STATUS[infoNFT.status as STATUS_NFT]}
        </Tag>
      );
    }

    return null;
  };

  const renderDuration = () => {
    if (isLoading) return <List className="mb-2" />;
    if (infoNFT?.packages?.length) {
      return (
        <WrapDuration className="mb-3 mb-md-4">
          {infoNFT.packages.map((item) => (
            <Duration
              key={item.id}
              duration={item}
              isSelected={durationSelected === item.id}
              onChange={(isSelected) => {
                if (isSelected) {
                  setDurationSelected(item.id);
                  setErrorNoPackage(false);
                } else {
                  setDurationSelected(undefined);
                }
              }}
              disabled={
                infoNFT?.status !== STATUS_NFT.FOR_RENT ||
                userInfo?.address === infoNFT?.rentalAddress?.toLowerCase()
              }
            />
          ))}
        </WrapDuration>
      );
    }

    return (
      <div className="text-center pb-5">
        This NFT has not been set for rent yet.
      </div>
    );
  };

  const renderGroupDuration = () => {
    return (
      <DurationWrapper>
        <DurationDescription>Duration</DurationDescription>
        {renderDuration()}
        {RenderGBtnRent()}
      </DurationWrapper>
    );
  };

  const RenderGBtnRent = () => {
    if (isLoading) return <List className="mb-2" />;
    if (
      userInfo?.address !==
      (infoNFT?.rentalAddress?.toLowerCase() || infoNFT?.ownerOf?.toLowerCase())
    ) {
      if (
        !infoNFT?.status ||
        infoNFT?.status === STATUS_NFT.PROCESSING ||
        infoNFT?.status === STATUS_NFT.UNAVAILABLE
      ) {
        return null;
      }
      return (
        <div className="mb-3 mb-md-4 w-70 d-flex flex-column">
          <ButtonS
            className="mt-3 w-60"
            disabled={infoNFT?.status !== STATUS_NFT.FOR_RENT}
            onClick={handleRentNow}
          >
            Rent now
          </ButtonS>
          {errorNoPackage && (
            <ErrorNoPackageS ref={refMess}>
              <IcError className="me-2" />
              <ErrorNoPackageTextS>
                Please choose a package to rent
              </ErrorNoPackageTextS>
            </ErrorNoPackageS>
          )}
        </div>
      );
    } else {
      if (infoNFT?.status === STATUS_NFT.PROCESSING) {
        return null;
      }

      if (!infoNFT?.status || infoNFT?.status === STATUS_NFT.UNAVAILABLE) {
        return (
          <WrapButton className="my-3 mt-md-0 mb-md-4">
            <Button
              onClick={() =>
                navigate(
                  ROUTES.MY_NFT +
                    `/${infoNFT?.tokenAddress}/${infoNFT?.tokenId}/${MY_NFT_ROUTES.SET_FOR_RENT}`
                )
              }
            >
              Set For Rent
            </Button>
          </WrapButton>
        );
      }
      return (
        <WrapButton className="my-3 mt-md-0 mb-md-4">
          <ButtonS
            color="white"
            disabled={infoNFT?.status === STATUS_NFT.RENTED}
            onClick={open}
          >
            Stop Renting
          </ButtonS>

          <ButtonS
            disabled={infoNFT?.status === STATUS_NFT.RENTED}
            onClick={() =>
              navigate(
                ROUTES.MY_NFT +
                  `/${infoNFT?.tokenAddress}/${infoNFT?.tokenId}/edit`
              )
            }
          >
            Edit
          </ButtonS>
        </WrapButton>
      );
    }
  };

  const renderDescription = () => {
    if (isLoading) return <List className="mb-2" />;
    return (
      <Descriptions>
        {infoNFT?.metaData?.description ||
          infoNFT?.description ||
          'No Description'}
      </Descriptions>
    );
  };

  const renderVisibility = () => {
    if (isLoading) return <List className="mb-2" />;
    if (
      userInfo?.address ===
      (infoNFT?.rentalAddress || infoNFT?.ownerOf)?.toLowerCase()
    ) {
      return (
        <WrapSwitch className="mb-3 mb-md-4">
          <Label label="Set visibility" />
          <SwitchC
            className="d-inline"
            name="isVisibility"
            defaultChecked={infoNFT?.isVisible}
            onClick={handleSetVisibility}
          ></SwitchC>
        </WrapSwitch>
      );
    }

    return null;
  };
  const renderViewer = () => {
    return (
      <div className="d-flex col-8 justify-content-between">
        <div
          style={{ paddingRight: '10px' }}
          className="d-flex align-items-center font-weight-normal"
        >
          <IconViewer>
            <AiFillHeart />
          </IconViewer>
          <div>{infoNFT?.favouriteUsersCount || 0} favorites</div>
        </div>
        <div className="d-flex align-items-center pr-5 font-weight-normal ">
          <IconViewer>
            <AiFillEye />
          </IconViewer>
          <div className="pl-4">{infoNFT?.viewNumber}views</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <MaxWidthContent>
        <Container className="container-fluid p-container py-3">
          {!isDesktop ? (
            <>
              <div>
                <div className="col-12">{renderAvatarName()}</div>

                <div className="text-center ">{renderNameNFT()}</div>
                {renderImageNFT()}
                {renderViewer()}

                <div className="d-flex">
                  {renderFavouriteNft()}
                  <span className="ms-auto">{renderStatusNFT()}</span>
                </div>
                {renderDuration()}
              </div>
              <div>
                <Collapse
                  defaultOpen={[
                    'collapse-description',
                    'collapse-history-rented',
                    'collapse-information',
                    'collapse-properties',
                  ]}
                  stayOpen
                  open=""
                >
                  <CollapseItem>
                    <CollapseHeader targetId="collapse-description">
                      Description
                    </CollapseHeader>

                    <CollapseBody accordionId="collapse-description">
                      <InfoItemLabelS>{renderDescription()}</InfoItemLabelS>
                    </CollapseBody>
                  </CollapseItem>
                  {renderCollInfoNFT()}
                  {renderProperties()}
                  {renderTradingHistory()}
                </Collapse>
              </div>
            </>
          ) : (
            <>
              <div className="row ">
                <NftOverviewWrapper>
                  <div className="col-12">{renderAvatarName()}</div>
                  <div className="d-flex justify-content-between">
                    <div className="col col-6">{renderImageNFT()}</div>
                    <div
                      className="col col-6"
                      style={{ paddingLeft: '40px', paddingTop: '40px' }}
                    >
                      {renderCustomAction ? (
                        // eslint-disable-next-line react/jsx-no-useless-fragment
                        <>{renderCustomAction}</>
                      ) : (
                        <>
                          <div className="d-flex justify-content-between align-items-center">
                            {renderNameNFT()}
                            {renderVisibility()}
                          </div>
                          {renderViewer()}
                          {renderStatusNFT()}
                          {renderDescription()}
                        </>
                      )}
                    </div>
                  </div>
                </NftOverviewWrapper>

                {/* <div
                className="pt-3 pr-4 col col-12 col-md-12 col-lg-12 px-0 ps-md-2 ps-lg-3 mt-0"
                style={{ paddingLeft: '0px !important' }}
              >
                {' '}
                {RenderTradingHistory()}
              </div> */}
              </div>
              <div className="row d-flex">
                <div className="col col-6 p-0 ">
                  <Collapse
                    defaultOpen={[
                      'collapse-information',
                      'collapse-properties',
                    ]}
                    stayOpen
                    open=""
                  >
                    {renderCollInfoNFT()}
                    {renderProperties()}
                  </Collapse>
                </div>
                <div className="col col-6 p-0 ">{renderGroupDuration()}</div>
              </div>
              <div className="row col-12 ">{renderTradingHistory()}</div>
              <div className="row col-12 ">
                <RecommendNFT recommendList={recommendNFT?.data} />
              </div>
            </>
          )}

          <ReactTooltip
            id="tooltip-copy"
            getContent={() => <span>{isCopy ? 'Copied' : 'Copy'}</span>}
            afterHide={() => setIsCopy(false)}
          />
          <ReactTooltip
            id="tooltip-favourite"
            getContent={() => (
              <span>{isFavourite ? 'Unfavorite' : 'Favorite'}</span>
            )}
          />
        </Container>
      </MaxWidthContent>
      <ModalConfirm
        size="small"
        isOpen={isOpen}
        okText="Stop"
        title="Stop Renting"
        description="This process will stop your NFT renting and delete the price you set"
        onOk={handleStopRenting}
        onClose={close}
        isLoading={loadingStopRenting}
      />
      <ModalWaitingMetamask isOpen={loadingStopRenting} />

      <ModalConfirm
        isOpen={isOpenConnect}
        size="small"
        title="Connect Wallet"
        description="You have not connected your MetaMask wallet. Please connect to proceed."
        cancelText="Cancel"
        okText="Continue"
        onClose={() => setIsOpenConnect(false)}
        onOk={() => navigate(ROUTES.LOGIN)}
      />
    </>
  );
};

export default DetailNFT;
