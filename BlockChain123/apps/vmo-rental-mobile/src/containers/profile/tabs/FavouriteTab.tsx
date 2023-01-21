import { ParamGetNft } from '@namo-workspace/services';
import { isUndefined } from 'lodash';
import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import { useFocusedTab } from 'react-native-collapsible-tab-view';
import useFilterFavourite from '../../../hooks/useFilterFavourite';
import { useRefresh } from '../../../hooks/useRefresh';
import NFTFlatList from './NFTFlatList';

interface Props {
  focusInput?: boolean;
  keySearch?: string;
  isMyNFT?: boolean;
  address: string;
  onDataChange?: (isEmpty: boolean, tabIndex: number) => void;
}

const FavouriteTab: FC<Props> = ({
  focusInput,
  isMyNFT,
  address,
  onDataChange,
  keySearch,
}) => {
  const focusedTab = useFocusedTab();
  const [filterParams, setFilterParams] = useState<ParamGetNft>(undefined);

  const favouriteFilter = useMemo(
    () =>
      ({
        page: 1,
        limit: 10,
        isVisible: true,
        viewNumber: 'DESC',
      } as ParamGetNft),
    []
  );

  const {
    isLoading,
    isLoadingMore,
    listFavouriteNFT,
    count,
    refreshData,
    loadMore,
    setCallTime,
    isEmpty,
  } = useFilterFavourite(filterParams);

  const [isRefreshing, startRefreshing] = useRefresh(refreshData);

  useEffect(() => {
    if (!isUndefined(keySearch)) {
      if (keySearch === null) {
        setCallTime(0);
      }
      setFilterParams((prev) => ({ ...prev, search: keySearch || '' }));
    }
  }, [keySearch, setCallTime]);

  useEffect(() => {
    setFilterParams({ ...favouriteFilter });
  }, [favouriteFilter]);

  useEffect(() => {
    onDataChange?.(isEmpty, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty]);

  useEffect(() => {
    if (focusedTab === 'favorites') {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedTab]);

  return (
    <NFTFlatList
      isMyNFT={isMyNFT}
      focusInput={focusInput}
      isEmptyData={!count}
      isRefreshing={isRefreshing}
      startRefreshing={startRefreshing}
      data={listFavouriteNFT}
      style={{
        marginTop: count ? 62 : 32,
        paddingBottom: count ? 62 : 32,
      }}
      handleLoadMore={loadMore}
      subTitle={isMyNFT ? 'You have not ordered any NFTs' : ''}
      loadingMore={isLoadingMore}
      isLoading={isLoading}
      isOpenVisibility={false}
    />
  );
};

export default memo(FavouriteTab);
