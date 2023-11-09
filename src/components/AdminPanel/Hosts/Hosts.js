import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Table } from 'components/Common';
import { Image } from 'components/Common';
import Settings from 'components/Settings';
import hostsActions from 'modules/hosts/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const HostTableData = () => {
  const dispatch = useDispatch();
  const [hostsCount, setHostsCount] = useState(1);
  const { hosts, hostError, loading } = useSelector(state => state.hostsReducer);
  const { searchText } = useSelector(state => state.commonReducer);
  let [hostData, setHostData] = useState([]);
  useEffect(() => {
    dispatch(hostsActions.getHosts.request());
  }, []);
  useEffect(() => {
    if (hostError || hostError === networkError) {
      setHostsCount(prevCount => prevCount + 1);
      if (hostsCount <= errorCount) {
        setTimeout(() => {
          dispatch(hostsActions.getHosts.request());
        }, errorDelay);
      } else if (hostError === networkError) {
        alert(`${hostError}, Please refresh!`);
        window.location.reload();
      } else if (hostError !== networkError) {
        alert(`${hostError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [hostError]);
  useEffect(() => {
    setHostData(hosts);
  }, [hosts]);
  useEffect(() => {
    if (searchText === '') {
      dispatch(hostsActions.getHosts.request());
    } else {
      let host_data = hostData.filter(
        host =>
          host.name.toLowerCase().includes(searchText.toLowerCase()) ||
          host.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setHostData(host_data);
    }
  }, [searchText]);
  const getHost = hostId => {
    dispatch(hostsActions.getHost.request(hostId));
  };

  const deleteHost = hostId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(hostsActions.deleteHost.request(hostId));
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    {
      align: 'center',
      title: 'Image',
      dataIndex: 'photoPath',
      render: photoPath => {
        if (photoPath) return <Image width={40} height={47} src={photoPath} preview={false} />;
      },
    },
    {
      align: 'center',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getHost(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteHost(id)} style={{ cursor: 'pointer' }}>
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
            <Spin spinning={hostError} delay={500}>
              <Table
                columns={columns}
                data={hostData.map((host, index) => ({ key: host.id, sr: index + 1, ...host }))}
                loading={loading}
              />
            </Spin>
          </div>
        </Col>
        <Col span={1}></Col>
      </Row>
    </>
  );
};
const Hosts = () => {
  return <Settings newTable={HostTableData} />;
};
export default Hosts;
