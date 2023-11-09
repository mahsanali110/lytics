import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Table } from 'components/Common';
import { Image } from 'components/Common';
import Settings from 'components/Settings';
import channelsActions from 'modules/channels/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

function ChannelTableData() {
  const dispatch = useDispatch();
  const [channelsCount, setChannelsCount] = useState(1);
  const { channels, channelsError, loading } = useSelector(state => state.channelsReducer);

  useEffect(() => {
    dispatch(channelsActions.getChannels.request());
  }, []);

  useEffect(() => {
    if (channelsError || channelsError === networkError) {
      setChannelsCount(prevCount => prevCount + 1);
      if (channelsCount <= errorCount) {
        setTimeout(() => {
          dispatch(channelsActions.getChannels.request());
        }, errorDelay);
      } else if (channelsError === networkError) {
        alert(`${channelsError}, Please refresh!`);
        window.location.reload();
      } else if (channelsError !== networkError) {
        alert(`${channelsError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [channelsError]);
  const { searchText } = useSelector(state => state.commonReducer);
  let [channelsData, setChannels] = useState([]);

  const getChannel = channelId => {
    dispatch(channelsActions.getChannel.request(channelId));
  };
  useEffect(() => {
    setChannels(channels);
  }, [channels]);

  useEffect(() => {
    if (searchText === '') {
      dispatch(channelsActions.getChannels.request());
    } else {
      let channel_data = channels.filter(
        channel =>
          channel.name.toLowerCase().includes(searchText.toLowerCase()) ||
          channel.actusId.toLowerCase().includes(searchText.toLowerCase()) ||
          channel.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setChannels(channel_data);
    }
  }, [searchText]);
  const deleteChannel = channelId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(channelsActions.deleteChannel.request(channelId));
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    {
      align: 'center',
      title: 'Logo',
      dataIndex: 'logoPath',
      render: logoPath => {
        if (logoPath) return <Image width={40} height={47} src={logoPath} preview={false} />;
      },
    },
    {
      align: 'center',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: 'Actus ID',
      dataIndex: 'actusId',
    },
    {
      align: 'center',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      align: 'center',
      title: 'Channel Language',
      dataIndex: 'language',
    },
    {
      align: 'center',
      title: 'Channel Region',
      dataIndex: 'region',
    },
    {
      align: 'center',
      title: 'Ticker Size',
      dataIndex: 'tickerSize',
    },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getChannel(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteChannel(id)} style={{ cursor: 'pointer' }}>
          <DeleteOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row className="table-row">
        <Col span={2}></Col>
        <Col span={20}>
          <div className="table-container">
            <Spin spinning={channelsError} delay={500}>
              <Table
                columns={columns}
                data={channelsData.map((channel, index) => ({
                  key: channel.id,
                  sr: index + 1,
                  ...channel,
                }))}
                loading={loading}
              />
            </Spin>
          </div>
        </Col>
        <Col span={1}></Col>
      </Row>
    </>
  );
}
const Channels = () => {
  return <Settings newTable={ChannelTableData} />;
};
export default Channels;
