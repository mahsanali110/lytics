import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import { MainMenuRoutes } from 'constants/routes';
import AclService from 'services/acl';
import { Dropdown } from 'antd';
import menu from './SettingMenu';
import './Mainmenu.scss';

import {
  SearchOutlined,
  EyeOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  CopyOutlined,
  GlobalOutlined,
  SettingOutlined,
  ScissorOutlined,
  MessageOutlined,
  BookOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import { Dashboard } from 'assets/icons';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch } from 'react-redux';
import { message as antMessage } from 'antd';
import { inactivity_time } from 'constants/options';
import authActions from 'modules/auth/actions';
import { unSetSessionCookies, makeUserAccess } from 'modules/common/utils';
const icons = [
  <EyeOutlined />,
  <GlobalOutlined />,
  <ScissorOutlined />,
  <ScissorOutlined />,
  <ScissorOutlined />,
  <ScissorOutlined />,
  <ScissorOutlined />,
  <BarChartOutlined />,
  <UnorderedListOutlined />,
  <SearchOutlined />,
  <CopyOutlined />,
  <Dashboard width="14" height="14" style={{ marginRight: '10px' }} />,
  <SettingOutlined />,
  <MessageOutlined />,
  <BookOutlined />,
];

const MainMenu = ({ match }) => {
  const dispatch = useDispatch();

  const handleOnIdle = () => {
    antMessage.error('You have been inactive for more than 1 hour. You have been logged out.', 10);
    dispatch(authActions.signout.request({}));
    unSetSessionCookies();
    setTimeout(e => {
      window.location.href = '/login';
    }, 2000);
  };

  useIdleTimer({
    crossTab: true,
    emitOnAllTabs: true,
    timeout: inactivity_time,
    startOnMount: false,
    onIdle: handleOnIdle,
  });

  const [current, setCurrent] = useState('');
  const user = useSelector(state => state.authReducer.user);

  let aclService;
  if (user.role.toLowerCase() === 'client' && user?.pannels) {
    const userAccess = makeUserAccess(user.pannels);
    aclService = new AclService(user.role.toLowerCase(), userAccess);
  } else {
    aclService = new AclService(user.role.toLowerCase());
  }

  return (
    <Menu
      onClick={e => setCurrent(e.key)}
      selectedKeys={[current]}
      mode="horizontal"
      theme="dark"
      className="ims-main-menu"
      style={
        aclService.role === 'client'
          ? {
              minWidth: '70%',
              marginLeft: '24px',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: '10px',
              fontSize: '13px',
            }
          : {
              minWidth: '70%',
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: '10px',
              fontSize: '17px',
            }
      }
    >
      {MainMenuRoutes.map((route, i) => {
        const classes = [];
        const isActive = route.route == match.path;
        !aclService.hasPermission(route.route) && classes.push('disable');

        isActive && classes.push('active');

        return (
          <Menu.Item key={i} className={classes.join(' ')}>
            {route.label === 'Settings' ? (
              <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft" arrow>
                <Link to={route.route}>
                  {icons[i]} {route.label}
                </Link>
              </Dropdown>
            ) : (
              <>
                {route.label === 'Hyper QC' ? (
                  <Link to={route.route}>{route.label}</Link>
                ) : (
                  <Link to={route.route}>
                    {icons[i]} {route.label}
                  </Link>
                )}
              </>
            )}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default withRouter(MainMenu);
