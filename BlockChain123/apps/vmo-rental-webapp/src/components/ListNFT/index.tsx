import { ROUTES } from '@constants/routes';
import { InfoNFT, NftVisible } from '@namo-workspace/services';
import { FC } from 'react';
import styled from 'styled-components';
import { WrapperListNFT } from './listNFT.styled';
import NftCard from './NftCard';

interface PropsListData {
  listData: InfoNFT[];
  isDotVisible?: boolean;
  isSetVisibility?: boolean;
  isSelectedAll?: boolean | null;
  onHandleSelected?: (selected: boolean, nft: NftVisible) => void;
  className?: string;
}

const ListNFT: FC<PropsListData> = ({
  listData,
  isDotVisible,
  isSetVisibility = false,
  isSelectedAll,
  onHandleSelected,
  className,
}) => {
  return (
    <WrapperListNFT className={className}>
      <div className="d-flex justify-content-between">
        <TrendingDescription>Trending now</TrendingDescription>
        <ViewMoreTrending>View more</ViewMoreTrending>
      </div>
      {listData.map(
        (item, index) =>
          index < 8 && (
            <NftCard
              key={`${item.tokenId}${item.id}`}
              to={`${ROUTES.NFT}/${item.tokenAddress}/${item.tokenId}`}
              nft={item}
              className={`col col-6 col-sm-4 col-md-3`}
              isDotVisible={isDotVisible}
              isSetVisibility={isSetVisibility}
              isSelectedAll={isSelectedAll}
              onHandleSelected={onHandleSelected}
            />
          )
      )}
    </WrapperListNFT>
  );
};
export const TrendingDescription = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

export const ViewMoreTrending = styled.div`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  color: #f5b24c;
  cursor: pointer;
  &:hover {
    color: rgb(221, 156, 58);
  }
`;

export default ListNFT;
