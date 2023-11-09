import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
import { store } from '../index';
import { USERS_BASE_URL } from 'constants/config';
// import { PUBLIC_URL, LOCAL_URL } from 'constants/config/config.dev';
import { getTokens, setTokens, unSetSessionCookies } from 'modules/common/utils';
import { signout } from '../services/auth';
const host = window.location.origin;

// let URL;
// sessionStorage.getItem('internet') === 'true' ? (URL = PUBLIC_URL) : (URL = LOCAL_URL);

export const requestInterceptor = async config => {
  try {
    config.headers.common.Authorization = `Bearer ${getTokens().access.token}`;
    // config.headers.common.AccessToken = accessToken.jwtToken;
  } catch (e) {
    console.error(e);
  }

  return config;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const errorInterceptor = err => {
  const originalRequest = err.config;

  if (err?.response?.status === 401 && !originalRequest.url === '/auth/refresh-tokens') {
    processQueue(err, null);
    signout('true');
    unSetSessionCookies();
    window.location.href = '/login';
    return Promise.reject(err);
  }

  if (err?.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getTokens().refresh.token;
    return new Promise(function (resolve, reject) {
      axios
        .post(`${USERS_BASE_URL}/auth/refresh-tokens`, { refreshToken })
        .then(({ data }) => {
          setTokens(data);
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access.token;
          originalRequest.headers['Authorization'] = 'Bearer ' + data.access.token;
          processQueue(null, data.access.token);
          resolve(axios(originalRequest));
        })
        .catch(err => {
          processQueue(err, null);
          signout('true');
          unSetSessionCookies();
          window.location.href = '/login';
          reject(err);
        })
        .then(() => {
          isRefreshing = false;
        });
    });
  }

  return Promise.reject(err);
};

/**
 * Custom Api Wrapper to handle unhandled exceptions/error
 * @param {object} api - api object containing all api functions e.g. { login: (data) => {}, logout: () => {}}
 * @param {array} exclude - Array of function names in api which we don't want to add this error handling
 */
export const apiWrapper = (api, exclude = []) => {
  const newApi = {};
  _.keys(api).forEach(func => {
    if (_.includes(exclude, func)) {
      newApi[func] = api[func];
      return;
    }
    newApi[func] = (...args) => {
      return new Promise((resolve, reject) => {
        api[func](...args)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            if (error && error.response && error.response.data && error.response.data.message) {
              return reject({ message: error.response.data.message });
            }
            if (error && error.message) {
              return reject(error);
            }
            return reject({
              message: 'Something went wrong, we are looking into that.',
              code: 500,
            });
          });
      });
    };
  });
  return newApi;
};
export const checkForce = async request => {
  let uuid_parse = JSON.parse(window.localStorage?.[`${host}_uuid`]);
  let ud = uuid_parse.access.uuid;

  let ans;
  await axios.post(`${USERS_BASE_URL}/auth/checkForce`, { ud }).then(res => {
    if (res.data.length === 0) {
      signout('true');
      unSetSessionCookies();
      window.location.reload();
    } else {
      ans = res.data;
    }
  });

  let active_user_id = ans[0]?.uid;
  let expireToken = JSON.parse(window.localStorage?.[`${host}_uuid`]);
  let exp_ud = expireToken.access.expires;
  let tokenFlag;
  const accessTokenExpires = moment().subtract(5, 'hours').format();

  if (accessTokenExpires >= exp_ud || !ans) {
    tokenFlag = 'true';
    signout(tokenFlag);
    unSetSessionCookies();
    window.location.reload();
    return request;
  } else {
    return request;
  }
};
