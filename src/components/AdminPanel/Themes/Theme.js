import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Tag, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Settings from 'components/Settings';
import { Table } from 'components/Common';
import topicActions from 'modules/topic/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const ThemeRecord = () => {
  const dispatch = useDispatch();
  const [topicsCount, setTopicsCount] = useState(1);
  const { topicRecords, topicsError, loading } = useSelector(state => state.topicsReducer);
  const data = useSelector(state => state.themesReducer);
  const { searchText } = useSelector(state => state.commonReducer);
  let [topicsData, setTopicsData] = useState([]);
  useEffect(() => {
    dispatch(topicActions.getTopics.request());
  }, []);

  useEffect(() => {
    if (topicsError || topicsError === networkError) {
      setTopicsCount(prevCount => prevCount + 1);
      if (topicsCount <= errorCount) {
        setTimeout(() => {
          dispatch(topicActions.getTopics.request());
        }, errorDelay);
      } else if (topicsError === networkError) {
        alert(`${topicsError}, Please refresh!`);
        window.location.reload();
      } else if (topicsError !== networkError) {
        alert(`${topicsError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [topicsError]);
  useEffect(() => {
    setTopicsData(topicRecords);
  }, [topicRecords]);

  useEffect(() => {
    if (searchText === '') {
      dispatch(topicActions.getTopics.request());
    } else {
      let topics_data = topicsData.filter(
        topic =>
          topic.name.toLowerCase().includes(searchText.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setTopicsData(topics_data);
    }
  }, [searchText]);
  const getThemeById = topicId => {
    dispatch(topicActions.getTopic.request(topicId));
  };

  const deleteTheme = topicId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(topicActions.deleteTopic.request(topicId));
  };

  const createTopic3 = arr => {
    let topics3 = arr.map((tag, index) => {
      return tag.name;
    });

    if (arr.length) return `(${topics3.join(',')})`;
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    {
      align: 'center',
      title: 'Topic 1',
      dataIndex: 'name',
    },
    // {
    //   align: 'center',
    //   title: 'Description',
    //   dataIndex: 'description',
    // },
    {
      align: 'center',
      title: 'Topic 2',
      key: 'topic2',
      dataIndex: 'topic2',
      render: topic2 => {
        return (
          <>
            {topic2.map((tag, index) => (
              <span>
                {tag.name}
                {createTopic3(tag.topic3)} {topic2.length !== index + 1 ? ',' : null}{' '}
              </span>
            ))}
          </>
        );
      },
    },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getThemeById(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteTheme(id)} style={{ cursor: 'pointer' }}>
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
            <Spin spinning={topicsError} delay={500}>
              <Table
                columns={columns}
                data={topicsData.map((topic, index) => ({
                  key: topic.id,
                  sr: index + 1,
                  ...topic,
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
const Theme = () => {
  return <Settings newTable={ThemeRecord} />;
};

export default Theme;
