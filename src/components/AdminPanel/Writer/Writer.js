import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Table } from 'components/Common';
import { Image } from 'components/Common';
import Settings from 'components/Settings';
import writersActions from 'modules/writers/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const WriterTableData = () => {
  const dispatch = useDispatch();
  const [writersCount, setWritersCount] = useState(1);
  const { writers, writerError, loading } = useSelector(state => state.writersReducer);
  const { searchText } = useSelector(state => state.commonReducer);
  let [writerData, setWriterData] = useState([]);
  useEffect(() => {
    dispatch(writersActions.getWriters.request());
  }, []);
  useEffect(() => {
    if (writerError || writerError === networkError) {
      setWritersCount(prevCount => prevCount + 1);
      if (writersCount <= errorCount) {
        setTimeout(() => {
          dispatch(writersActions.getWriters.request());
        }, errorDelay);
      } else if (writerError === networkError) {
        alert(`${writerError}, Please refresh!`);
        window.location.reload();
      } else if (writerError !== networkError) {
        alert(`${writerError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [writerError]);
  useEffect(() => {
    setWriterData(writers);
  }, [writers]);
  useEffect(() => {
    if (searchText === '') {
      dispatch(writersActions.getWriters.request());
    } else {
      let writer_data = writerData.filter(
        writer =>
          writer.name.toLowerCase().includes(searchText.toLowerCase()) ||
          writer.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setWriterData(writer_data);
    }
  }, [searchText]);
  const getWriter = writerId => {
    dispatch(writersActions.getWriter.request(writerId));
  };

  const deleteWriter = writerId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(writersActions.deleteWriter.request(writerId));
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
        <Space onClick={() => getWriter(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteWriter(id)} style={{ cursor: 'pointer' }}>
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
            <Spin spinning={writerError} delay={500}>
              <Table
                columns={columns}
                data={writerData.map((writer, index) => ({
                  key: writer.id,
                  sr: index + 1,
                  ...writer,
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
const Writers = () => {
  return <Settings newTable={WriterTableData} />;
};
export default Writers;
