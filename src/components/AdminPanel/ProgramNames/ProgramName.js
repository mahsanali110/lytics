import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Tag, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import Settings from 'components/Settings';
import { Table } from 'components/Common';
import programNamesActions from 'modules/programNames/actions';
import moment from 'moment';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const ProgramNameTableRecord = () => {
  const [programNamesCount, setProgramNamesCount] = useState(1);
  const [programTypesCount, setProgramTypesCount] = useState(1);
  const [channelsCount, setChannelsCount] = useState(1);
  const getAllUserData = () => {
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programNamesActions.getProgramTypes.request());
    dispatch(programNamesActions.getChannels.request());
  };
  const dispatch = useDispatch();
  const {
    programNames,
    loading,
    channelsError,
    programTypesError,
    programNamesError,
  } = useSelector(state => state.programNamesReducer);
  const { searchText } = useSelector(state => state.commonReducer);
  let [programNamesData, setProgramNamesData] = useState([]);
  useEffect(() => {
    getAllUserData;
  }, []);
  useEffect(() => {
    setProgramNamesData(programNames);
  }, [programNames]);

  useEffect(() => {
    if (channelsError || channelsError === networkError) {
      setChannelsCount(prevCount => prevCount + 1);
      if (channelsCount <= errorCount) {
        setTimeout(() => {
          dispatch(programNamesActions.getChannels.request());
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
  useEffect(() => {
    if (programTypesError || programTypesError === networkError) {
      setProgramTypesCount(prevCount => prevCount + 1);
      if (programTypesCount <= errorCount) {
        setTimeout(() => {
          dispatch(programNamesActions.getProgramTypes.request());
        }, errorDelay);
      } else if (programTypesError === networkError) {
        alert(`${programTypesError}, Please refresh!`);
        window.location.reload();
      } else if (programTypesError !== networkError) {
        alert(`${programTypesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [programTypesError]);
  useEffect(() => {
    if (programNamesError || programNamesError === networkError) {
      setProgramNamesCount(prevCount => prevCount + 1);
      if (programNamesCount <= errorCount) {
        setTimeout(() => {
          dispatch(programNamesActions.getProgramNames.request());
        }, errorDelay);
      } else if (programNamesError === networkError) {
        alert(`${programNamesError}, Please refresh!`);
        window.location.reload();
      } else if (programNamesError !== networkError) {
        alert(`${programNamesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [programNamesError]);

  useEffect(() => {
    if (searchText === '') {
      getAllUserData();
    } else {
      let program_data = programNamesData.filter(
        program =>
          program.title.toLowerCase().includes(searchText.toLowerCase()) ||
          program.channel.toLowerCase().includes(searchText.toLowerCase()) ||
          program.type.toLowerCase().includes(searchText.toLowerCase()) ||
          program.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setProgramNamesData(program_data);
    }
  }, [searchText]);
  const getProgramName = userId => {
    dispatch(programNamesActions.getProgramName.request(userId));
  };

  const deleteProgramName = userId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(programNamesActions.deleteProgramName.request(userId));
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    {
      align: 'center',
      title: 'Title',
      dataIndex: 'title',
    },
    {
      align: 'center',
      title: 'Channel ID',
      dataIndex: 'channel',
    },
    {
      align: 'center',
      title: 'Program Type ID',
      dataIndex: 'type',
    },
    {
      align: 'center',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      align: 'center',
      title: 'Host',
      dataIndex: 'host',
      render: hosts => (
        <Space>
          {hosts?.map(host => (
            <Tag key={host} color="#333" style={{ width: 'auto' }}>
              {host}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Program Time',
      dataIndex: 'fromTime',
      render: (_, programName) => {
        return (
          <>
            <Space>{moment(programName.fromTime).format('HH:mm')}</Space>
            <sapn> - </sapn>
            <Space>{moment(programName.toTime).format('HH:mm')}</Space>
          </>
        );
      },
    },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getProgramName(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteProgramName(id)} style={{ cursor: 'pointer' }}>
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
            <Spin spinning={programNamesError} delay={500}>
              <Table
                columns={columns}
                data={programNamesData.map((programName, index) => {
                  return {
                    key: programName.id,
                    ...programName,
                    sr: index + 1,
                  };
                })}
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

const ProgramNames = () => {
  return <Settings newTable={ProgramNameTableRecord} />;
};

export default ProgramNames;
