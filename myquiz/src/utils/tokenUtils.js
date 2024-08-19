export const getToken = () => localStorage.getItem('token');

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error decoding token', e);
    return null;
  }
};
