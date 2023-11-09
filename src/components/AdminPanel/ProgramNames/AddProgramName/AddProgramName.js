import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col, Input, Row, Spin } from 'antd';
import { Button, Select } from 'components/Common';
import _omit from 'lodash/omit';
import { message as antMessage, TimePicker } from 'antd';
import moment from 'moment';

import '../../FormStyles.scss';
import programNamesActions from 'modules/programNames/actions';
import hostsActions from 'modules/hosts/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const ProgramNameForm = () => {
  const dispatch = useDispatch();
  const [hostsCount, setHostsCount] = useState(1);
  const { formDetails, programTypes, channels, channelsError, programTypesError } = useSelector(
    state => state.programNamesReducer
  );
  const { formType } = useSelector(state => state.settingsReducer);
  const { hosts, hostError } = useSelector(state => state.hostsReducer);
  const [programNameRecord, setProgramNameRecord] = useState({ ...formDetails });
  const [channel, setChannel] = useState(formDetails.channel);
  const [host, setHosts] = useState(formDetails.hosts);
  const [type, setType] = useState(formDetails.type);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  useEffect(() => {
    formDetails.fromTime ? setFromTime(moment(formDetails.fromTime)) : setFromTime(null);
    formDetails.toTime ? setToTime(moment(formDetails.toTime)) : setToTime(null);
  }, [formDetails]);

  useEffect(() => {
    if (formType === 'ADD') {
      dispatch(programNamesActions.resetFormDetails());
      dispatch(hostsActions.getHosts.request());
      setChannel('');
      setType('');
    }
  }, [formType]);

  useEffect(() => {
    dispatch(hostsActions.getHosts.request());
    setProgramNameRecord({ ...formDetails });
    setChannel(formDetails.channel);
    setType(formDetails.type);
    setHosts(formDetails.host);
  }, [formDetails]);

  useEffect(() => {
    if (hostError || hostError === networkError) {
      setHostsCount(prevCount => prevCount + 1);
      if (hostsCount <= errorCount) {
        setTimeout(() => {
          dispatch(hostsActions.getHosts.request());
        }, errorDelay);
      } else if (hostError === networkError) {
        alert(`${hostError}, Please refresh!`);
        window.location.reload();
      } else if (hostError !== networkError) {
        alert(`${hostError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [hostError]);

  const channelsOptions = channels?.map(({ name }) => ({ value: name, title: name }));
  const typesOptions = programTypes?.map(({ name }) => ({ value: name, title: name }));
  const hostsOptions = hosts?.map(({ name }) => ({ value: name, title: name }));

  const handleChange = event => {
    const { name, value } = event.target;
    setProgramNameRecord({ ...programNameRecord, [name]: value });
  };

  const setProgramTime = value => {
    const [from, to] = value ?? [null, null];
    setFromTime(from);
    setToTime(to);
  };

  const handleUpdate = () => {
    if (!programNameRecord.title) {
      antMessage.error('"Title" is not allowed to be empty', 2);
      return false;
    } else if (programNameRecord.title.includes('.')) {
      antMessage.error('"." is not allowed in title', 2);
      return false;
    } else if (!channel) {
      antMessage.error('"Channel" is not allowed to be empty', 2);
      return false;
    } else if (!type) {
      antMessage.error('"Program Type" is not allowed to be empty', 2);
      return false;
    } else if (!programNameRecord.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (!fromTime || !toTime) {
      antMessage.error('"Program Time" is not allowed to be empty', 2);
      return false;
    } else {
      dispatch(
        programNamesActions.updateProgramName.request({
          programNameId: formDetails.id,
          data: {
            ..._omit(programNameRecord, ['id']),
            host,
            channel,
            type,
            toTime: moment(toTime).format('YYYY-MM-DDTHH:mm:ss'),
            fromTime: moment(fromTime).format('YYYY-MM-DDTHH:mm:ss'),
          },
        })
      );
    }
  };

  const handleSave = () => {
    if (!programNameRecord.title) {
      antMessage.error('"Title" is not allowed to be empty', 2);
      return false;
    } else if (programNameRecord.title.includes('.')) {
      antMessage.error('"." is not allowed in title', 2);
      return false;
    } else if (!channel) {
      antMessage.error('"Channel" is not allowed to be empty', 2);
      return false;
    } else if (!type) {
      antMessage.error('"Program Type" is not allowed to be empty', 2);
      return false;
    } else if (!programNameRecord.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (!fromTime || !toTime) {
      antMessage.error('"Program Time" is not allowed to be empty', 2);
      return false;
    } else {
      const payload = {
        ...programNameRecord,
        host,
        channel,
        type,
        toTime: moment(toTime).format('YYYY-MM-DDTHH:mm:ss'),
        fromTime: moment(fromTime).format('YYYY-MM-DDTHH:mm:ss'),
      };
      dispatch(programNamesActions.addProgramName.request(payload));
    }
  };

  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">{formType === 'ADD' ? 'Add Program' : 'Edit Program'}</h2>
          </Col>
          <Col span={2} offset={7}>
            <Button
              onClick={() => {
                formType === 'ADD' ? handleSave() : handleUpdate();
              }}
              variant="secondary"
            >
              {formType === 'ADD' ? 'SAVE' : 'UPDATE'}
            </Button>
          </Col>
        </Row>
        <Row className="form-row">
          <Col span={2} />
          <Col className="form-column" span={6}>
            <Form.Item label="Title" required>
              <Input
                className="form-input"
                name="title"
                value={programNameRecord.title}
                onChange={handleChange}
                maxLength="32"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Channel" required>
              <Spin spinning={channelsError} delay={500}>
                <Select
                  size="small"
                  name="channel"
                  value={channel}
                  onChange={value => setChannel(value)}
                  options={channelsOptions}
                />
              </Spin>
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Program Type" required>
              <Spin spinning={programTypesError} delay={500}>
                <Select
                  size="small"
                  name="type"
                  value={type}
                  onChange={value => setType(value)}
                  options={typesOptions}
                />
              </Spin>
            </Form.Item>
          </Col>
        </Row>
        <Row className="form-row" style={{ marginTop: '20px' }}>
          <Col span={2} />
          <Col className="form-column" span={6}>
            <Form.Item label="Description" required>
              <Input
                className="form-input"
                name="description"
                value={programNameRecord.description}
                onChange={handleChange}
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Host">
              <Spin spinning={hostError} delay={500}>
                <Select
                  mode="multiple"
                  size="small"
                  name="host"
                  value={host}
                  onChange={value => setHosts(value)}
                  options={hostsOptions}
                />
              </Spin>
            </Form.Item>
          </Col>
          <Col className="form-column" span={6} style={{ marginRight: '0px' }}>
            <Form.Item label="Program Time">
              <TimePicker.RangePicker
                required
                style={{ width: '100%' }}
                format="HH:mm"
                value={[fromTime, toTime]}
                onChange={value => setProgramTime(value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default ProgramNameForm;
