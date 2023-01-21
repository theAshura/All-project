import { defaultAvatar } from '@assets/images';
import { ReactComponent as IcTick } from '@assets/images/common/ic_tick.svg';
import { ReactComponent as IcETH } from '@assets/images/ic-Etherium.svg';
import ImageNFT from '@components/ImageNFT';
import { DEFAULT_USERNAME } from '@constants/common';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import {
  InfoNFT,
  NftVisible,
  parseMetaDataToMoralis,
  Resolution,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import { parseWei } from '@namo-workspace/utils';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import {
  AvatarUser,
  BoxSelect,
  ContainerNFT,
  DotVisible,
  LinkS,
  NameItem,
  PriceItem,
  UserName,
  WrapIcon,
  WrapInfoUser,
  WrapperInfo,
  WrapperNFT,
} from './listNFT.styled';

interface NftCardProps {
  to: string;
  className: string;
  nft: InfoNFT;
  onHandleSelected?: (selected: boolean, nft: NftVisible) => void;
  isSetVisibility?: boolean;
  isSelectedAll?: boolean | null;
  isDotVisible?: boolean;
}

const NftCard: FC<NftCardProps> = ({
  to,
  className,
  nft,
  onHandleSelected,
  isSetVisibility,
  isSelectedAll,
  isDotVisible = true,
}) => {
  const [infoNFT, setInfoNFT] = useState<InfoNFT>({});
  const isDesktop = useMediaQuery(QUERY.DESKTOP);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleParseNFTMoralist = useCallback(async (data: InfoNFT) => {
    const newNFT = await parseMetaDataToMoralis(data);
    setInfoNFT(newNFT);
  }, []);

  useEffect(() => {
    handleParseNFTMoralist(nft);
  }, [handleParseNFTMoralist, nft]);

  useEffect(() => {
    if (isSelectedAll === null) return;

    if (isSelectedAll) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [isSelectedAll]);

  const handleSelect = () => {
    const selectNft = {
      tokenAddress: infoNFT.tokenAddress,
      tokenId: infoNFT.tokenId,
      isVisible: infoNFT.isVisible || false,
    };

    onHandleSelected && onHandleSelected(!isSelected, selectNft);
    setIsSelected((prev) => !prev);
  };

  return (
    <div className={className}>
      <ContainerNFT>
        <LinkS to={to} key={infoNFT.id}>
          <WrapperNFT className={isDesktop ? 'pointer-hover' : ''}>
            <ImageNFT infoNFT={infoNFT} size={Resolution.Low} />

            {isDotVisible && (
              <DotVisible
                color={
                  infoNFT?.isVisible ? Colors.primaryGreen : Colors.primaryRed
                }
                data-tip={`Status is ${
                  infoNFT?.isVisible ? 'visible' : 'invisible'
                }`}
                data-place="top"
                data-effect="solid"
                data-for="status-visible"
              />
            )}
          </WrapperNFT>

          <WrapperInfo className="wrapperInfo-mobile">
            <WrapInfoUser>
              <AvatarUser src={infoNFT.avatarOfOwner || defaultAvatar} />
              <UserName>{infoNFT.ownerName || DEFAULT_USERNAME}</UserName>
            </WrapInfoUser>
            <NameItem>
              {infoNFT.metaData?.name || infoNFT.name || DEFAULT_USERNAME}
            </NameItem>
            {infoNFT?.packageDurationMin?.price ? (
              <PriceItem>
                {<IcETH width={16} height={16} />}
                {'   '}
                {parseWei(infoNFT?.packageDurationMin?.price) + ' / '}

                {infoNFT?.packageDurationMin?.label}
              </PriceItem>
            ) : (
              <PriceItem></PriceItem>
            )}
          </WrapperInfo>

          <ReactTooltip id="status-visible" />
        </LinkS>
        {isSetVisibility && (
          <BoxSelect
            style={isSelected ? { background: Colors.background } : {}}
            onClick={handleSelect}
          />
        )}

        {isSelected && (
          <WrapIcon>
            <IcTick />
          </WrapIcon>
        )}
      </ContainerNFT>
    </div>
  );
};

export default memo(NftCard);
