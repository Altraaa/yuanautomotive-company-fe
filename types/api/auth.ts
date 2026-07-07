export type ApiUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type ApiLoginResponse = {
  access_token: string;
  refresh_token: string;
  user: ApiUser;
};
