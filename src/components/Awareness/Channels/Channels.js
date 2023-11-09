// Library Imports
import { SearchOutlined } from '@ant-design/icons';
import { Input, message, Table, Typography, Image } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v1 as uuid } from 'uuid';
import { MenuOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { MenuAlt } from 'assets/icons';

// Custom Imports

import {
  CHANNELS,
  CHANNELS_SEARCH_PLACEHOLDER,
  MAXIMUM_WINDOWS_ACTIVE,
} from '../../../constants/strings';
import { SearchField } from 'components/Common';
import { channelActions } from '../../../modules/multiview/actions';
import CONFIG from '../../../player_config.json';
import './Channels.scss';

const { addWindowAwareness } = channelActions;
const columns = [
  {
    title: 'Icon',
    dataIndex: 'logoPath',
    key: 'logoPath',
    className: 'logoCol',
    render: text => (
      <Image
        src={text}
        alt="icon"
        className="channel-logo"
        preview={false}
        fallback="placeholder.png"
      />
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    className: 'nameCol',
    render: text => <h1>{text}</h1>,
  },
];

const Channels = ({ data, showDrawer }) => {
  const [searchKw, setSearchKw] = useState('');
  const [filteredChannels, setFilteredChannels] = useState([]);
  const { selectedWindowsAWARENESS } = useSelector(state => state.multiviewReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchKw) {
      const matchingChannels = data.filter(ch =>
        ch.name.toLowerCase().includes(searchKw.toLocaleLowerCase())
      );
      setFilteredChannels(matchingChannels);
    } else {
      setFilteredChannels([]);
    }
  }, [searchKw]);

  return (
    <div className="channels-list-wrapper">
      <div className="channels-search-containers">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '65%',
          }}
        >
          <div
            onClick={() => showDrawer('channel')}
            style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}
          >
            <MenuAlt
              style={{
                fontSize: '1.5rem',
                marginTop: '0.75rem',
                width: '3rem',
                height: '3rem',
              }}
              // style={{
              //   width: '3rem',
              //   height: '3rem',
              //   // fontSize: '2rem',
              //   marginTop: '1rem',
              //   marginLeft: '12px',
              //   marginBottom: '2rem',
              // }}
            ></MenuAlt>
            {/* <MenuOutlined style={{ fontSize: '1.5rem', marginTop: '0.75rem' }} /> */}
            {/* <LeftOutlined
              style={{ fontSize: '1.5rem', marginTop: '0.75rem', marginRight: '1rem' }}
            /> */}
          </div>
          <Typography.Title className="title-channels" level={7}>
            Channels
          </Typography.Title>
        </div>
        <SearchField
          placeholder={CHANNELS_SEARCH_PLACEHOLDER}
          handleOnChange={e => setSearchKw(e.target.value)}
          maxlength="32"
        />
      </div>
      <div style={{ overflow: 'auto', height: '74vh' }}>
        <Table
          rowClassName="channel-row table-row-light"
          showHeader={false}
          key="id"
          style={{ backgroundColor: 'unset' }}
          columns={columns}
          dataSource={filteredChannels.length > 0 || searchKw ? filteredChannels : data}
          pagination={false}
          size="small"
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                if (selectedWindowsAWARENESS.length < CONFIG.MULTIVIEW.MAX_WINDOWS) {
                  dispatch(addWindowAwareness({ ...record, id: uuid() }));
                  dispatch({ type: 'CHANNEL_NAME', payload: record.actusId });
                } else {
                  message.warning(MAXIMUM_WINDOWS_ACTIVE);
                }
              },
            };
          }}
        />
      </div>
    </div>
  );
};

Channels.propTypes = {
  channelsHandler: PropTypes.func,
};

export default Channels;
