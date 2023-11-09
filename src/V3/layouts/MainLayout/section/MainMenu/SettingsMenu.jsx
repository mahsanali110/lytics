import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  DesktopOutlined,
  FundProjectionScreenOutlined,
  UsergroupDeleteOutlined,
  FileOutlined,
  UserOutlined,
  AudioOutlined,
  BellOutlined,
  UsergroupAddOutlined,
  BulbOutlined,
  FilePptOutlined,
} from '@ant-design/icons';
const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/settings/user">
        <UserOutlined /> User
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/channels">
        <FundProjectionScreenOutlined /> Channels
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/program-type">
        <FilePptOutlined /> Program Type
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/hosts">
        <AudioOutlined /> Hosts
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/writers">
        <AudioOutlined /> Writers
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/program-name">
        <DesktopOutlined /> Program Names
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/association">
        <UsergroupDeleteOutlined /> Association
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/guests">
        {' '}
        <UsergroupAddOutlined />
        Guests
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/theme">
        <BulbOutlined /> Topics
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/alarms">
        <BellOutlined /> Alarms
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/company">
        {' '}
        <UsergroupAddOutlined />
        Company
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/settings/group">
        {' '}
        <UsergroupAddOutlined />
        Group
      </Link>
    </Menu.Item>
  </Menu>
);

export default menu;
