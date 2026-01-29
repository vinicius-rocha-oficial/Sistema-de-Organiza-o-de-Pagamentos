import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message =
      (error.response?.data as any)?.message ||
      (error.response?.data as any)?.detail ||
      error.message ||
      'Erro ao processar requisição';

    return {
      message,
      status,
      data: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'Erro desconhecido',
  };
};

export const getErrorMessage = (error: unknown): string => {
  return handleApiError(error).message;
};
