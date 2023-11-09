// Library Imports
import { SearchOutlined } from '@ant-design/icons';
import { Input, message, Table, Typography, Image } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v1 as uuid } from 'uuid';
// Custom Imports
import { MenuAlt } from 'assets/icons';

import {
  CHANNELS,
  CHANNELS_SEARCH_PLACEHOLDER,
  MAXIMUM_WINDOWS_ACTIVE,
} from '../../../constants/strings';
import { SearchField } from 'components/Common';
import { channelActions } from '../../../modules/multiview/actions';
import CONFIG from '../../../player_config.json';
import './Channels.scss';

const { addWindow } = channelActions;
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
        fallback="placeholder.png"
        preview={false}
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

const Channels = ({ data, showDrawer, role }) => {
  const [searchKw, setSearchKw] = useState('');
  const [filteredChannels, setFilteredChannels] = useState([]);
  const activeWindows = useSelector(state => state.multiviewReducer.selectedWindows);
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
    <div className="channels-list-wrapper-multiview">
      <div className="channels-search-container">
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
      <div>
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
                if (
                  activeWindows.length <
                  (role === 'client' ? CONFIG.CLIENT.MAX_WINDOWS : CONFIG.MULTIVIEW.MAX_WINDOWS)
                ) {
                  dispatch(addWindow({ ...record, id: uuid() }));

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
