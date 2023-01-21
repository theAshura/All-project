export interface FormLoginProps {
  userName: string;
  password: string;
}

export interface LoginParams {
  loginInfo: FormLoginProps;
  setRefreshToken: (data: string) => void;
}

export interface LoginUserInfo {
  _id: string;
  name: string;
  employeeName: string;
  role: string;
  email: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userName: string;
}

export interface LoginResponse {
  token: string;
  exp: number;
  user: LoginUserInfo;
}
