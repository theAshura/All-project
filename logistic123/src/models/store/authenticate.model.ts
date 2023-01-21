import {
  objectMessage,
  LoginSuccessResponse,
  UserProfile,
} from 'models/api/authentication.model';

export interface LoginRequestParams {
  email: string;
  password: string;
}

export interface AuthenticateStoreModel {
  tokenPassword: string;
  token?: string;
  userInfo?: LoginSuccessResponse;
  userProfile: UserProfile;
  loading: boolean;
  forgotPassword?: {
    email: string;
    forgotCode: string;
  };
  message: string;
  messageObject: Array<objectMessage>;
  loadingToken: Boolean;
  imageAvatar: string;
}
