import React, { useState } from 'react';
import './ClientProfileMenu.scss';
import authActions from 'modules/auth/actions';
import usersActions from 'modules/users/actions';
import editIcon from 'assets/images/edit.png';
import { useDispatch, useSelector } from 'react-redux';
import { USERS_BASE_URL } from '../../../../constants/config/config.dev';
import SettingFilled from 'assets/images/settings_filled.png';
import { SettingOutlined, CameraOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popover, Input, Row, Col, Form, Avatar, Badge, Upload, Modal } from 'antd';
import { uploadPath } from 'constants/index';

function ClientProfileMenu() {
  const user = useSelector(state => state.authReducer.user);
  const [userRecord, setUserRecord] = useState({ ...user });
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const dispatch = useDispatch();
  const firstName = user.firstName;
  const lastName = user.lastName;
  const designation = user.title;
  const email = user.email;

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'tagNo') {
      let s = value.replace(/\D/g, '');
      setUserRecord({ ...userRecord, [name]: s });
    } else {
      setUserRecord({ ...userRecord, [name]: value });
    }
  };
  const props = {
    name: 'file',
    multiple: false,
    accept: '.png,.jpeg,jpg',
    showUploadList: false,
    onRemove: file => {
      setImageFile([]);
    },
    onChange(info) {
      setImageFile(info.file.originFileObj);
    },
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handleChangeAvatar = info => {
    setImageFile([info.file.originFileObj]);
    getBase64(info.file.originFileObj, url => {
      setImageUrl(url);
      setUserRecord({ ...userRecord, photoPath: info.file.originFileObj });
    });
  };
  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('firstName', userRecord.firstName);
    formData.append('lastName', userRecord.lastName);
    formData.append('title', userRecord.title);
    formData.append('userName', userRecord.userName);
    formData.append('email', userRecord.email);
    formData.append('phoneNo', userRecord.phoneNo);
    if (imageFile.length > 0) {
      formData.append('photoPath', imageFile[0]);
    } else {
      formData.append('photoPath', userRecord.photoPath);
    }

    dispatch(
      usersActions.updateUser.request({
        userId: userRecord.id,
        data: formData,
      })
    );
    setShowProfile(false);
  };
  const content = (
    <div className={showProfile === true ? 'profileSetting ant-popover-hidden' : 'profileSetting'}>
      <div
        style={{}}
        className="profile-hover"
        onClick={() => {
          setShowProfile(true);
        }}
      >
        <span className="profileSetting-elem">Profile</span>
      </div>
      <div
        className="profile-hover"
        onClick={() => {
          setShowLogoutModal(true);
        }}
      >
        <span className="profileSetting-elem">Logout</span>
      </div>
    </div>
  );
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'right',
        width: '28%',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <span
        style={{ color: '#565F87', fontSize: '16px', fontFamily: 'Roboto', fontWeight: 'bold' }}
      >
        {user?.email}
      </span>
      <Popover placement="bottomRight" content={content} trigger="click">
        <img
          src={SettingFilled}
          alt="logout"
          style={{ height: '17.5px', width: '16.98', cursor: 'pointer' }}
        ></img>
      </Popover>
      <Modal
        className="LogOutModal"
        centered={false}
        visible={showLogoutModal}
        onOk={() => {
          dispatch(authActions.signout.request());
        }}
        onCancel={() => {
          setShowLogoutModal(false);
        }}
      >
        <div className="LogOutModal-content">Are You Sure You Want To Logout?</div>
      </Modal>
      <Modal
        className="ClientProfileModal"
        centered={false}
        visible={showProfile}
        onOk={() => {
          setShowProfile(false);
        }}
        onCancel={() => {
          setShowProfile(false);
        }}
        footer={null}
      >
        <div className="profileMenu">
          <Row justify="center">
            <Col>
              <h3 className="Profile">Profile</h3>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Upload {...props} onChange={handleChangeAvatar}>
                  <Badge
                    count={<CameraOutlined />}
                    style={{
                      width: '30px',
                      marginTop: '4.2rem',
                      height: '30px',
                      marginRight: '1rem',
                      background: '#8B1E41',
                      color: 'rgba(247, 247, 247, 0.36)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                    className="badge"
                  >
                    <Avatar
                      style={{
                        color: '#EF233C',
                        backgroundColor: '#A21D40',
                        cursor: 'pointer',
                        border: '2px solid #EF233C',
                      }}
                      size={90}
                      src={
                        imageFile.length > 0
                          ? `${imageUrl}`
                          : `${USERS_BASE_URL}/${uploadPath}/${userRecord.photoPath}`
                      }
                    />
                  </Badge>
                </Upload>
              </div>
              <div style={{ width: '300px' }}>
                <Form.Item className="label" label="First Name" />
                <Input
                  className="firstName-input white-no-opacity"
                  value={userRecord.firstName}
                  name="firstName"
                  onChange={handleChange}
                  suffix={<img src={editIcon} alt="edit" />}
                />

                <Form.Item className="label" label="Last Name" style={{ marginTop: '5%' }} />
                <Input
                  className="lastName-input white-no-opacity"
                  value={userRecord.lastName}
                  name="lastName"
                  onChange={handleChange}
                  suffix={<img src={editIcon} alt="edit" />}
                />

                <Form.Item className="label" label="Designation" style={{ marginTop: '5%' }} />
                <Input
                  className="designation-input white-no-opacity"
                  value={userRecord.title}
                  name="title"
                  onChange={handleChange}
                  suffix={<img src={editIcon} alt="edit" />}
                />

                <Form.Item className="label" label="Email Address" style={{ marginTop: '5%' }} />
                <Input
                  className="email-input white-no-opacity"
                  value={userRecord.email}
                  name="email"
                  onChange={handleChange}
                  suffix={<img src={editIcon} alt="edit" />}
                />
                <Form.Item className="label" label="Phone Number" style={{ marginTop: '5%' }} />
                <Input
                  className="phone-input white-no-opacity"
                  value={userRecord.phoneNo}
                  type="number"
                  name="phoneNo"
                  onChange={handleChange}
                  suffix={<img src={editIcon} alt="edit" />}
                />
                <Button className="button" onClick={handleUpdate}>
                  Update
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}

export default ClientProfileMenu;
