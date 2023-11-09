import { Layout, Typography } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ImsLogo from 'assets/icons/Lytics_logo.svg';
import { MainMenu, ProfileMenu } from './components';
const { Content } = Layout;

import './Main.scss';
import ClientProfileMenu from './components/ProfileMenu/ClientProfileMenu';

const Main = props => {
  const { children } = props;
  const user = useSelector(state => state.authReducer.user);
  return (
    <Layout>
      <Layout>
        <div
          className={user?.role === 'Client' ? 'main-client-header-wrapper' : 'main-header-wrapper'}
        >
          <Link to="/">
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <img src={ImsLogo} style={{ width: '54px', height: '34px', marginLeft: '27px' }} />
            </div>
          </Link>
          <MainMenu />
          {user?.role === 'Client' ? <ClientProfileMenu /> : <ProfileMenu />}
        </div>
        <div
          className={
            user?.role === 'Client' ? 'main-client-content-wrapper' : 'main-content-wrapper'
          }
        >
          <Content>{children}</Content>
        </div>
      </Layout>
    </Layout>
  );
};

Main.propTypes = {
  children: PropTypes.node,
};

export default Main;
