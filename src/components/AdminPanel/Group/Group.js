import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Table, Image } from 'components/Common';
import Settings from 'components/Settings';
import groupsActions from 'modules/groups/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const GroupTableData = () => {
  const dispatch = useDispatch();
  const [groupCount, setGroupCount] = useState(1);
  const { groups, groupError, loading } = useSelector(state => state.groupsReducer);
  const { searchText } = useSelector(state => state.commonReducer);
  let [GroupData, setGroupData] = useState([]);
  useEffect(() => {
    dispatch(groupsActions.getGroups.request());
  }, []);
  useEffect(() => {
    if (groupError || groupError === networkError) {
      setGroupCount(prevCount => prevCount + 1);
      if (groupCount <= errorCount) {
        setTimeout(() => {
          dispatch(groupsActions.getGroups.request());
        }, errorDelay);
      } else if (groupError === networkError) {
        alert(`${groupError}, Please refresh!`);
        window.location.reload();
      } else if (groupError !== networkError) {
        alert(`${groupError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [groupError]);
  useEffect(() => {
    setGroupData(groups);
  }, [groups]);
  useEffect(() => {
    if (searchText === '') {
      dispatch(groupsActions.getGroups.request());
    } else {
      let group_data = GroupData.filter(
        group =>
          group.name.toLowerCase().includes(searchText.toLowerCase()) ||
          group.groupId.toLowerCase().includes(searchText.toLowerCase())
        // group.description.toLowerCase().includes(searchText.toLowerCase())
      );

      setGroupData(group_data);
    }
  }, [searchText]);
  const getGroup = groupId => {
    dispatch(groupsActions.getGroup.request(groupId));
  };

  const deleteGroup = groupId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(groupsActions.deleteGroup.request(groupId));
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    // {
    //   align: 'center',
    //   title: 'Image',
    //   dataIndex: 'photoPath',
    //   render: photoPath => {
    //     if (photoPath) return <Image width={40} height={47} src={photoPath} preview={false} />;
    //   },
    // },
    {
      align: 'center',
      title: 'Group Name',
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: 'Group ID',
      dataIndex: 'groupId',
    },
    // {
    //   align: 'center',
    //   title: 'Description',
    //   dataIndex: 'description',
    // },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getGroup(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteGroup(id)} style={{ cursor: 'pointer' }}>
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
            <Spin spinning={groupError} delay={500}>
              <Table
                columns={columns}
                data={GroupData.map((group, index) => ({
                  key: group.id,
                  sr: index + 1,
                  ...group,
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

const Group = () => {
  return <Settings newTable={GroupTableData} />;
};

export default Group;
