import { InfoNFT, nftApi, ParamGetNft } from '@namo-workspace/services';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

const useFilterFavourite = (params: ParamGetNft) => {
  const [isLoading, setIsLoading] = useState(false);

  const [listFavouriteNFT, setListFavouriteNFT] = useState<InfoNFT[]>([]);
  const [count, setCount] = useState<undefined | number>();
  const [totalPage, setTotalPage] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [callTime, setCallTime] = useState(0);
  const isEmpty = useMemo(() => {
    if (callTime <= 1 && listFavouriteNFT.length === 0) {
      return true;
    }
    return false;
  }, [callTime, listFavouriteNFT]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setCurrentPage(params?.page);
      nftApi
        .getUserFavouriteNfts(params)
        .then(({ data, count, totalPage }) => {
          setCallTime((prev) => (prev += 1));
          setListFavouriteNFT(data);
          setCount(count);
          setTotalPage(totalPage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [params])
  );

  const refreshData = useCallback(() => {
    setIsLoading(true);
    nftApi
      .getUserFavouriteNfts({ ...params, page: 1 })
      .then(({ data, currentPage, count, totalPage }) => {
        setCallTime(1);
        setCount(count);
        setCurrentPage(currentPage);
        setListFavouriteNFT(data);
        setTotalPage(totalPage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPage) {
      setIsLoadingMore(true);
      nftApi
        .getUserFavouriteNfts({ ...params, page: currentPage + 1 })
        .then(({ data, currentPage }) => {
          setCurrentPage(currentPage);
          setListFavouriteNFT((prev) => [...prev, ...data]);
        })
        .finally(() => {
          setIsLoadingMore(false);
        });
    }
  }, [currentPage, params, totalPage]);

  return {
    isLoading,
    isLoadingMore,
    listFavouriteNFT,
    count,
    totalPage,
    refreshData,
    loadMore,
    isEmpty,
    setCallTime,
  };
};
export default useFilterFavourite;
