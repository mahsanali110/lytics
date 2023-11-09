import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Typography } from 'antd';
import { memo } from 'react';

import './Dropdown.scss';

const ChannelDropdown = ({ title, channels, onSelect }) => {
  let Items = (
    <Menu>
      {channels?.length
        ? channels?.map(item => <Menu.Item onClick={() => onSelect(item)}>{item.name}</Menu.Item>)
        : []}
    </Menu>
  );

  return (
    <Dropdown className="lytics-dropdown" overlay={Items} trigger={['click']}>
      <Typography.Link>
        <Space>
          <sapn className="title">{title?.toUpperCase() || ''}</sapn>
          <DownOutlined className="dropdown-arrow" />
        </Space>
      </Typography.Link>
    </Dropdown>
  );
};
export default memo(ChannelDropdown);
