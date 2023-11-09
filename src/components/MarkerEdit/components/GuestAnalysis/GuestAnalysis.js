import React from 'react';
import { Input, Typography } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { Table, Select, SegmentContainer } from 'components/Common';

import { SENTIMENTS, SENTIMENT_VARIANTS } from 'constants/options';

import { markerEditActions } from 'modules/markerEdit/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { CrossIcon } from 'assets/icons';
import './GuestAnalysis.scss';
import { upperFirst } from 'lodash';

const { TextArea } = Input;

const {
  updateGuestAnalysis,
  addGuestAnalysis,
  removeGuestAnalysis,
  getGuestSentiment,
} = markerEditActions;

const GuestAnalysis = props => {
  const [sentimentValue, setsentimentValue] = React.useState('');
  const { jobID } = props;
  const { segments, programTime, programDate, guests, updateSentiment } = useSelector(
    state => state.markerEditReducer
  );
  console.log(`UpdateSentiments Is ${updateSentiment}`)
  const dispatch = useDispatch();
  const handleRefreshBtn = (data, id) => {
    let dataWithId = { data, id };
    // console.log("dataWithId",dataWithId)
    dispatch(
      getGuestSentiment.request({
        field: 'statement',
        value: dataWithId,
        index: data.tableIndex,
        key: data.key,
        loading: false,
      })
    );
  };




  React.useEffect(() => {
    if (updateSentiment) {
      handleChange(upperFirst(updateSentiment.sentiment), updateSentiment);
    }
  }, [updateSentiment]);
  const handleChange = (value, row) => {
    setsentimentValue(value);
    dispatch(
      updateGuestAnalysis({
        field: 'sentiment',
        index: row.tableIndex,
        key: row.key,
        value,
      })
    );
  };

  const columns = [
    {
      title: 'Participant Name',
      dataIndex: 'guest',
      key: 'guest',
      width: '30%',
      render: (name, row, index) => (
        <Select
          value={name}
          size="small"
          style={{ fontSize: '11px', width: '186px', textAlign: 'left' }}
          options={guests.map(({ name }) => ({ value: name, title: name }))}
          onChange={value =>
            dispatch(
              updateGuestAnalysis({
                field: 'guest',
                index: row.tableIndex,
                key: row.key,
                value,
              })
            )
          }
        />
      ),
    },
    {
      title: 'Statement',
      dataIndex: 'statement',
      key: 'statement',
      width: '40%',
      render: (statement, row) => {
        return (
          <TextArea
            onChange={e =>
              dispatch(
                updateGuestAnalysis({
                  field: 'statement',
                  value: e.target.value,
                  index: row.tableIndex,
                  key: row.key,
                })
              )
            }
            value={statement}
            className="bg-secondary-grey"
            rows={2}
          />
        );
      },
    },
    {
      title: 'Sentiment',
      dataIndex: 'sentiment',
      key: 'sentiment',
      width: '23%',
      render: (sentiment, row) => {
        return (
          <Select
            className={`${SENTIMENT_VARIANTS[sentiment]}`}
            value={
              sentimentValue
                ? sentimentValue.key === row.key
                  ? upperFirst(sentimentValue)
                  : sentiment
                : sentiment
            }
            size="small"
            style={{ fontSize: '11px', width: '95px' }}
            options={SENTIMENTS.map(title => ({ value: title, title }))}
            onChange={value => handleChange(value, row)}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      render: (option, row) => (
        <div className="icons-container">
          <button
            style={{
              color: 'orange',
              border: '1px solid',
              borderRadius: '8px',
              cursor: 'pointer',
              background:
                'linear-gradient(257.51deg,rgba(252, 95, 69, 0.1) 1.48%,rgba(254, 153, 96, 0.1) 59.07%)',
            }}
            onClick={() => {
              handleRefreshBtn(option, jobID);
            }}
          >
            Sentiment
          </button>
          {row.key == 0 && (
            <div style={{ textAlign: 'center', marginLeft: '14px' }}>
              <FontAwesomeIcon
                icon={faPlusCircle}
                size="lg"
                style={{ color: 'white', fontSize: 'large' }}
                onClick={() => dispatch(addGuestAnalysis(row.tableIndex))}
              />
            </div>
          )}
          {row.key !== 0 && (
            <FontAwesomeIcon
              icon={faTimesCircle}
              size="lg"
              style={{ color: 'white', fontSize: 'large' }}
              onClick={() => dispatch(removeGuestAnalysis({ index: row.tableIndex, key: row.key }))}
            />
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="guest-analysis-wrapper">
      {segments.map(({ title, color, themes, topics, guestAnalysis }, tableIndex) => {
        let pointerevent = tableIndex === segments.length - 1 ? 'none' : 'auto';
        let _color = pointerevent === 'none' ? 'gray' : color;
        let display;
        if (segments.length > 1 && tableIndex === segments.length - 1) display = 'none';

        return (
          <SegmentContainer
            key={tableIndex}
            title={title}
            color={_color}
            programDate={programDate}
            programTime={programTime}
            display={display}
            pointerevent={pointerevent}
            mainTheme={themes?.mainTheme}
            subTheme={themes?.subTheme}
            topic1={topics?.topic1}
            topic2={topics?.topic2}
            topic3={topics?.topic3}
            isMarker={true}
            isMarkerView={true}
          >
            <div
              className="guest-analysis-body-wrapper mb-10"
              style={{ pointerEvents: pointerevent }}
            >
              <Table
                columns={columns}
                rowKey={record => record.key}
                data={guestAnalysis.map((guest, key) => ({
                  key,
                  ...guest,
                  tableIndex,
                }))}
                pagination={false}
                variant="secondary"
              />
            </div>
          </SegmentContainer>
        );
      })}
    </div>
  );
};

export default GuestAnalysis;
