import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Grid,
  Typography,
  TextField,
  DatePicker,
  TimePicker,
} from '@mui/material';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  SET_TO_TIME,
  SET_FROM_TIME,
  SET_DATE,
  SET_BROADCAST_TYPE,
} from 'modules/common/actions';
import {
  APPLY,
  APPLY_TO_ALL,
  CANCEL,
  SELECT_DATE_TIME,
} from 'constants/strings';
import 'rc-time-picker/assets/index.css';
import './PlayerControls.scss';

const DateTimeSelectorControl = ({
  onApplyClick,
  onCancelClick,
  onApplyAll,
  setParentBroadcast,
}) => {
  const [broadcastType, setBroadcastType] = useState('interval');
  const [selectedDate, setDate] = useState(moment(new Date()));
  const [selectedToTime, setToTime] = useState(moment());
  const [selectedFromTime, setFromTime] = useState(
    moment().subtract(1, 'h').subtract(selectedToTime.minutes(), 'm')
  );
  const { broadcastAll } = useSelector((state) => state.commonReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (broadcastType !== broadcastAll) {
      setBroadcastType(broadcastAll);
    }
  }, [broadcastAll]);

  useEffect(() => {
    dispatch({ type: SET_TO_TIME, payload: moment() });
    dispatch({
      type: SET_FROM_TIME,
      payload: moment()
        .subtract(1, 'h')
        .subtract(selectedToTime.minutes(), 'm'),
    });
  }, []);

  const handleDate = (date) => {
    setDate(date);
    dispatch({ type: SET_DATE, payload: date });
  };

  const handleToTime = (time) => {
    setToTime(moment(time));
    dispatch({ type: SET_TO_TIME, payload: time });
  };

  const handleFromTime = (time) => {
    setFromTime(moment(time));
    dispatch({ type: SET_FROM_TIME, payload: time });
  };

  const handleBroadCast = (value) => {
    setBroadcastType(value);
    dispatch({ type: SET_BROADCAST_TYPE, payload: value });
  };

  const dateFormat = 'DD/MM/YYYY';
  const format = 'HH:mm';
  var isPlay = true;

  return (
    <div className="date-time-container">
      <Typography variant="h5">{SELECT_DATE_TIME}</Typography>
      <RadioGroup
        aria-label="broadcastType"
        name="broadcastType"
        value={broadcastType}
        onChange={(e) => handleBroadCast(e.target.value)}
      >
        <FormControlLabel value="live" control={<Radio />} label="Live" />
        <FormControlLabel
          value="interval"
          control={<Radio />}
          label="Time Interval"
        />
      </RadioGroup>
      {broadcastType === 'interval' && (
        <FormControl component="fieldset">
          <FormLabel component="legend">Date & Time Interval</FormLabel>
          <DatePicker
            label="Date"
            value={selectedDate}
            onChange={(date) => handleDate(date)}
            format={dateFormat}
          />
          <TimePicker
            label="From"
            value={selectedFromTime}
            onChange={(time) => handleFromTime(time)}
            format={format}
            minutesStep={5}
          />
          <TimePicker
            label="To"
            value={selectedToTime}
            onChange={(time) => handleToTime(time)}
            format={format}
            minutesStep={5}
          />
        </FormControl>
      )}
      <div className="action-buttons">
        <Grid container spacing={2} justify="space-around">
          <Grid item>
            <Button variant="outlined" onClick={() => onCancelClick(false)}>
              {CANCEL}
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => onApplyAll()}>
              {APPLY_TO_ALL}
            </Button>
          </Grid>
          <Grid item>
            <Button
              disabled={
                (!selectedDate ||
                  !selectedFromTime ||
                  !selectedToTime ||
                  selectedToTime.diff(selectedFromTime, 'minute') <= 0) &&
                broadcastType === 'interval'
              }
              onClick={() => {
                onApplyClick(
                  broadcastType,
                  selectedDate,
                  selectedFromTime,
                  selectedToTime,
                  isPlay
                );
              }}
              variant="contained"
              color="primary"
            >
              {APPLY}
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

DateTimeSelectorControl.propTypes = {
  onCancelClick: PropTypes.func.isRequired,
};

export default DateTimeSelectorControl;
