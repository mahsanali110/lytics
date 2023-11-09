// Library Imports
import { SearchOutlined } from '@ant-design/icons';
import { Input, message as antMessage, Table, Typography, Image } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v1 as uuid } from 'uuid';
import { MenuOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { markerEditActions } from 'modules/markerEdit/actions';
import { cloneDeep } from 'lodash';
import { DEFAULT_SEGMENT } from 'constants/options';
import moment from 'moment';
import { MenuAlt } from 'assets/icons';

// Custom Imports

import {
  CHANNELS,
  CHANNELS_SEARCH_PLACEHOLDER,
  MAXIMUM_WINDOWS_ACTIVE,
} from '../../../constants/strings';
import { SearchField } from 'components/Common';
import { liveClippingActions } from 'modules/LiveClipping/actions';
import CONFIG from '../../../player_config.json';
import './Channels.scss';
import useConfirm from 'hooks/useConfirm';

const { addWindow } = liveClippingActions;
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

const Channels = ({ data, showDrawer, resetProgramData }) => {
  const [searchKw, setSearchKw] = useState('');
  const [filteredChannels, setFilteredChannels] = useState([]);
  const activeWindows = useSelector(state => state.liveClippingReducer.selectedWindows);
  const dispatch = useDispatch();
  const { confirm } = useConfirm();

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
    <div className="channels-list-wrapper-liveClipper">
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
            ></MenuAlt>
            {/* <MenuOutlined style={{ fontSize: '1.5rem', marginTop: '0.75rem' }} />
            <LeftOutlined
              style={{ fontSize: '1.5rem', marginTop: '0.75rem', marginRight: '1rem' }}
            /> */}
          </div>
          <Typography.Title className="title-channels" level={4}>
            Channels
          </Typography.Title>
        </div>
        <SearchField
          placeholder={CHANNELS_SEARCH_PLACEHOLDER}
          handleOnChange={e => setSearchKw(e.target.value)}
          maxlength="32"
        />
      </div>
      <div style={{ overflow: 'auto', height: '70vh' }}>
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
              onClick: async () => {
                if (activeWindows.length && record.name === activeWindows[0].name) {
                  antMessage.info('Selected channel is already live', 2);
                  return;
                }
                if (activeWindows.length) {
                  let ifConfirm = await confirm(
                    'You will lose the unsaved changes if you switch the channel. Are you sure?'
                  );
                  if (ifConfirm) {
                    dispatch(
                      markerEditActions.updateByField({
                        field: 'segments',
                        value: [cloneDeep(DEFAULT_SEGMENT)],
                      })
                    );
                    // resetProgramData();
                    dispatch(liveClippingActions.updateStartPro(false));
                    dispatch(liveClippingActions.updateProgDate(moment()));
                    dispatch(addWindow({ ...record, id: uuid() }));
                    showDrawer('channel');
                    dispatch({ type: 'CHANNEL_NAME', payload: record.actusId });
                  } else {
                    showDrawer('channel');
                  }
                } else {
                  // resetProgramData();
                  dispatch(liveClippingActions.updateStartPro(false));
                  dispatch(liveClippingActions.updateProgDate(moment()));
                  dispatch(addWindow({ ...record, id: uuid() }));
                  showDrawer('channel');
                  dispatch({ type: 'CHANNEL_NAME', payload: record.actusId });
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
