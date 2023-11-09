import axios from 'axios';
import { USERS_BASE_URL } from 'constants/config';
// import { PUBLIC_URL, LOCAL_URL } from 'constants/config/config.dev';
const host = window.location.origin;

// let URL;
// sessionStorage.getItem('internet') === 'true' ? (URL = PUBLIC_URL) : (URL = LOCAL_URL);

export const signup = payload => {
  return new Promise((resolve, reject) => {
    axios
      .post('/signup')
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export const checkInternet = payload => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://192.168.100.50:5000/auth/checkInternet`) //add prod path (125) here
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export const signin = async ({ email, password, forced }) =>
  axios.post(`${USERS_BASE_URL}/auth/login`, { email, password, forced });

export const changePassword = payload => {
  const { email, oldPassword, newPassword } = payload;
  return new Promise((resolve, reject) => {
    axios
      .post(`${USERS_BASE_URL}/auth/reset-password`, { email, oldPassword, newPassword })
      .then(user => {})
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const resetPassword = payload => {
  const { email, newPassword } = payload;
  return new Promise((resolve, reject) => {
    axios
      .post(`${USERS_BASE_URL}/auth/reset-password`, { email, newPassword })
      .then(user => {})
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const forgotPassword = payload => {
  const { email } = payload;

  return new Promise((resolve, reject) => {
    // Receving Error : Reason Internal Error
    axios
      .post(`${USERS_BASE_URL}/auth/forgot-password`, { email })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const signout = latest => {
  const refreshToken = localStorage.getItem(`${host}_tokens`);
  const token = JSON.parse(refreshToken).refresh.token;
  return new Promise((resolve, reject) => {
    axios
      .post(`${USERS_BASE_URL}/auth/logout`, { refreshToken: token, latest: latest })
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
};
