export const MAX_LENGTH_SEARCH = 250;

export const ERRORS = {
  COMMON_ERROR: 'Something went wrong. Please try again later!',
  PROFILE_UPDATED: 'Your profile has been updated!',
  USER_EXIST: 'Username already existed. Please try another name.',
  SIZE_EXCEEDED:
    'Photo exceeds the allowable size (10MB), please retry your upload.',
  WRONG_FORMAT: 'Fail to upload, format is not supported',
  CANCELED_PICKER: 'E_PICKER_CANCELLED',
};

export const ERROR_METAMASK = {
  ER_NO_METAMASK:
    'We can’t connect to Metamask. Please check your Metamask account.',
  ER_DENIED_METAMASK:
    'You have denied authorisation on MetaMask. Please try again!',
  ER_STOP_RENTING:
    'There was a problem while stopping renting this NFT. Please try again!',
  ER_SET_FOR_RENT:
    'There was a problem while setting your NFT for rent. Please try again!',
  ER_RENT: 'There was a problem renting this NFT. Please try again!',
  ER_NO_BALANCE: 'You do not have enough nUSD in your account to pay',
  ER_EDIT_RENTING:
    'There was a problem while editing renting this NFT. Please try again!',
};

export const EXTERNAL_SERVICES = {
  S3: 'https://du2-rental.s3.amazonaws.com/',
};
