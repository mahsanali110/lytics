import React, { useState, useEffect } from 'react';
import { Modal, Upload, message, Row, Col, Tag, Space, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Button, Table } from 'components/Common';
import { useDispatch } from 'react-redux';
import './modal.scss';
const ModelView = ({
  openModal,
  setopenModal,
  data,
  loading,
  deleteRole,
  deleteCompany,
  deleteUserId,
  setDeleteUserId,
  handleLastDelete,
  TransferUserId,
  setTransferUserId,
}) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    setIsModalVisible(openModal);
  }, [openModal]);

  const handleOk = () => {
    setIsModalVisible(false);
    setopenModal(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setopenModal(false);
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    {
      align: 'center',
      title: 'First Name',
      dataIndex: 'firstName',
    },
    {
      align: 'center',
      title: 'Last Name',
      dataIndex: 'lastName',
    },
    {
      align: 'center',
      title: 'Email',
      dataIndex: 'email',
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
      align: 'center',
      title: 'Role',
      dataIndex: 'role',
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
        <Space onClick={() => {}} style={{ cursor: 'pointer' }}>
          <Checkbox
            style={{
              boxShadow: '0px 5px 5px #3e404b',
            }}
            className="checkbox-export"
            checked={TransferUserId == id}
            onChange={e => {
              if (TransferUserId == '' || TransferUserId !== id) {
                setTransferUserId(id);
              } else if (TransferUserId === id) {
                setTransferUserId('');
              }
            }}
          ></Checkbox>
        </Space>
      ),
    },
  ];
  return (
    <Modal
      className="Modal"
      width="80%"
      title=""
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{
        backgroundColor: '#1B1D28',
        height: '80%',
      }}
    >
      <>
        <Row className="table-row">
          <Col span={2}></Col>
          <Col span={20}>
            <div className="table-container">
              <Row>
                <Col span={20} offset={2}>
                  <h2 className="title" style={{ textTransform: 'uppercase' }}>
                    Select a User to migrate deleted User's data
                  </h2>
                </Col>
                <Col span={2}>
                  <Button
                    variant={'secondary'}
                    onClick={() => {
                      handleLastDelete();
                    }}
                    disabled={TransferUserId === ''}
                  >
                    Assign & Delete
                  </Button>
                </Col>
              </Row>
              <Table
                columns={columns}
                data={data
                  .map((user, index) =>
                    user.role === deleteRole &&
                    user.id !== deleteUserId &&
                    user.company?.name === deleteCompany?.name
                      ? { key: user.id, ...user, sr: index + 1 }
                      : {}
                  )
                  .filter(element => {
                    if (Object.keys(element).length !== 0) {
                      return true;
                    }

                    return false;
                  })}
                loading={loading}
              />
            </div>
          </Col>
          <Col span={1}></Col>
        </Row>
        {/* <Table columns={columns} data={data} /> */}
      </>
    </Modal>
  );
};

export default ModelView;
