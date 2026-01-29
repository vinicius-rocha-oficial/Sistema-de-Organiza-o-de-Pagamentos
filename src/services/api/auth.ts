import ApiService from '../api';
import { TokenResponse, TokenRefreshResponse, LoginRequest } from '~/types/api';

export const loginAPI = (data: LoginRequest) => {
  return ApiService.HttpPost<TokenResponse>({
    route: 'api/auth/login/',
    body: data,
    token: false, // Não precisa de token para login
  });
};

export const refreshTokenAPI = (refresh: string) => {
  return ApiService.HttpPost<TokenRefreshResponse>({
    route: 'api/auth/refresh/',
    body: { refresh },
  });
};

export const logoutAPI = () => {
  return ApiService.HttpPost({
    route: 'api/auth/logout/',
    body: {},
  });
};
