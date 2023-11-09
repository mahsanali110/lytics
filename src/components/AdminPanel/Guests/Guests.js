import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Table, Image } from 'components/Common';
import Settings from 'components/Settings';
import guestsActions from 'modules/guests/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const GuestTableData = () => {
  const dispatch = useDispatch();
  const [guestsCount, setGuestsCount] = useState(1);
  const [associationsCount, setAssociationsCount] = useState(1);
  const { guests, guestError, loading } = useSelector(state => state.guestsReducer);
  const { associations, associationError } = useSelector(state => state.associationsReducer);
  const { searchText } = useSelector(state => state.commonReducer);
  let [GuestData, setGuestData] = useState([]);
  useEffect(() => {
    dispatch(guestsActions.getGuests.request());
    dispatch(guestsActions.getAssociations.request());
  }, []);

  useEffect(() => {
    if (guestError || guestError === networkError) {
      setGuestsCount(prevCount => prevCount + 1);
      if (guestsCount <= errorCount) {
        setTimeout(() => {
          dispatch(guestsActions.getGuests.request());
        }, errorDelay);
      } else if (guestError === networkError) {
        alert(`${guestError}, Please refresh!`);
        window.location.reload();
      } else if (guestError !== networkError) {
        alert(`${guestError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [guestError]);
  useEffect(() => {
    if (associationError || associationError === networkError) {
      setAssociationsCount(prevCount => prevCount + 1);
      if (associationsCount <= errorCount) {
        console.log(associationsCount);
        setTimeout(() => {
          dispatch(guestsActions.getAssociations.request());
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
    setGuestData(guests);
  }, [guests]);
  useEffect(() => {
    if (searchText === '') {
      dispatch(guestsActions.getGuests.request());
      dispatch(guestsActions.getAssociations.request());
    } else {
      let guest_data = GuestData.filter(
        guest =>
          guest.name.toLowerCase().includes(searchText.toLowerCase()) ||
          guest.association.toLowerCase().includes(searchText.toLowerCase()) ||
          guest.description.toLowerCase().includes(searchText.toLowerCase())
      );

      setGuestData(guest_data);
    }
  }, [searchText]);
  const getGuest = guestId => {
    dispatch(guestsActions.getGuest.request(guestId));
  };

  const deleteGuest = guestId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(guestsActions.deleteGuest.request(guestId));
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
      title: 'Guest Name',
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: 'Association',
      dataIndex: 'association',
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
        <Space onClick={() => getGuest(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteGuest(id)} style={{ cursor: 'pointer' }}>
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
            <Spin spinning={guestError} delay={500}>
              <Table
                columns={columns}
                data={GuestData.map((guest, index) => ({
                  key: guest.id,
                  sr: index + 1,
                  ...guest,
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

const Guests = () => {
  return <Settings newTable={GuestTableData} />;
};

export default Guests;
