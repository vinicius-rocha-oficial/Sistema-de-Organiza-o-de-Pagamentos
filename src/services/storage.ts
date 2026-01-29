import { User } from '~/types';

// Usa um tipo genérico T para a função get
const get = <T>(name: string, parse?: boolean): T | undefined => {
  try {
    const storageValue = localStorage.getItem(name);

    if (storageValue !== null) {
      if (parse) {
        const parsed = JSON.parse(storageValue) as T;
        return parsed;
      }
      return storageValue as unknown as T;
    }
    return undefined;
  } catch (error: unknown) {
    console.warn('Error while retrieving data', error);
  }
  return undefined;
};

// Usa um tipo genérico T para a função set
const set = <T>(name: string, data: T, parse?: boolean): void => {
  try {
    const value = parse ? JSON.stringify(data) : String(data);
    localStorage.setItem(name, value);
  } catch (error: unknown) {
    console.warn('Error while storing data:', error);
  }
};

// Usa um tipo genérico T para a função merge
const merge = <T>(name: string, data: T): T => {
  try {
    const oldData = get<T>(name, true);

    if (oldData) {
      const merged = { ...oldData, ...data };
      set(name, merged, true);
      return merged;
    }

    return data;
  } catch (error: unknown) {
    console.warn('Error while merging data:', error);
  }
  return data;
};

const remove = (name: string) => {
  try {
    localStorage.removeItem(name);
  } catch (error: unknown) {
    console.warn('Error while removing data:', error);
  }
};

const clear = () => {
  try {
    localStorage.clear();
  } catch (error: unknown) {
    console.warn('Error while clearing data:', error);
  }
};

const setUser = (data: User) => {
  try {
    set('@app:user', data, true);
  } catch (error: unknown) {
    console.warn('Error when setting user:', error);
  }
};

const getUser = (): User | undefined => {
  try {
    const user = get<User>('@app:user', true);
    return user;
  } catch (error: unknown) {
    console.warn('Error while retrieving user:', error);
  }
  return undefined;
};

const setToken = (data: string): void => {
  try {
    set('@app:token', data);
  } catch (error: unknown) {
    console.warn('Error when setting token:', error);
  }
};

const setRefresh = (data: string): void => {
  try {
    set('@app:refresh', data);
  } catch (error: unknown) {
    console.warn('Error when setting refresh token:', error);
  }
};

const getRefresh = (): string | undefined => {
  try {
    const storedTokenRefresh = get<string>('@app:refresh');
    return storedTokenRefresh;
  } catch (error: unknown) {
    console.warn('Error when retrieving refresh token:', error);
  }
  return undefined;
};

const getToken = (): string | undefined => {
  try {
    const storedToken = get<string>('@app:token');
    return storedToken;
  } catch (error: unknown) {
    console.warn('Error when retrieving token:', error);
  }
  return undefined;
};

const AppStorage = {
  get,
  set,
  merge,
  remove,
  clear,
  setUser,
  getUser,
  setToken,
  getToken,
  setRefresh,
  getRefresh,
};

export default AppStorage;
