export interface UpdateUserProfileParams {
  email: string;
  employeeName: string;
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword?: string;
}
