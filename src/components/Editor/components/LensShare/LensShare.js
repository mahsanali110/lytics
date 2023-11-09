import React, { useState, useEffect } from 'react';
import { Row, Col, Input, List, message as antMessage } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import './LensShare.scss';
import { LensIcon, Mic } from 'assets/icons';
import CheckMark from '../../../../assets/icons/checkmark.svg';
import { convertHMS, convertToMilliseconds } from 'modules/common/utils';

import { USERS_BASE_URL } from 'constants/config';
import { uploadPath } from 'constants/index';
import libraryJobsActions from 'modules/libraryJobs/actions';
import editorActions from 'modules/editor/actions';

const { TextArea } = Input;

function LensShare({ jobId, isLibraryJob }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.authReducer.user);
  const { users } = useSelector(state => state.usersReducer);
  const { shareToLens } = useSelector(state => state.editorReducer);
  const { videoDuration } = useSelector(state => state.commonReducer);

  const [companyUsers, setCompanyUsers] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [bulkUsers, setBulkUsers] = useState([]);
  const [recording, setRecording] = useState(null);
  const [shareTitle, setShareTitle] = useState('');
  const [shareDescription, setShareDescription] = useState('');

  const {
    id,
    company: { name, logoPath, id: companyId },
    firstName,
    lastName,
  } = user;

  const onRecordingComplete = blob => {
    setRecording(blob);
  };

  const handleAlertSearch = e => {
    setCompanyUsers(
      users
        .filter(user => user.company && user?.company?.name == name && user.id !== id)
        .map(role => ({
          value: role.id,
          title: role.firstName + ' ' + role.lastName,
        }))
        .filter(user => user.title.toLowerCase().includes(e.target.value.toLowerCase()))
    );
  };

  const sendAlertFunction = () => {
    if (!shareTitle) {
      antMessage.error('Share Title is required', 2);
      return dispatch(editorActions.updateByField({ field: 'shareToLens', value: false }));
    }

    if (!shareDescription) {
      antMessage.error('Share description is required');
      return dispatch(editorActions.updateByField({ field: 'shareToLens', value: false }));
    }

    if (!bulkUsers.length) {
      antMessage.error('Select atleast 1 user');
      return dispatch(editorActions.updateByField({ field: 'shareToLens', value: false }));
    }

    const startTime = convertHMS(0);
    const endTime = convertHMS(videoDuration);

    const formData = new FormData();
    const data = {
      shareTitle,
      shareDescription,
      startDuration: convertToMilliseconds(startTime).toString(),
      endDuration: convertToMilliseconds(endTime).toString(),
      escalations: bulkUsers,
      isLibraryJob, // !! this check is V.Important. Kindly don't mess with it.
    };

    formData.append('data', JSON.stringify(data));
    if (recording) formData.append('files', recording);
    dispatch(libraryJobsActions.shareJob.request({ data: formData, id: jobId }));
    setBulkUsers(prev => []);
    setIsChecked(prev => []);
    setShareTitle('');
    setShareDescription('');
    setRecording(null);
    setCompanyUsers(
      users
        .filter(user => user.company && user?.company?.name == name && user.id !== id)
        .map(role => ({
          value: role.id,
          title: role.firstName + ' ' + role.lastName,
        }))
    );
  };

  useEffect(() => {
    if (!shareToLens) return;
    sendAlertFunction();
  }, [shareToLens]);

  useEffect(() => {
    setCompanyUsers(
      users
        .filter(user => user.company && user?.company?.name == name && user.id !== id)
        .map(role => ({
          value: role.id,
          title: role.firstName + ' ' + role.lastName,
        }))
    );
  }, [users]);

  useEffect(() => {
    setBulkUsers([]);
    isChecked?.map(singlechecked => {
      setBulkUsers(prev => [
        ...prev,
        {
          id: companyUsers[singlechecked]?.value,
          to: companyUsers[singlechecked]?.title,
          company: companyId,
          by: firstName + ' ' + lastName,
          time: moment().utc(true).toISOString(),
        },
      ]);
    });
  }, [isChecked]);

  return (
    <div className="lens-share-wrapper mt-15">
      <Row gutter={12} justify="center" align="center">
        <Col>
          <LensIcon width={24} height={25} />
        </Col>
        <Col className="text-white">Share</Col>
      </Row>

      <Row className="mb-10">
        <Col span={24}>
          <Input
            value={shareTitle}
            onChange={e => setShareTitle(e.target.value)}
            className="lens-input"
            placeholder="Add Title"
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <TextArea
            value={shareDescription}
            onChange={e => setShareDescription(e.target.value)}
            className="lens-textarea mb-15"
            placeholder="description"
            maxLength={200}
          />
        </Col>
        {/* <Col
          span={6}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="d-flex"
        >
          <Mic className="mic-icon" />
        </Col> */}
      </Row>

      {/* Recorder Row */}
      {/* <Row className="mb-10">
        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {recording ? (
            <audio controls={true} src={URL.createObjectURL(recording)}></audio>
          ) : (
            <AudioRecorder onRecordingComplete={onRecordingComplete} />
          )}
        </Col>
      </Row> */}

      <div className="company-container">
        <Input
          placeholder="Search"
          allowClear
          enterButton="Search"
          size="large"
          style={{
            background: '#455177',
            paddingTop: '-10px',
            boxShadow: '0px 11.9429px 24.9714px rgba(0, 0, 0, 0.02)',
            borderRadius: '6px',
            border: 'none',
            marginBottom: '10px',
          }}
          prefix={<SearchOutlined style={{ color: '#EF233C', marginRight: '3px' }} />}
          onChange={handleAlertSearch}
        />
        <div
          className="company-select"
          onClick={() => {
            if (companyUsers.length == isChecked.length && isChecked.length > 0) {
              setIsChecked([]);
            } else {
              companyUsers.map((user, index) => {
                if (isChecked.length > companyUsers.length) {
                  setIsChecked([]);
                } else {
                  setIsChecked(isChecked => [...isChecked, index]);
                }
              });
            }
          }}
        >
          <img
            style={{ margin: '10px 0 10px 0' }}
            alt="Company"
            src={`${USERS_BASE_URL}/${uploadPath}/${logoPath}`}
            width="47"
            height="34"
          />
          <div
            style={{
              color: 'white',
              fontSize: '14px',
              letterSpacing: '0.4px',
              marginLeft: '14px',
            }}
          >
            {name}
          </div>
        </div>
        <List
          size="small"
          dataSource={companyUsers}
          renderItem={(user, index) => (
            <List.Item style={{ paddingLeft: 0 }}>
              <List.Item.Meta
                style={{ alignItems: 'center' }}
                onClick={e => {
                  if (isChecked.indexOf(index) !== -1) {
                    isChecked.splice(isChecked.indexOf(index), 1);
                    setIsChecked([...isChecked]);
                  } else {
                    setIsChecked(prev => [...prev, index]);
                  }
                }}
                avatar={
                  isChecked.includes(index) ? (
                    <Avatar src={CheckMark} className="checkBox" size={50}></Avatar>
                  ) : (
                    <Avatar
                      name={user.title}
                      size={50}
                      style={{ fontSize: '16px', fontWeight: '700' }}
                    ></Avatar>
                  )
                }
                title={
                  <div
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      letterSpacing: '0.4px',
                      fontWeight: '400',
                    }}
                  >
                    {user.title}
                  </div>
                }
              ></List.Item.Meta>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default LensShare;
