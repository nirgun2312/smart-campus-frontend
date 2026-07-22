import Cookies from 'js-cookie';
import type { User } from '@/types';

export const getUser = (): User | null => {
  try {
    const u = Cookies.get('user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
};

export const setAuth = (token: string, user: User) => {
  Cookies.set('token', token, { expires: 1 });
  Cookies.set('user', JSON.stringify(user), { expires: 1 });
};

export const clearAuth = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

export const isAuthenticated = () => !!Cookies.get('token');
