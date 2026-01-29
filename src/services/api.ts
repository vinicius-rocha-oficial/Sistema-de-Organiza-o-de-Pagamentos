import axios, { AxiosResponse, AxiosError } from 'axios';
import AppStorage from './storage';

export const baseURL = 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    console.log('Interceptor request - URL:', config.url);
    console.log('Interceptor request - baseURL:', config.baseURL);
    console.log('Interceptor request - URL completa:', `${config.baseURL}/${config.url}`);
    const token = AppStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Interceptor request - Headers:', config.headers);
    console.log('Interceptor request - Saindo do interceptor, enviando requisição...');
    return config;
  },
  (error) => {
    console.error('Interceptor request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros e refresh token
api.interceptors.response.use(
  (response) => {
    console.log('Interceptor response - Sucesso:', response);
    return response;
  },
  async (error: AxiosError) => {
    console.log('Interceptor response - Erro capturado:', error);
    console.log('Interceptor response - Erro response:', error.response);
    console.log('Interceptor response - Erro request:', error.request);
    console.log('Interceptor response - Erro message:', error.message);
    
    const originalRequest = error.config as any;

    // Evita loop infinito se o refresh também retornar 401
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh/')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = AppStorage.getRefresh();
        if (refreshToken) {
          // Usa axios diretamente para evitar loop com interceptors
          const response = await axios.post(`${baseURL}/api/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          AppStorage.setToken(access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        AppStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

type HttpBaseProps = {
  route: string;
  params?: Record<string, unknown>;
  noDefaultHeaders?: boolean;
  customHeaders?: object;
  external?: boolean;
  onUploadProgress?: (_progressEvent: unknown) => void;
  token?: boolean;
};

type HttpBodyProps<IRequest = unknown> = {
  body?: IRequest;
};

type GetUrl = HttpBaseProps;

export type HttpGetProps = HttpBaseProps;
export type HttpDeleteProps = HttpBaseProps;

export type HttpPostProps<IRequest = unknown> = HttpBaseProps & HttpBodyProps<IRequest>;
export type HttpPutProps<IRequest = unknown> = HttpBaseProps & HttpBodyProps<IRequest>;
export type HttpPatchProps<IRequest = unknown> = HttpBaseProps & HttpBodyProps<IRequest>;

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const getHeaders = (
  token: boolean,
  noDefaultHeaders: boolean,
  customHeaders = {}
) => {
  const baseHeaders = noDefaultHeaders ? {} : defaultHeaders;
  const headers = {
    ...baseHeaders,
    ...customHeaders,
  };

  if (token) {
    const tokenString = AppStorage.getToken();

    return {
      ...headers,
      Authorization: `Bearer ${tokenString}`,
    };
  } else {
    return headers;
  }
};

const getUrl = (props: GetUrl): string => {
  const { route, params, external = false } = props;

  // Se for externo, retorna a URL completa
  // Se não, retorna apenas a rota relativa (o baseURL já está configurado no axios)
  let url = external ? route : route;

  // Remove barra inicial se existir para evitar dupla barra
  if (url.startsWith('/')) {
    url = url.substring(1);
  }

  let urlString = url;

  if (params) {
    urlString += '?';

    const paramsArr = Object.keys(params).flatMap((key) => {
      const paramValue = params[key];

      if (Array.isArray(paramValue)) {
        return paramValue.map((val) => `${key}=${encodeURIComponent(val)}`);
      }

      if ((key === 'expand' || key === 'status_id') && typeof paramValue === 'string') {
        return `${key}=${paramValue}`;
      }

      return `${key}=${encodeURIComponent(String(paramValue))}`;
    });

    urlString += paramsArr.join('&');
  }

  console.log('getUrl retornou:', urlString);
  return urlString;
};

const HttpGet = async <IResponse = unknown, IRequest = unknown>(
  props: HttpGetProps
) => {
  const { token = false, noDefaultHeaders, customHeaders = {} } = props;

  const headers = getHeaders(token, noDefaultHeaders ?? false, customHeaders);

  const url = getUrl(props);

  return api.get<IRequest, AxiosResponse<IResponse, IRequest>>(url, {
    headers,
  });
};

const HttpPost = async <IResponse = unknown, IRequest = unknown>(
  props: HttpPostProps<IRequest>
) => {
  const {
    body = {},
    token = false,
    noDefaultHeaders,
    customHeaders = {},
  } = props;

  const headers = getHeaders(token, noDefaultHeaders ?? false, customHeaders);

  const url = getUrl(props);

  console.log('HttpPost - URL:', url);
  console.log('HttpPost - Body:', body);
  console.log('HttpPost - Headers:', headers);
  console.log('HttpPost - Chamando api.post...');

  try {
    console.log('HttpPost - ANTES do api.post');
    console.log('HttpPost - URL completa será:', `${baseURL}/${url}`);
    const response = await api.post<IRequest, AxiosResponse<IResponse, IRequest>>(url, body, {
      headers,
    });
    console.log('HttpPost - Resposta recebida:', response);
    return response;
  } catch (error: any) {
    console.error('HttpPost - Erro na requisição:', error);
    console.error('HttpPost - Erro response:', error?.response);
    console.error('HttpPost - Erro request:', error?.request);
    console.error('HttpPost - Erro message:', error?.message);
    throw error;
  }
};

const HttpPut = async <IResponse = unknown, IRequest = unknown>(
  props: HttpPutProps<IRequest>
) => {
  const {
    body = {},
    token = false,
    noDefaultHeaders,
    customHeaders = {},
  } = props;

  const headers = getHeaders(token, noDefaultHeaders ?? false, customHeaders);

  const url = getUrl(props);

  return api.put<IRequest, AxiosResponse<IResponse, IRequest>>(url, body, {
    headers,
  });
};

const HttpDelete = async <IResponse = unknown, IRequest = unknown>(
  props: HttpDeleteProps
) => {
  const { token = false, noDefaultHeaders, customHeaders = {} } = props;

  const headers = getHeaders(token, noDefaultHeaders ?? false, customHeaders);

  const url = getUrl(props);

  return api.delete<IRequest, AxiosResponse<IResponse, IRequest>>(url, {
    headers,
  });
};

const HttpPatch = async <IResponse = unknown, IRequest = unknown>(
  props: HttpPatchProps<IRequest>
) => {
  const {
    body = {},
    token = false,
    noDefaultHeaders,
    customHeaders = {},
  } = props;

  const headers = getHeaders(token, noDefaultHeaders ?? false, customHeaders);

  const url = getUrl(props);

  return api.patch<IRequest, AxiosResponse<IResponse, IRequest>>(url, body, {
    headers,
  });
};

const ApiService = {
  HttpGet,
  HttpPost,
  HttpPut,
  HttpDelete,
  HttpPatch,
};

export default ApiService;
