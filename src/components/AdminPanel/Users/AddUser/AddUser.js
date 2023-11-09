import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col, Input, Row, Spin, message as antMessage, Checkbox } from 'antd';
import _omit from 'lodash/omit';
import { cloneDeep } from 'lodash';

import '../../FormStyles.scss';

import { SelectAll } from 'modules/common/utils';
import { Button, Select, TreeSelect, KeyWordTag } from 'components/Common';
import usersActions from 'modules/users/actions';
import PicturesWall from '../../ImageUpload';
import Access from './Section/Access';
import {
  getTopicKeys,
  getTopicValue,
  getTopicKeyFromValue,
  isNewTopic,
} from 'modules/common/utils';
import {
  MIN_PASSWORD_LENGTH_WHEN_CREATING,
  MAX_PASSWORD_LENGTH_WHEN_CREATING,
} from 'constants/index';
import { userDefaultPannels } from 'constants/options';

const UserForm = () => {
  const dispatch = useDispatch();
  const {
    formDetails,
    channels: allChannels,
    channelsError,
    rolesError,
  } = useSelector(state => state.usersReducer);
  const { companies, companiesError } = useSelector(state => state.companyReducer);
  const { formType } = useSelector(state => state.settingsReducer);
  const { topics, topicsError, topicMap } = useSelector(state => state.commonReducer);
  const { alarms, alarmsError } = useSelector(state => state.alarmReducer);

  const [userRecord, setUserRecord] = useState({ ...formDetails });
  const [channels, setChannels] = useState(formDetails.channels);
  const [role, setRole] = useState(formDetails.role);
  const [company, setCompany] = useState(formDetails.company);
  const [fileList, setFileList] = useState([]);
  const [topicHashMap, setTopicHashMap] = useState({});
  const [allowedPannels, setAllowedPannels] = useState([]);

  useEffect(() => {
    if (formType === 'ADD') {
      dispatch(usersActions.resetFormDetails());
      setRole('');
      setCompany('');
    }
  }, [formType]);
  useEffect(() => {
    const topicsArray = Object.values(topicHashMap).reduce((topics, topic) => {
      if (topic.topic3.length) {
        topics.push(topic);
      }
      return topics;
    }, []);
    setUserRecord(prev => ({ ...prev, topics: topicsArray }));
  }, [topicHashMap]);

  useEffect(() => {
    setUserRecord(() => ({ ...formDetails }));
    if (formDetails.photoPath) setFileList([{ url: formDetails.photoPath }]);

    setChannels(formDetails.channels);
    setRole(formDetails.role);
    setCompany(formDetails.company);
  }, [formDetails]);

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === 'tagNo') {
      let s = value.replace(/\D/g, '');
      setUserRecord({ ...userRecord, [name]: s });
    } else {
      setUserRecord({ ...userRecord, [name]: value });
    }
  };

  useEffect(() => {
    const map = formDetails.topics.reduce((values, topic) => {
      const key = getTopicKeyFromValue(topic.topic1, topicMap, topic.topic1);
      values[key] = topic;
      return values;
    }, {});
    setTopicHashMap({ ...map });
  }, [formDetails.topics, topicMap]);

  const getAllTopics = (parentId, currentValue, preValue) => {
    const newKeys = currentValue.filter(val => !preValue.includes(val));
    const topic2Keys = getTopicKeys(newKeys, false, true);
    const topic2 = getTopicValue(topic2Keys, topicMap, true);
    const topic3 = getTopicValue(newKeys, topicMap, true);
    const topic1 = getTopicValue(parentId, topicMap, true);
    return { topic1, topic2, topic3 };
  };
  const handleTopicChange = (value, node, extra) => {
    if (extra.checked === undefined) return setTopicHashMap({});

    const triggeredTopic = extra.triggerNode?.props;
    if (extra.checked) {
      const prevValues = extra.preValue.map(({ value }) => value);
      if (triggeredTopic.level === 0) {
        const { topic1, topic2, topic3 } = getAllTopics(triggeredTopic.value, value, prevValues);
        if (topicHashMap[triggeredTopic.value]) {
          const _topicHashMap = topicHashMap;
          const prevTopic2 = _topicHashMap[triggeredTopic.value].topic2;
          const prevTopic3 = _topicHashMap[triggeredTopic.value].topic3;
          _topicHashMap[triggeredTopic.value].topic2 = [...new Set([...prevTopic2, ...topic2])];
          _topicHashMap[triggeredTopic.value].topic3 = [...prevTopic3, ...topic3];
          setTopicHashMap({ ..._topicHashMap });
        } else {
          const _topicHashMap = topicHashMap;
          _topicHashMap[triggeredTopic.value] = { topic1, topic2, topic3 };
          setTopicHashMap({ ..._topicHashMap });
        }
      }
      if (triggeredTopic.level === 1) {
        const { topic1, topic2, topic3 } = getAllTopics(triggeredTopic.parentId, value, prevValues);

        if (topicHashMap[triggeredTopic.parentId]) {
          const _topicHashMap = { ...topicHashMap };

          _topicHashMap[triggeredTopic.parentId].topic2 =
            _topicHashMap[triggeredTopic.parentId].topic2.concat(topic2);
          _topicHashMap[triggeredTopic.parentId].topic3 =
            _topicHashMap[triggeredTopic.parentId].topic3.concat(topic3);
          setTopicHashMap(_topicHashMap);
        } else {
          const _topicHashMap = { ...topicHashMap };
          _topicHashMap[triggeredTopic.parentId] = { topic1, topic2, topic3 };
          setTopicHashMap(_topicHashMap);
        }
      }
      if (triggeredTopic.level === 2) {
        const { topic1, topic2, topic3 } = getAllTopics(triggeredTopic.parentId, value, prevValues);

        if (topicHashMap[triggeredTopic.parentId]) {
          const _topicHashMap = { ...topicHashMap };
          _topicHashMap[triggeredTopic.parentId].topic2 = [
            ...new Set(_topicHashMap[triggeredTopic.parentId].topic2.concat(topic2)),
          ];
          _topicHashMap[triggeredTopic.parentId].topic3 =
            _topicHashMap[triggeredTopic.parentId].topic3.concat(topic3);
          setTopicHashMap(_topicHashMap);
        } else {
          const _topicHashMap = { ...topicHashMap };
          _topicHashMap[triggeredTopic.parentId] = { topic1, topic2, topic3 };
          setTopicHashMap(_topicHashMap);
        }
      }
    }
    if (extra.checked === false) {
      const prevValues = extra.preValue.map(({ value }) => value);

      if (triggeredTopic?.level === 0) {
        const { topic1, topic2, topic3 } = getAllTopics(triggeredTopic.value, prevValues, value);
        const _topicHashMap = { ...topicHashMap };
        const prevTopic2 = _topicHashMap[triggeredTopic.value].topic2;
        const prevTopic3 = _topicHashMap[triggeredTopic.value].topic3;
        _topicHashMap[triggeredTopic.value].topic2 = prevTopic2.filter(
          val => !topic2.includes(val)
        );
        _topicHashMap[triggeredTopic.value].topic3 = prevTopic3.filter(
          val => !topic3.includes(val)
        );
        setTopicHashMap(_topicHashMap);
      }
      if (triggeredTopic?.level === 1) {
        const { topic1, topic2, topic3 } = getAllTopics(triggeredTopic.parentId, prevValues, value);
        const _topicHashMap = { ...topicHashMap };
        const prevTopic2 = _topicHashMap[triggeredTopic.parentId].topic2;
        const prevTopic3 = _topicHashMap[triggeredTopic.parentId].topic3;
        _topicHashMap[triggeredTopic.parentId].topic2 = prevTopic2.filter(
          val => !topic2.includes(val)
        );
        _topicHashMap[triggeredTopic.parentId].topic3 = prevTopic3.filter(
          val => !topic3.includes(val)
        );
        setTopicHashMap(_topicHashMap);
      }
      if (triggeredTopic?.level === 2) {
        const { topic1, topic2, topic3 } = getAllTopics(triggeredTopic.parentId, prevValues, value);
        const _topicHashMap = { ...topicHashMap };
        const prevTopic2 = _topicHashMap[triggeredTopic.parentId].topic2;
        const prevTopic3 = _topicHashMap[triggeredTopic.parentId].topic3;
        _topicHashMap[triggeredTopic.parentId].topic2 = prevTopic2.filter(
          val => !topic2.includes(val)
        );
        _topicHashMap[triggeredTopic.parentId].topic3 = prevTopic3.filter(
          val => !topic3.includes(val)
        );
        setTopicHashMap(_topicHashMap);
      }
    }
  };
  const resetValues = () => {};
  const handleNestedFieldChange = (nestedKey = '', field, value) => {
    let newUserRecord = { ...cloneDeep(userRecord) };
    const targetRow =
      nestedKey.split('.').reduce((acc, c) => acc[c], newUserRecord) ?? newUserRecord;
    targetRow[field] = value;
    setUserRecord({ ...newUserRecord });
  };

  //dummy values for Select Field
  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  }

  const channelsOptions = allChannels.map(({ name }) => ({ value: name, title: name }));

  const validateInput = (str, name) => {
    const regex = /^[ a-zA-Z0-9-_]+$/;
    if (!regex.test(str)) {
      antMessage.error(`"${name}" is not allowed to have special characters`, 2);
      return false;
    }
  };

  const handleUpdate = () => {
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!userRecord.firstName) {
      antMessage.error('"First Name" is not allowed to be empty', 2);
      return false;
    } else if (!userRecord.lastName) {
      antMessage.error('"Last Name" is not allowed to be empty', 2);
      return false;
    } else if (!userRecord.email) {
      antMessage.error('"Email" is not allowed to be empty', 2);
      return false;
    } else if (!userRecord.title) {
      antMessage.error('"title" is not allowed to be empty', 2);
      return false;
    } else if (!userRecord.userName) {
      antMessage.error('"Organization Unit" is not allowed to be empty', 2);
      return false;
    } else if (!role) {
      antMessage.error('"Role" is not allowed to be empty', 2);
      return false;
    } else if (!company) {
      antMessage.error('"Company" is not allowed to be empty', 2);
      return false;
    } else if (validateInput(userRecord.firstName, 'First Name') === false) return false;
    else if (validateInput(userRecord.lastName, 'Last Name') === false) return false;
    else if (validateInput(userRecord.title, 'Title') === false) return false;
    else if (userRecord.password && userRecord.password.length < 8) {
      antMessage.error('Password should be atleast 8 digits long', 2);
    } else if (userRecord.email.match(!mailformat)) {
      antMessage.error('Invalid Email Address', 2);
      return false;
    } else if (userRecord.email && userRecord.email.length < 11) {
      antMessage.error('Email should be atleast 11 characters long', 2);
    } else if (fileList.length === 0) {
      antMessage.error('"Profile Picture" is not allowed to be empty', 2);
      return false;
    } else if (!allowedPannels.length) {
      antMessage.error('Please allow atleast 1 permission', 2);
    } else {
      const { TV, print, websites, socialMedia, onlineVideos } = userRecord.subscription;
      const formData = new FormData();
      formData.append('firstName', userRecord.firstName);
      formData.append('lastName', userRecord.lastName);
      formData.append('title', userRecord.title);
      formData.append('userName', userRecord.userName);
      if (userRecord.password?.length > 0) {
        formData.append('password', userRecord.password);
      }
      formData.append('email', userRecord.email);
      formData.append('reportTiming', userRecord.reportTiming);
      formData.append('phoneNo', userRecord.phoneNo);
      formData.append('role', role);
      formData.append('company', company);
      formData.append('companyLimit', company);
      // formData.append('suspended', userRecord.suspended);
      formData.append('hideMedia', userRecord.hideMedia);
      formData.append('device', 'web');
      formData.append('subscription', JSON.stringify(userRecord.subscription));
      formData.append('topics', JSON.stringify(userRecord.topics));
      formData.append('keyWords', JSON.stringify(userRecord.keyWords));
      formData.append('intelligence', JSON.stringify(userRecord.intelligence));
      formData.append('graphs', JSON.stringify(userRecord.graphs));
      if (fileList[0]?.originFileObj) formData.append('photoPath', fileList[0]?.originFileObj);
      formData.append(
        'channels',
        JSON.stringify([...TV, ...print, ...websites, ...socialMedia, ...onlineVideos])
      );
      formData.append('pannels', JSON.stringify(userRecord.pannels));

      dispatch(
        usersActions.updateUser.request({
          userId: formDetails.id,
          data: formData,
        })
      );
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const checkPasswordValidations = password => {
    if (password.length < MIN_PASSWORD_LENGTH_WHEN_CREATING) {
      return antMessage.error(
        `Password must be at least ${MIN_PASSWORD_LENGTH_WHEN_CREATING} characters long!`,
        3
      );
    }
    if (password.length > MAX_PASSWORD_LENGTH_WHEN_CREATING) {
      return antMessage.error(
        `Password must be below ${MAX_PASSWORD_LENGTH_WHEN_CREATING} characters!`,
        3
      );
    }
    // * Checking at least 1 uppercase, lowercase, special character and number
    const hasComplexChars = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])/.test(
      password
    );
    if (!hasComplexChars) {
      return antMessage.error(
        `Password must contain at least 1 uppercase, 1 lowercase, 1 special character and 1 number!`,
        3
      );
    }
  };

  const handleSave = () => {
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!userRecord.firstName) {
      antMessage.error('"First Name" is not allowed to be empty', 2);
      return false;
    } else if (!userRecord.lastName) {
      antMessage.error('"Last Name" is not allowed to be empty', 2);
      return false;
    } else if (!userRecord.email) {
      antMessage.error('"Email" is not allowed to be empty', 2);
      return false;
    } else if (!userRecord.password) {
      antMessage.error('"Password" is not allowed to be empty', 2);
      return false;
    } else if (!userRecord.title) {
      antMessage.error('"title" is not allowed to be empty', 2);
      return false;
    } else if (!userRecord.userName) {
      antMessage.error('"Organization Unit" is not allowed to be empty', 2);
      return false;
    } else if (!role) {
      antMessage.error('"Role" is not allowed to be empty', 2);
      return false;
    } else if (!company) {
      antMessage.error('"Company" is not allowed to be empty', 2);
      return false;
    } else if (validateInput(userRecord.firstName, 'First Name') === false) return false;
    else if (validateInput(userRecord.lastName, 'Last Name') === false) return false;
    else if (validateInput(userRecord.title, 'Title') === false) return false;
    else if (checkPasswordValidations(userRecord.password)) {
    } else if (userRecord.email.match(!mailformat)) {
      antMessage.error('Invalid Email Address', 2);
      return false;
    } else if (userRecord.email && userRecord.email.length < 11) {
      antMessage.error('Email should be atleast 11 characters long', 2);
    } else if (fileList.length === 0) {
      antMessage.error('"Profile Picture" is not allowed to be empty', 2);
      return false;
    } else if (!allowedPannels.length) {
      antMessage.error('Please allow atleast 1 permission', 2);
    } else {
      const { TV, print, websites, socialMedia, onlineVideos } = userRecord.subscription;
      const formData = new FormData();
      formData.append('firstName', userRecord.firstName);
      formData.append('lastName', userRecord.lastName);
      formData.append('title', userRecord.title);
      formData.append('userName', userRecord.userName);
      formData.append('password', userRecord.password);
      formData.append('email', userRecord.email);
      formData.append('reportTiming', userRecord.reportTiming);
      formData.append('phoneNo', userRecord.phoneNo);
      formData.append('role', role);
      formData.append('company', company);
      formData.append('companyLimit', company);
      // formData.append('suspended', userRecord.suspended);
      formData.append('hideMedia', userRecord.hideMedia);
      formData.append('subscription', JSON.stringify(userRecord.subscription));
      formData.append('topics', JSON.stringify(userRecord.topics));
      formData.append('keyWords', JSON.stringify(userRecord.keyWords));
      formData.append('intelligence', JSON.stringify(userRecord.intelligence));
      formData.append('graphs', JSON.stringify(userRecord.graphs));
      formData.append('photoPath', '');
      if (fileList[0]?.originFileObj) formData.append('photoPath', fileList[0]?.originFileObj);
      formData.append(
        'channels',
        JSON.stringify([...TV, ...print, ...websites, ...socialMedia, ...onlineVideos])
      );
      formData.append('pannels', JSON.stringify(userRecord.pannels));

      dispatch(usersActions.addUser.request(formData));
    }
  };

  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">{formType === 'ADD' ? 'Add Users' : 'Edit User'}</h2>
          </Col>
          <Col span={2} offset={7}>
            <Button
              variant="secondary"
              onClick={() => {
                formType === 'ADD' ? handleSave() : handleUpdate();
              }}
            >
              {formType === 'ADD' ? 'SAVE' : 'UPDATE'}
            </Button>
          </Col>
        </Row>
        <Row align="start" className="form-row">
          <Col span={24} className="heading-col">
            Personal Details
          </Col>
          <Col span={2} className="form-picture">
            <PicturesWall
              customClass="user-picture"
              handleImageChange={handleImageChange}
              fileList={fileList}
            />
          </Col>
          <Col span={20} style={{ display: 'flex', alignItems: 'center' }}>
            <Row align="middle">
              <Col className="form-column" span={5}>
                <Form.Item label="First Name" required>
                  <Input
                    className="form-input"
                    name="firstName"
                    value={userRecord.firstName}
                    onChange={handleChange}
                    maxLength="32"
                  />
                </Form.Item>
              </Col>
              <Col className="form-column" span={5}>
                <Form.Item label="Username" required>
                  <Input
                    className="form-input"
                    name="userName"
                    value={userRecord.userName}
                    onChange={handleChange}
                    maxLength="32"
                  />
                </Form.Item>
              </Col>

              <Col className="form-column" span={5}>
                <Form.Item label="Title" required>
                  <Input
                    className="form-input"
                    name="title"
                    value={userRecord.title}
                    onChange={handleChange}
                    maxLength="64"
                  />
                </Form.Item>
              </Col>
              <Col className="form-column" span={5}>
                <Form.Item label="Last Name" required>
                  <Input
                    className="form-input"
                    name="lastName"
                    value={userRecord.lastName}
                    onChange={handleChange}
                    maxLength="32"
                  />
                </Form.Item>
              </Col>
              <Col className="form-column" span={5}>
                <Form.Item label="Email" required>
                  <Input
                    className="form-input"
                    name="email"
                    value={userRecord.email}
                    onChange={handleChange}
                    maxLength="64"
                  />
                </Form.Item>
              </Col>
              <Col className="form-column" span={5}>
                <Form.Item label="Password" required>
                  <Input
                    className="form-input"
                    type="password"
                    name="password"
                    value={userRecord.password}
                    onChange={handleChange}
                    maxLength="64"
                  />
                </Form.Item>
              </Col>
              <Col className="form-column" span={5}>
                <Form.Item label="Company" required>
                  <Spin spinning={companiesError} delay={500}>
                    <Select
                      value={company}
                      onChange={value => setCompany(value)}
                      size="small"
                      options={companies?.map(com => ({ title: com.name, value: com.id }))}
                    />
                  </Spin>
                </Form.Item>
              </Col>
              {role === 'Client' ? (
                <Col className="form-column" span={5}>
                  <Form.Item label="Phone Number">
                    <Input
                      className="form-input"
                      name="phoneNo"
                      value={userRecord.phoneNo}
                      onChange={handleChange}
                      maxLength="64"
                    />
                  </Form.Item>
                </Col>
              ) : role === 'Clipper' ? (
                <Col span={5}>
                  <Checkbox
                    onChange={() => handleNestedFieldChange('', 'hideMedia', !userRecord.hideMedia)}
                    style={{ marginTop: '10px' }}
                    checked={userRecord.hideMedia}
                    className="checkbox"
                    size="small"
                  >
                    <span
                      style={{ fontSize: '15px' }}
                      className={`checkbox-text ${
                        userRecord.hideMedia ? 'checkbox-text-active' : ''
                      }`}
                    >
                      Hide Media
                    </span>
                  </Checkbox>
                </Col>
              ) : (
                ''
              )}
            </Row>
          </Col>
        </Row>

        {/* Access Section */}
        <Access
          role={role}
          setRole={setRole}
          pannels={userRecord?.pannels ?? userDefaultPannels}
          handleNestedFieldChange={handleNestedFieldChange}
          allowedPannels={allowedPannels}
          setAllowedPannels={setAllowedPannels}
        />

        <Row align="middle" className="bordered-row">
          <Col span={24} className="heading-col">
            Subscription
          </Col>
          <Col span={24}>
            <Spin spinning={channelsError} delay={500}>
              <Row gutter="16">
                <Col span={4}>
                  <Form.Item>
                    <Select
                      mode="multiple"
                      SelectAll={SelectAll}
                      value={userRecord.subscription.TV}
                      onChange={value => {
                        if (value.includes('All')) {
                          value.map(value => {
                            handleNestedFieldChange('subscription', 'TV', [
                              value,
                              ...allChannels
                                ?.filter(({ type }) => type == 'Tv')
                                .map(({ name }) => name),
                            ]);
                          });
                        } else {
                          handleNestedFieldChange('subscription', 'TV', value);
                        }
                      }}
                      onDeselect={value => {
                        value === 'All' ? handleNestedFieldChange('subscription', 'TV', []) : null;
                      }}
                      size="middle"
                      placeholder="TV"
                      maxTagCount="responsive"
                      options={allChannels
                        ?.filter(({ type }) => type == 'Tv')
                        .map(({ name }) => ({ title: name, value: name }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Select
                      mode="multiple"
                      SelectAll={SelectAll}
                      value={userRecord.subscription.print}
                      onChange={value => {
                        if (value.includes('All')) {
                          value.map(value => {
                            handleNestedFieldChange('subscription', 'print', [
                              value,
                              ...allChannels
                                ?.filter(({ type }) => type == 'Print')
                                .map(({ name }) => name),
                            ]);
                          });
                        } else {
                          handleNestedFieldChange('subscription', 'print', value);
                        }
                      }}
                      onDeselect={value => {
                        value === 'All'
                          ? handleNestedFieldChange('subscription', 'print', [])
                          : null;
                      }}
                      size="middle"
                      maxTagCount="responsive"
                      placeholder="Print"
                      options={allChannels
                        ?.filter(({ type }) => type == 'Print')
                        .map(({ name }) => ({ title: name, value: name }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Select
                      mode="multiple"
                      SelectAll={SelectAll}
                      value={userRecord.subscription.websites}
                      onChange={value => {
                        if (value.includes('All')) {
                          value.map(value => {
                            handleNestedFieldChange('subscription', 'websites', [
                              value,
                              ...allChannels
                                ?.filter(({ type }) => type == 'Website/Blog')
                                .map(({ name }) => name),
                            ]);
                          });
                        } else {
                          handleNestedFieldChange('subscription', 'websites', value);
                        }
                      }}
                      onDeselect={value => {
                        value === 'All'
                          ? handleNestedFieldChange('subscription', 'websites', [])
                          : null;
                      }}
                      size="middle"
                      maxTagCount="responsive"
                      placeholder="Websites"
                      options={allChannels
                        ?.filter(({ type }) => type == 'Website/Blog')
                        .map(({ name }) => ({ title: name, value: name }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Select
                      mode="multiple"
                      SelectAll={SelectAll}
                      value={userRecord.subscription.socialMedia}
                      onChange={value => {
                        if (value.includes('All')) {
                          value.map(value => {
                            handleNestedFieldChange('subscription', 'socialMedia', [
                              value,
                              ...allChannels
                                ?.filter(({ type }) => type == 'Social')
                                .map(({ name }) => name),
                            ]);
                          });
                        } else {
                          handleNestedFieldChange('subscription', 'socialMedia', value);
                        }
                      }}
                      onDeselect={value => {
                        if (value === 'All')
                          handleNestedFieldChange('subscription', 'socialMedia', []);
                      }}
                      size="middle"
                      maxTagCount="responsive"
                      placeholder="Social Media"
                      options={allChannels
                        ?.filter(({ type }) => type == 'Social')
                        .map(({ name }) => ({ title: name, value: name }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Select
                      mode="multiple"
                      SelectAll={SelectAll}
                      getSelectAll={resetValues}
                      value={userRecord.subscription.onlineVideos}
                      onChange={value => {
                        if (value.includes('All')) {
                          value.map(value => {
                            handleNestedFieldChange('subscription', 'onlineVideos', [
                              value,
                              ...allChannels
                                ?.filter(({ type }) => type == 'Online')
                                .map(({ name }) => name),
                            ]);
                          });
                        } else {
                          handleNestedFieldChange('subscription', 'onlineVideos', value);
                        }
                      }}
                      onDeselect={value => {
                        if (value === 'All')
                          handleNestedFieldChange('subscription', 'onlineVideos', []);
                      }}
                      size="middle"
                      maxTagCount="responsive"
                      placeholder="Online Videos"
                      options={allChannels
                        ?.filter(({ type }) => type == 'Online')
                        .map(({ name }) => ({ title: name, value: name }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Spin>
          </Col>
        </Row>

        <Row align="middle" className="bordered-row">
          <Col span={24} className="heading-col">
            Topics
          </Col>
          <Col span={10}>
            <Spin spinning={topicsError} delay={500}>
              <TreeSelect
                value={userRecord.topics.reduce((values, topic) => {
                  values.push(...getTopicKeyFromValue(topic.topic3, topicMap, topic.topic1));
                  return values;
                }, [])}
                handleOnChange={handleTopicChange}
                size="middle"
                placeholder="Search topics"
                treeData={topics}
              />
            </Spin>
          </Col>
        </Row>

        <Row align="start" gutter="32" className="bordered-row no-padding">
          <Col span={8} className="right-border padding-40">
            <Row>
              <Col span={24} className="heading-col">
                Keywords
              </Col>
              <Col span={20}>
                <KeyWordTag
                  placeholder="Keyword"
                  handleSubmit={handleNestedFieldChange}
                  hashtags={userRecord.keyWords}
                  alarmOptions={alarms}
                />
              </Col>
            </Row>
          </Col>
          <Col span={8} className="right-border padding-40">
            <Row>
              <Col span={24} className="heading-col">
                Intelligence
              </Col>
              <Col className="sub-heading-col" span={24}>
                Select Intelligence
              </Col>
              <Col span={24}>
                <Row gutter="16" justify="center">
                  <Col span={8}>
                    <div
                      onClick={() =>
                        handleNestedFieldChange(
                          'intelligence',
                          'transcription',
                          !userRecord.intelligence.transcription
                        )
                      }
                      className={`toggle-button ${
                        userRecord.intelligence.transcription ? ' toggle-button-active' : ''
                      }`}
                    >
                      Transcription
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      onClick={() =>
                        handleNestedFieldChange(
                          'intelligence',
                          'translation',
                          !userRecord.intelligence.translation
                        )
                      }
                      className={`toggle-button ${
                        userRecord.intelligence.translation ? ' toggle-button-active' : ''
                      }`}
                    >
                      Translation
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      onClick={() =>
                        handleNestedFieldChange(
                          'intelligence',
                          'sentiments',
                          !userRecord.intelligence.sentiments
                        )
                      }
                      className={`toggle-button ${
                        userRecord.intelligence.sentiments ? ' toggle-button-active' : ''
                      }`}
                    >
                      Sentiments
                    </div>
                  </Col>
                  <Col span={12} className="margin-top">
                    <div
                      onClick={() =>
                        handleNestedFieldChange(
                          'intelligence',
                          'speakerRecognition',
                          !userRecord.intelligence.speakerRecognition
                        )
                      }
                      className={`toggle-button ${
                        userRecord.intelligence.speakerRecognition ? ' toggle-button-active' : ''
                      }`}
                    >
                      Speaker Recognition
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={8} className="padding-40">
            <Row>
              <Col span={24} className="heading-col">
                Report Timing
              </Col>
              <Col className="sub-heading-col" span={24}>
                Select Report Timing
              </Col>
              <Col span={24}>
                <Row gutter="16" justify="center">
                  <Col span={8}>
                    <div
                      onClick={() => handleNestedFieldChange('', 'reportTiming', 24)}
                      className={`toggle-button ${
                        userRecord.reportTiming === 24 ? 'toggle-button-active' : ''
                      }`}
                    >
                      24 Hours
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      onClick={() => handleNestedFieldChange('', 'reportTiming', 12)}
                      className={`toggle-button ${
                        userRecord.reportTiming === 12 ? 'toggle-button-active' : ''
                      }`}
                    >
                      12 Hours
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      onClick={() => handleNestedFieldChange('', 'reportTiming', 6)}
                      className={`toggle-button ${
                        userRecord.reportTiming === 6 ? 'toggle-button-active' : ''
                      }`}
                    >
                      6 Hours
                    </div>
                  </Col>
                  <Col span={8} className="margin-top">
                    <div
                      onClick={() => handleNestedFieldChange('', 'reportTiming', 3)}
                      className={`toggle-button ${
                        userRecord.reportTiming === 3 ? 'toggle-button-active' : ''
                      }`}
                    >
                      3 Hours
                    </div>
                  </Col>
                  <Col span={8} className="margin-top">
                    <div
                      onClick={() => handleNestedFieldChange('', 'reportTiming', 1)}
                      className={`toggle-button ${
                        userRecord.reportTiming === 1 ? 'toggle-button-active' : ''
                      }`}
                    >
                      1 Hour
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row align="start" gutter="32" className="bordered-row no-padding no-margin-top">
          <Col span={24} className="padding-40">
            <Row gutter="16">
              <Col span={24} className="heading-col">
                Graphs
              </Col>
              <Col span={6}>
                <Checkbox
                  onChange={() =>
                    handleNestedFieldChange('graphs', 'topTopics', !userRecord.graphs.topTopics)
                  }
                  checked={userRecord.graphs.topTopics}
                  className="checkbox"
                  size="middle"
                >
                  <span
                    className={`checkbox-text ${
                      userRecord.graphs.topTopics ? 'checkbox-text-active' : ''
                    }`}
                  >
                    Top 10 Topics on All Channels
                  </span>
                </Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox
                  onChange={() =>
                    handleNestedFieldChange('graphs', 'topGuests', !userRecord.graphs.topGuests)
                  }
                  checked={userRecord.graphs.topGuests}
                  className="checkbox"
                  size="middle"
                >
                  <span
                    className={`checkbox-text ${
                      userRecord.graphs.topGuests ? 'checkbox-text-active' : ''
                    }`}
                  >
                    Top Guests
                  </span>
                </Checkbox>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default UserForm;
