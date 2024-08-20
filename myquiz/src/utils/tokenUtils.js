import { jwtDecode } from 'jwt-decode';

export const getToken = () => {
  return localStorage.getItem('token');
};


export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (err) {
    return null;
  }
};
