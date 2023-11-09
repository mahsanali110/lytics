import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table } from 'components/Common';
import Settings from 'components/Settings';
import alarmActions from 'modules/alarms/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const AlarmsTableData = () => {
  const dispatch = useDispatch();
  const [alarmsCount, setAlarmsCount] = useState(1);
  const { alarms, alarmsError, loading } = useSelector(state => state.alarmReducer);
  const [alarmsData, setAlarmsData] = useState([]);
  const { searchText } = useSelector(state => state.commonReducer);

  useEffect(() => {
    dispatch(alarmActions.getAlarms.request());
  }, []);

  useEffect(() => {
    if (alarmsError || alarmsError === networkError) {
      setAlarmsCount(prevCount => prevCount + 1);
      if (alarmsCount <= errorCount) {
        setTimeout(() => {
          dispatch(alarmActions.getAlarms.request());
        }, errorDelay);
      } else if (alarmsError === networkError) {
        alert(`${alarmsError}, Please refresh!`);
        window.location.reload();
      } else if (alarmsError !== networkError) {
        alert(`${alarmsError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [alarmsError]);

  const getAlarm = alarmId => {
    dispatch(alarmActions.getAlarm.request(alarmId));
  };

  useEffect(() => {
    if (alarms) {
      setAlarmsData(alarms);
    }
  }, [alarms]);

  useEffect(() => {
    if (searchText === '') {
      dispatch(alarmActions.getAlarms.request());
    } else {
      let alarm_data = alarms.filter(
        alarms =>
          alarms.queryWord.toLowerCase().includes(searchText.toLowerCase()) ||
          alarms.language.toLowerCase().includes(searchText.toLowerCase())
      );
      setAlarmsData(alarm_data);
    }
  }, [searchText]);

  const deleteAlarm = alarmId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(alarmActions.deleteAlarm.request(alarmId));
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    {
      align: 'center',
      title: 'Query Word',
      dataIndex: 'queryWord',
    },
    {
      align: 'center',
      title: 'Threshold/Program',
      dataIndex: 'thresholdProgramme',
    },
    {
      align: 'center',
      title: 'Language',
      dataIndex: 'language',
    },
    {
      align: 'center',
      title: 'Threshold/Day',
      dataIndex: 'thresholdDay',
    },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getAlarm(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteAlarm(id)} style={{ cursor: 'pointer' }}>
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
            <Spin spinning={alarmsError} delay={500}>
              <Table
                columns={columns}
                data={alarmsData?.map((alarm, index) => ({
                  key: alarm.id,
                  sr: index + 1,
                  ...alarm,
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
};
const Alarms = () => {
  return <Settings newTable={AlarmsTableData} />;
};
export default Alarms;
