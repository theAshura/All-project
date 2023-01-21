import { environment } from '@namo-workspace/environments';
import { handleResolveMetaData } from '../utils/metadata';
import authorizedRequest, { RequestError } from './authorized-request';

export interface Attributes {
  trait_type?: string;
  value?: string | number;
}

export type Units = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface MetaData {
  animationUrl?: string;
  description?: string;
  externalLink?: string;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  name?: string;
  traits?: string[];
  attributes?: Attributes[];
  compiler?: string;
  externalUrl?: string;
  properties?: Attributes[];
  picture?: string;
}

export interface Packages {
  duration: number;
  label: string;
  price: number;
  id: string;
  unitId: string;
  orderNumber: string;
}
export interface InfoNFT {
  address?: string;
  blockNumber?: string;
  blockNumberMinted?: string;
  contractType?: string;
  createdAt?: string;
  id?: string;
  metadata?: string;
  metaData?: MetaData;
  ownerName?: string;
  rentalAddress?: string;
  ownerOf?: string;
  syncedAt?: string;
  tokenAddress?: string;
  tokenId?: string;
  tokenUri?: string;
  updatedAt?: string;
  isForRent?: boolean;
  tokenHash?: string;
  lastTokenUriSync?: string;
  lastMetadataSync?: string;
  status?: string;
  chain?: string;
  cover?: string;
  duration?: number;
  endDate?: string;
  startDate?: string;
  unit?: Units;
  name?: string;
  isVisible?: boolean;
  image?: string;
  price?: number;
  description?: string;
  amount?: number;
  symbol?: string;
  avatarOfOwner?: string;
  packages?: Packages[];
  txHash?: string;
  data?: Array<InfoNFT>;
  packageDurationMin?: Packages;
  marketItem?: string;
  nftDetails?: string;
  pickedLabel?: string;
  totalPrice?: number;
  pickedDuration?: number;
  receivingNftDate?: string;
  transactions?: Transactions[];
  renderNFT?: string | null;
  contractAddress?: string;
  wrappedContractAddress?: string;
  wrappedTokenId?: string;
  viewNumber?: number;
  favouriteUsersCount?: number;
}

export interface RecommendNft {
  address?: string;
  blockNumber?: string;
  blockNumberMinted?: string;
  contractType?: string;
  createdAt?: string;
  id?: string;
  metadata?: string;
  metaData?: MetaData;
  ownerName?: string;
  rentalAddress?: string;
  ownerOf?: string;
  syncedAt?: string;
  tokenAddress?: string;
  tokenId?: string;
  tokenUri?: string;
  updatedAt?: string;
  isForRent?: boolean;
  tokenHash?: string;
  lastTokenUriSync?: string;
  lastMetadataSync?: string;
  status?: string;
  chain?: string;
  cover?: string;
  duration?: number;
  endDate?: string;
  startDate?: string;
  unit?: Units;
  name?: string;
  isVisible?: boolean;
  image?: string;
  price?: number;
  description?: string;
  amount?: number;
  symbol?: string;
  avatarOfOwner?: string;
  packages?: Packages[];
  txHash?: string;
  data?: Array<InfoNFT>;
  packageDurationMin?: Packages;
  marketItem?: string;
  nftDetails?: string;
  pickedLabel?: string;
  totalPrice?: number;
  pickedDuration?: number;
  receivingNftDate?: string;
  transactions?: Transactions[];
  renderNFT?: string | null;
  contractAddress?: string;
  wrappedContractAddress?: string;
  wrappedTokenId?: string;
  viewNumber?: number;
  favouriteUsersCount?: number;
}

export interface ListTopUserResponse {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  address?: string;
  nonce?: string;
  name?: string;
  userName?: string;
  role?: string;
  bio?: string;
  isSigned?: boolean;
  coverImage?: string;
  avatar?: string;
  email?: string;
  socialMediaLink?: string;
  follower?: null;
  following?: null;
  viewCount?: number;
  nfts?: Nft[];
  forRentCount?: number;
}

export interface Nft {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tokenAddress: string;
  proxyAddress: null;
  contractAddress: string;
  paymentToken: null;
  tokenId: string;
  wrappedContractAddress: string;
  wrappedTokenId: string;
  contractType: string;
  ownerOf: string;
  rentalAddress: string;
  avatarOfOwner: string;
  tokenUri: string;
  metadata: string;
  amount: number;
  name: string;
  symbol: string;
  ownerName: string;
  ownerUsername: string;
  chain: string;
  chainId: number;
  cover: null;
  txHash: string;
  marketItem: string;
  renderNFT: string;
  status: string;
  viewNumber: number;
  isVisible: boolean;
}

export interface ListTopUser {
  data: ListTopUserResponse[];
  count?: number;
  currentPage?: number;
  totalPage?: number;
}

export interface ListRecommendNft {
  data: ListTopUserResponse[];
  count?: number;
  currentPage?: number;
  totalPage?: number;
}

export interface InfoMoralisNFT {
  amount?: number;
  block_number?: string;
  block_number_minted?: string;
  contract_type?: string;
  created_at?: string;
  metadata?: string;
  name?: string;
  image?: string;
  owner_name?: string;
  owner_of?: string;
  price?: number;
  symbol?: string;
  synced_at?: string;
  token_address?: string;
  token_id?: string;
  token_uri?: string;
  updated_at?: string;
  description?: string | null;
  last_metadata_sync?: string | Date;
  last_token_uri_sync?: string | Date;
}

export interface ListNFTResponse {
  count: number;
  currentPage: number;
  totalPage: number;
  cursor?: string;
  data: InfoNFT[];
}

export interface MoralisNFTResponse {
  data: {
    total: number;
    page_size: number;
    page: number;
    result: InfoMoralisNFT[];
  };
}

export interface MoralisDetailNFTResponse {
  data: InfoMoralisNFT;
}

export interface ParamGetNft {
  search?: string;
  limit?: number;
  page?: number;
  viewNumber?: string;
  price?: string;
  status?: string;
  rentalAddress?: string;
  ownerOf?: string;
  createdAt?: string;
  updatedAt?: string;
  tokenId?: string;
  tokenAddress?: string;
  isVisible?: boolean;
}

export interface ParamGetRecommendNft {
  viewNumber?: string;
  search?: string;
  limit?: number;
  page?: number;
  price?: string;
  status?: string;
  rentalAddress?: string;
  ownerOf?: string;
  createdAt?: string;
  updatedAt?: string;
  tokenId?: string;
  tokenAddress?: string;
  isVisible?: boolean;
}
export interface ParamGetNftWeb {
  search?: string;
  limit?: number;
  page?: number;
}
export interface ParamGetGallery {
  address: string;
  cursor?: string;
  updateAt?: string;
  isVisible?: boolean;
  search?: string;
  filterParams?: ParamGetNft;
}

export interface Package {
  price: number;
  unitId: string;
  duration?: number;
  label?: string;
  id?: string;
}
export interface ParamSetNFT {
  id?: string;
  tokenAddress?: string;
  tokenId?: string;
  amount?: number;
  chainId?: number;
  packages: Package[];
  signature?: string;
  txHash?: string;
}

export interface Unit {
  createdAt: string;
  duration: number;
  id: string;
  isActive: boolean;
  label: string;
  updatedAt: string;
}

export interface NftVisible {
  id?: string;
  tokenId?: string;
  tokenAddress?: string;
  isVisible: boolean;
}

export interface SubscribeData {
  email?: string;
  userId?: string;
}

export interface User {
  address: string;
  avatar: string;
  bio: string;
  coverImage: string;
  createdAt: string;
  email: string;
  follower: string;
  following: string;
  id: string;
  isSigned: true;
  name: string;
  nonce: string;
  role: string;
  socialMediaLink: string;
  updatedAt: string;
  userName: string;
}
export interface SubscribeResponse {
  email?: string;
  userId?: string;
}

export interface ResponseSetNFT {
  amount: number;
  avatarOfOwner: string;
  blockNumber: string;
  blockNumberMinted: string;
  chain: string;
  contractType: string;
  cover: string;
  createdAt: string;
  endOfDurationTime: string;
  id: string;
  isVisible: boolean;
  metadata: MetaData;
  name: string;
  ownerName: string;
  ownerOf: string;
  status: string;
  symbol: string;
  syncedAt: string;
  tokenAddress: string;
  tokenId: string;
  tokenUri: string;
  updatedAt: string;
  user: User;
}

export interface ParamUpdateNFT {
  packages: Package[];
  amount?: number;
  cover?: string;
}
export interface ParamGetNftDetail {
  chainId: number;
  tokenId: string;
  tokenAddress: string;
}

export interface Transactions {
  createdAt: string;
  endDate: string;
  id: string;
  lenderAddress: string;
  lenderName: string;
  nft: InfoMoralisNFT;
  price: number;
  renterAddress: string;
  renterName: string;
  startDate: string;
  txHash: string;
  txHashReturn: string;
  type: string;
  updatedAt: string;
}

export interface SetFavouriteNftRequest {
  tokenId: string;
  tokenAddress: string;
  isFavourite: boolean;
}

export interface ParamsGetTopUsers {
  // viewMore?: boolean;
  page: number;
  limit: number;
  search?: string;
}
export const MAX_LIMIT_RECORD = 100000;

export const nftApi = {
  fetchListNFT: (params: ParamGetNft) =>
    authorizedRequest
      .get<ListNFTResponse>('/nfts', { params })
      .then(async (res) => {
        res.data.data = await handleResolveMetaData(res.data.data);
        return res.data;
      })
      .catch((error) => Promise.reject(error.message)),

  fetchListRecommendNFT: (params: ParamGetRecommendNft) =>
    authorizedRequest
      .get<ListNFTResponse>('/nfts', { params })
      .then(async (res) => {
        res.data.data = await handleResolveMetaData(res.data.data);
        return res.data;
      })
      .catch((error) => Promise.reject(error.message)),

  // get list nft BE NAMO, handle metadata in itemNFT
  fetchListNFTNamo: (params: ParamGetNft) =>
    authorizedRequest
      .get<ListNFTResponse>('/nfts/trending', { params })
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => Promise.reject(error.message)),

  findNFT: (id: string | undefined) =>
    authorizedRequest
      .get<InfoNFT>(`/nfts/${id}`)
      .then((res) => res.data)
      .catch((error) => Promise.reject(error.message)),

  getUnits: () =>
    authorizedRequest
      .get<Unit[]>(`/units?isActive=true`)
      .then((res) => res.data)
      .catch((error) => Promise.reject(error.message)),

  setNFT: (body: ParamSetNFT) =>
    authorizedRequest
      .post<ResponseSetNFT>(`/nfts`, body)
      .then((res) => res.data)
      .catch((error) => Promise.reject(error.response.data as RequestError)),

  updateNFT: (id: string, body: ParamUpdateNFT) =>
    authorizedRequest
      .put<ResponseSetNFT>(`/nfts/${id}`, body)
      .then((res) => res.data)
      .catch((error) => Promise.reject(error.response.data as RequestError)),

  stopNFT: (id: string) =>
    authorizedRequest
      .post<ResponseSetNFT>(`/nfts/stop/${id}`)
      .then((res) => res.data)
      .catch((error) => Promise.reject(error.response.data as RequestError)),

  updateVisible: (nfts: NftVisible[]) =>
    authorizedRequest.post(`/nfts/visible`, {
      nfts: nfts,
      chainId: +environment.mainnetChainIdNumber,
    }),
  subscribeGetLatest: (data: SubscribeData) =>
    authorizedRequest.post<SubscribeResponse>(`/email-subscription`, {
      email: data.email,
      userId: data.userId,
    }),

  fetchListGalleryNFT: async (params: ParamGetGallery) => {
    const { address, cursor } = params;
    const res = await authorizedRequest.get<ListNFTResponse>(
      `/nfts/gallery/${address}/${environment.mainnetChainIdNumber}`,
      {
        params: { cursor },
      }
    );
    const newData = res.data.data.filter(
      (item) => !item.tokenUri?.includes('https://etherscan.io/')
    );

    res.data.data = await handleResolveMetaData(newData);

    return res.data;
  },

  // get list nft gallery, handle metadata in itemNFT
  fetchListNFTGallery: async (params: ParamGetGallery) => {
    const { address, ...newParams } = params;

    const res = await authorizedRequest.get<ListNFTResponse>(
      `/nfts/gallery/${address}/${environment.mainnetChainIdNumber}`,
      {
        params: newParams,
      }
    );

    return res.data;
  },

  getNftDetail: async ({ chainId, tokenAddress, tokenId }: ParamGetNftDetail) =>
    authorizedRequest.get<InfoNFT>(
      `/nfts/${chainId}/${tokenAddress}/${tokenId}`
    ),

  getTrendingNFT: (params: ParamGetNft) =>
    authorizedRequest
      .get<ListNFTResponse>('/nfts/trending', { params })
      .then(async (res) => {
        res.data.data = await handleResolveMetaData(res.data.data);
        return res.data;
      })
      .catch((error) => Promise.reject(error.message)),
  fetchListTopUser: (params?: ParamsGetTopUsers) =>
    authorizedRequest
      .get<ListTopUser>('/users/top-users', { params })
      .then(async (res) => {
        return res.data;
      }),
  getUserFavouriteNfts: (params?: ParamGetNft) =>
    authorizedRequest
      .get<ListNFTResponse>('/users/favourite-nfts', { params })
      .then((res) => res.data),
  setFavouriteNft: (body: SetFavouriteNftRequest) =>
    authorizedRequest.post('/users/favourite-nfts', body),
};
