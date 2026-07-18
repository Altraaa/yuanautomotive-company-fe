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

/** POST /auth/refresh — swaps a valid refresh token for a fresh access token. */
export type ApiRefreshResponse = {
  access_token: string;
  /** Backend may rotate the refresh token too; falls back to the existing one. */
  refresh_token?: string;
};
