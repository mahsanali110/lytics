import { Dropdown, Menu, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ProfileIcon, ArrowDownIcon } from 'assets/icons';
import InformationMenu from '../InformationMenu';

import authActions from 'modules/auth/actions';

const { Text } = Typography;

import './ProfileMenu.scss';

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.authReducer.user);
  const firstName = user.firstName;
  const lastName = user.lastName;
  const role = user.role;
  const userName = `${firstName} ${lastName}`;

  const handleLogOut = () => {
    dispatch(authActions.signout.request({}));
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogOut}>
        Sign Out
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="profile-wrapper">
      <div style={{ paddingRight: '2rem' }}>
        <InformationMenu />
      </div>
      <>
        <Dropdown className="Parent" overlay={menu} trigger={['click']}>
          <div className="profile-menu-wrapper">
            <ProfileIcon />
            <div className="ims-profile-title-wrapper">
              <Text style={{ padding: '0.1rem' }} className="text-white large-font-size">
                {userName}
              </Text>
              <Text style={{ padding: '0.1rem' }} className="text-white medium-font-size">
                {role}
              </Text>
            </div>
          </div>
        </Dropdown>
      </>
    </div>
  );
};
export default ProfileMenu;
