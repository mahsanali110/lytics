import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tag, Col, Row, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Settings from 'components/Settings';
import { Table } from 'components/Common';
import usersActions from 'modules/users/actions';
import companyActions from 'modules/company/action';
import groupsActions from 'modules/groups/actions';
import commonActions from 'modules/common/actions';
import alarmActions from 'modules/alarms/actions';
import useConfirm from 'hooks/useConfirm';
import ModelView from './ModelView';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const UserTableData = () => {
  var { users, loading, channelsError, rolesError } = useSelector(state => state.usersReducer);
  const { companiesError } = useSelector(state => state.companyReducer);
  const { searchText, topicsError } = useSelector(state => state.commonReducer);
  const { alarmsError } = useSelector(state => state.alarmReducer);
  const { groupCompanyMap } = useSelector(state => state.groupsReducer);
  var { users, loading } = useSelector(state => state.usersReducer);
  const [userData, setUserData] = useState([]);
  const [openModal, setopenModal] = useState(false);
  const [deleteRole, setDeleteRole] = useState('');
  const [deleteCompany, setDeleteCompany] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');
  const [TransferUserId, setTransferUserId] = useState('');
  const { confirm } = useConfirm();

  const [rolesCount, setRolesCount] = useState(1);
  const [channelsCount, setChannelsCount] = useState(1);
  const [companiesCount, setCompaniesCount] = useState(1);
  const [topicsCount, setTopicsCount] = useState(1);
  const [alarmsCount, setAlarmsCount] = useState(1);
  const dispatch = useDispatch();
  const getAllUserData = () => {
    dispatch(usersActions.getUsers.request());
    dispatch(usersActions.getRoles.request());
    dispatch(usersActions.getChannels.request());
    dispatch(companyActions.getCompanies.request());
    dispatch(commonActions.fetchTopics.request());
    dispatch(groupsActions.getGroups.request());
    dispatch(alarmActions.getAlarms.request());
  };

  useEffect(() => {
    if (rolesError || rolesError === networkError) {
      setRolesCount(prevCount => prevCount + 1);
      if (rolesCount <= errorCount) {
        setTimeout(() => {
          dispatch(usersActions.getRoles.request());
        }, errorDelay);
      } else if (rolesError === networkError) {
        alert(`${rolesError}, Please refresh!`);
        window.location.reload();
      } else if (rolesError !== networkError) {
        alert(`${rolesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [rolesError]);
  useEffect(() => {
    if (channelsError || channelsError === networkError) {
      setChannelsCount(prevCount => prevCount + 1);
      if (channelsCount <= errorCount) {
        setTimeout(() => {
          dispatch(usersActions.getChannels.request());
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
    if (companiesError || companiesError === networkError) {
      setCompaniesCount(prevCount => prevCount + 1);
      if (companiesCount <= errorCount) {
        setTimeout(() => {
          dispatch(companyActions.getCompanies.request());
        }, errorDelay);
      } else if (companiesError === networkError) {
        alert(`${companiesError}, Please refresh!`);
        window.location.reload();
      } else if (companiesError !== networkError) {
        alert(`${companiesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [companiesError]);
  useEffect(() => {
    if (topicsError || topicsError === networkError) {
      setTopicsCount(prevCount => prevCount + 1);
      if (topicsCount <= errorCount) {
        setTimeout(() => {
          dispatch(commonActions.fetchTopics.request());
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

  useEffect(() => {
    getAllUserData();
  }, []);
  useEffect(() => {
    setUserData(users);
  }, [users]);
useEffect(()=>
{
console.log(searchText);
},[searchText])
  useEffect(() => {
    if (searchText.length===1) {
      getAllUserData();
    } else {
      let user_data = userData.filter(
        user =>
          user?.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
          user?.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          user?.role?.toLowerCase().includes(searchText.toLowerCase())
      );

      setUserData(user_data);
    }
  }, [searchText]);

  const getUser = userId => {
    dispatch(usersActions.getUser.request(userId));
  };
  const deleteUser = (userId, role, company) => {
    // const confirmDelete = confirm(
    //   'This action cannot be undone. Are you sure you want to delete this item?'
    // );
    setDeleteUserId(userId);
    setDeleteRole(role);
    setDeleteCompany(company);
    openModalHandeler();
    // if (confirmDelete) dispatch(usersActions.deleteUser.request(userId));
  };

  const handleLastDelete = () => {
    dispatch(
      usersActions.deleteUser.request({
        userId: deleteUserId,
        data: {
          TransferUserId,
        },
      })
    );
    getAllUserData();

    if (loading === false) {
      setTransferUserId('');
      setDeleteUserId('');
      setDeleteRole('');
      setopenModal(false);
      getAllUserData();
    }
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    {
      align: 'center',
      title: 'Group',
      dataIndex: 'company',
      render: company => groupCompanyMap[company?.name],
    },
    {
      align: 'center',
      title: 'Name',
      dataIndex: 'fullName',
    },
    // {
    //   align: 'center',
    //   title: 'Role',
    //   dataIndex: 'role',
    // },
    // {
    //   align: 'center',
    //   title: 'Email',
    //   dataIndex: 'email',
    // },
    {
      align: 'center',
      title: 'Role',
      dataIndex: 'role',
    },
    {
      align: 'center',
      title: 'Company',
      dataIndex: 'company',
      render: company => <>{company?.name}</>,
    },
    {
      align: 'center',
      title: 'Tag No.',
      dataIndex: 'tagNo',
    },
    {
      align: 'center',
      title: 'Organization Unit',
      dataIndex: 'organizationalUnit',
    },
    {
      title: 'Channels',
      align: 'center',
      dataIndex: 'channels',
      render: channels => (
        <>
          {channels?.map(channel => (
            <Tag key={channel} style={{ backgroundColor: '#333' }}>
              {channel}
            </Tag>
          ))}
        </>
      ),
    },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getUser(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id, role, company }) => (
        <Space onClick={() => deleteUser(id, role, company)} style={{ cursor: 'pointer' }}>
          <DeleteOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
  ];
  const openModalHandeler = () => {
    setopenModal(true);
  };
  return (
    <>
      <Row className="table-row">
        <Col span={2}></Col>
        <Col span={20}>
          <div className="table-container">
            <Table
              columns={columns}
              data={userData.map((user, index) => ({
                key: user.id,
                fullName: `${user.firstName} ${user.lastName}`,
                ...user,
                sr: index + 1,
              }))}
              loading={loading}
            />
          </div>
        </Col>
        <Col span={1}></Col>
      </Row>
      {openModal ? (
        <ModelView
          openModal={openModal}
          setopenModal={setopenModal}
          data={userData}
          loading={loading}
          deleteRole={deleteRole}
          deleteCompany={deleteCompany}
          deleteUserId={deleteUserId}
          setDeleteUserId={setDeleteUserId}
          handleLastDelete={handleLastDelete}
          TransferUserId={TransferUserId}
          setTransferUserId={setTransferUserId}
        ></ModelView>
      ) : null}
      {/* <Table columns={columns} data={data} /> */}
    </>
  );
};
const Users = () => {
  return <Settings newTable={UserTableData} />;
};
export default Users;
