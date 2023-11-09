import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Table } from 'components/Common';
import { Image } from 'components/Common';
import Settings from 'components/Settings';
import associationsActions from 'modules/associations/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const AssociationTableData = () => {
  const dispatch = useDispatch();
  const [associationsCount, setAssociationsCount] = useState(1);
  const { associations, associationError, loading } = useSelector(
    state => state.associationsReducer
  );
  const { searchText } = useSelector(state => state.commonReducer);
  let [associationData, setAssociationData] = useState([]);
  useEffect(() => {
    dispatch(associationsActions.getAssociations.request());
  }, []);
  useEffect(() => {
    if (associationError || associationError === networkError) {
      setAssociationsCount(prevCount => prevCount + 1);
      if (associationsCount <= errorCount) {
        setTimeout(() => {
          dispatch(associationsActions.getAssociations.request());
        }, errorDelay);
      } else if (associationError === networkError) {
        alert(`${associationError}, Please refresh!`);
        window.location.reload();
      } else if (associationError !== networkError) {
        alert(`${associationError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [associationError]);
  useEffect(() => {
    setAssociationData(associations);
  }, [associations]);
  useEffect(() => {
    if (searchText === '') {
      dispatch(associationsActions.getAssociations.request());
    } else {
      let association = associationData.filter(
        assoc =>
          assoc.name.toLowerCase().includes(searchText.toLowerCase()) ||
          assoc.slogan.toLowerCase().includes(searchText.toLowerCase()) ||
          assoc.shortForm.toLowerCase().includes(searchText.toLowerCase())
      );
      setAssociationData(association);
    }
  }, [searchText]);
  const getAssociation = associationId => {
    dispatch(associationsActions.getAssociation.request(associationId));
  };

  const deleteAssociation = associationId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(associationsActions.deleteAssociation.request(associationId));
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
      key: 'logoPath',
      render: ({ logoPath }) => (
        <Space>
          <Image width={50} src={logoPath} preview={false} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Association Name',
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: 'Slogan',
      dataIndex: 'slogan',
    },
    {
      align: 'center',
      title: 'Shortform',
      dataIndex: 'shortForm',
    },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getAssociation(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteAssociation(id)} style={{ cursor: 'pointer' }}>
          <DeleteOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-panel-style">
      <Row className="table-row">
        <Col span={2} />
        <Col span={20}>
          <div className="table-container">
            <Spin spinning={associationError} delay={500}>
              <Table
                columns={columns}
                data={associationData.map((association, index) => ({
                  key: association.id,
                  sr: index + 1,
                  ...association,
                }))}
                loading={loading}
              />
            </Spin>
          </div>
        </Col>
        <Col span={1} />
      </Row>
    </div>
  );
};
const Associations = () => {
  return <Settings newTable={AssociationTableData} />;
};

export default Associations;
