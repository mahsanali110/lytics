import React, { Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import { ErrorBoundary, LoadingPage } from '../Common';
import Routes from '../../Routes';
import RoutesV3 from '../../RoutesV3';
import { DEFAULT_META_DESCRIPTION, DEFAULT_META_KEYWORDS } from '../../constants';
import './App.scss';
import 'animate.css';
import 'rc-color-picker/assets/index.css';
import { TimelineProvider } from 'context/TimelineContext';
import authActions from 'modules/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getTokens, setTokens, unSetSessionCookies } from '../../modules/common/utils';
import { tokenExpireTime, newRefreshTokenTimeInterval } from '../../constants/options';
import { USERS_BASE_URL } from 'constants/config';
import axios from 'axios';

const host = window.location.origin;

const { Content } = Layout;

const App = () => {
  const dispatch = useDispatch();

  let refreshToken = getTokens()?.refresh?.token;
  const { hash } = useSelector(state => state.router.location);

  //request new token every N minutes
  useEffect(() => {
    if (refreshToken) {
      let interval = setInterval(() => {
        let loginTime = moment(localStorage?.getItem(`${host}_login_time`));
        let currentTime = moment();
        let diff = currentTime.diff(loginTime, 'minutes');
        if (diff !== null && diff >= newRefreshTokenTimeInterval && diff < tokenExpireTime) {
          refreshToken = getTokens()?.refresh?.token;
          axios
            .post(`${USERS_BASE_URL}/auth/refresh-tokens`, { refreshToken })
            .then(({ data }) => {
              window.localStorage.removeItem(`${host}_tokens`);
              window.localStorage.removeItem(`${host}_uuid`);
              window.localStorage[`${host}_uuid`] = JSON.stringify(data);
              window.localStorage[`${host}_tokens`] = JSON.stringify(data);
            })
            .catch(err => {
              dispatch(authActions.signout.request({}));
              unSetSessionCookies();
              window.location.href = '/login';
            });
          localStorage.setItem(`${host}_login_time`, moment());
        } else if (diff > tokenExpireTime) {
          dispatch(authActions.signout.request({}));
          unSetSessionCookies();
          window.location.href = '/login';
        }
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [hash]);

  return (
    <Layout>
      <Helmet>
        <title>Lytics.System - Information Cloud System</title>
        <meta name="description" content={DEFAULT_META_DESCRIPTION} />
        <meta name="keywords" content={DEFAULT_META_KEYWORDS} />
      </Helmet>
      <Content className="overallContent">
        <ErrorBoundary>
          <Suspense fallback={<LoadingPage />}>
            <TimelineProvider>
              {/* <Routes /> */}
              <RoutesV3 />
            </TimelineProvider>
          </Suspense>
        </ErrorBoundary>
      </Content>
    </Layout>
  );
};

export default App;
