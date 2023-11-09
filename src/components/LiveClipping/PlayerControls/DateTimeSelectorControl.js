import { Col, DatePicker, Form, Radio, Row, TimePicker } from 'antd';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { APPLY, APPLY_TO_ALL, CANCEL, SELECT_DATE_TIME } from 'constants/strings';
import { Button } from 'components/Common';
import 'rc-time-picker/assets/index.css';
import './PlayerControls.scss';
// import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { SET_TO_TIME, SET_FROM_TIME, SET_DATE, SET_BROADCAST_TYPE } from 'modules/common/actions';
const DateTimeSelectorControl = ({
  onApplyClick,
  onCancelClick,
  onApplyAll,
  setParentBroadcast,
}) => {
  const [form] = Form.useForm();
  const [broadcastType, setBroadcastType] = useState('interval');
  const [selectedDate, setDate] = useState(moment(new Date()));
  const [selectedToTime, setToTime] = useState(moment());
  const [selectedFromTime, setFromTime] = useState(
    moment().subtract(1, 'h').subtract(selectedToTime.minutes(), 'm')
  );
  const { broadcastAll } = useSelector(state => state.commonReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (broadcastType !== broadcastAll) {
      setBroadcastType(broadcastAll);
    }
  }, [broadcastAll]);
  const handleDate = date => {
    setDate(date);
    dispatch({ type: SET_DATE, payload: date });
  };

  const handleToTime = time => {
    setToTime(moment(time));
    dispatch({ type: SET_TO_TIME, payload: time });
  };

  const handleFromTime = time => {
    setFromTime(moment(time));
    dispatch({ type: SET_FROM_TIME, payload: time });
  };

  const handleBroadCast = value => {
    setBroadcastType(value);
    dispatch({ type: SET_BROADCAST_TYPE, payload: value });
  };

  const dateFormat = 'DD/MM/YYYY';
  const format = 'HH:mm';
  var isPlay = true;
  return (
    <div className="date-time-container">
      <h2>{SELECT_DATE_TIME}</h2>
      <Radio.Group onChange={e => handleBroadCast(e.target.value)} value={broadcastType}>
        <Radio value={'live'} className="radio">
          Live
        </Radio>
        <Radio value={'interval'} className="radio">
          Time Interval
        </Radio>
      </Radio.Group>
      {broadcastType === 'interval' && (
        <Form layout="vertical" form={form}>
          <Form.Item label="Date" name="date">
            <DatePicker
              defaultValue={selectedDate}
              format={dateFormat}
              onChange={date => handleDate(date)}
              direction="vertical"
            />
          </Form.Item>
          <Form.Item label="From" name="fromTime" />
          <TimePicker
            className="timePikerFrom"
            onChange={time => setFromTime(moment(time))}
            defaultValue={selectedFromTime}
            format={format}
            minuteStep={5}
            placeholder="Select Time"
          />
          <Form.Item label="To" name="toTime" />
          <TimePicker
            className="timePikerTo"
            onChange={time => setToTime(moment(time))}
            defaultValue={selectedToTime}
            format={format}
            minuteStep={5}
            placeholder="Select Time"
          />
        </Form>
      )}
      <div className="action-buttons">
        <Row justify="space-around">
          <Col>
            <Button variant="secondary" onClick={() => onCancelClick(false)}>
              {CANCEL}
            </Button>
          </Col>
          {/* <Col>
            <Button onClick={() => onApplyAll()}>{APPLY_TO_ALL}</Button>
          </Col> */}
          <Col>
            <Button
              disabled={
                (!selectedDate ||
                  !selectedFromTime ||
                  !selectedToTime ||
                  selectedToTime.diff(selectedFromTime, 'minute') <= 0) &&
                broadcastType === 'interval'
              }
              onClick={() => {
                onApplyClick(broadcastType, selectedDate, selectedFromTime, selectedToTime, isPlay);
              }}
            >
              {APPLY}
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};
DateTimeSelectorControl.propTypes = {
  onCancelClick: PropTypes.func.isRequired,
};
export default DateTimeSelectorControl;
