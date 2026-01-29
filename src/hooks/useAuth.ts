import { useState, useEffect } from 'react';
import { User } from '~/types';
import AppStorage from '~/services/storage';
import { loginAPI } from '~/services/api/auth';
import { LoginRequest, TokenResponse } from '~/types/api';
import { handleApiError } from '~/utils/error-handler';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = AppStorage.getUser();
      const token = AppStorage.getToken();

      if (storedUser && token) {
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    console.log('useAuth.login chamado com:', credentials);
    try {
      console.log('Chamando loginAPI...');
      const response = await loginAPI(credentials);
      console.log('Resposta da API:', response);
      const data: TokenResponse = response.data;

      AppStorage.setToken(data.access);
      AppStorage.setRefresh(data.refresh);
      AppStorage.setUser(data.user);

      setUser(data.user);
    } catch (error) {
      console.error('Erro no useAuth.login:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  };

  const logout = () => {
    AppStorage.clear();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
};
