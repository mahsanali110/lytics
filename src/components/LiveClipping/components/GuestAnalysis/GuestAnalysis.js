import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { Table, Select, Card, TextArea } from 'components/Common';

import { SENTIMENTS, SENTIMENT_VARIANTS } from 'constants/options';

import { markerEditActions } from 'modules/markerEdit/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './GuestAnalysis.scss';
import { upperFirst } from 'lodash';
// import Form from 'rc-field-form/es/Form';

// const { TextArea } = Input;

const {
  updateGuestAnalysis,
  addGuestAnalysis,
  removeGuestAnalysis,
  getGuestSentiment,
} = markerEditActions;

const GuestAnalysis = ({
  programInfomation,
  color,
  tableIndex,
  guestAnalysis,
  pointerEvent,
  jobID,
}) => {
  // console.log(props.programInformation);
  const [sentimentValue, setsentimentValue] = React.useState('');

  const { segments, programTime, programDate, guests, updateSentiment } = useSelector(
    state => state.markerEditReducer
  );
  const dispatch = useDispatch();

  const guestList = programInfomation.guest;
  const handleRefreshBtn = (data, id) => {
    let dataWithId = { data, id };
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

  const onChange = (value, index, key) =>
    dispatch(
      updateGuestAnalysis({
        field: 'statement',
        value,
        index,
        key,
      })
    );

  const columns = [
    {
      dataIndex: 'guest',
      title: 'Name',
      key: 'guest',
      width: '20%',
      render: (name, row, index) => (
        <div className="table-column-field">
          <label className="table-column-field-label">Guest Name</label>
          <Select
            placeholder="Enter Here"
            value={name}
            size="small"
            style={{ fontSize: '11px', textAlign: 'left' }}
            options={guestList?.map(guest => ({ value: guest, title: guest }))}
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
        </div>
      ),
    },
    {
      dataIndex: 'statement',
      title: 'Statement',
      key: 'statement',
      width: '45%',
      render: (statement, row) => {
        return (
          <div className="table-column-field" style={{ marginTop: '15px' }}>
            {/* <div style={{height:'3px',width:'2px'}} /> */}
            <label className="table-column-field-label" style={{ marginTop: '4px' }}>
              Statement
            </label>
            <TextArea
              key={row.id}
              className="bg-light-grey content-segmentation-textarea"
              value={statement}
              onChange={onChange}
              index={row.tableIndex}
              rowKey={row.key}
            />
            {/* <TextArea
                placeholder="Statement Here"
                style={{ fontSize: '11px' }}
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
              /> */}
          </div>
        );
      },
    },
    {
      dataIndex: 'sentiment',
      title: 'Sentiment',
      key: 'sentiment',
      width: '15%',
      render: (sentiment, row) => {
        return (
          <div className="table-column-field">
            <label className="table-column-field-label">Sentiment</label>
            <Select
              style={{ fontSize: '11px' }}
              className={`${SENTIMENT_VARIANTS[sentiment]}`}
              value={
                sentimentValue
                  ? sentimentValue.key === row.key
                    ? upperFirst(sentimentValue)
                    : sentiment
                  : sentiment
              }
              size="small"
              style={{ fontSize: '11px' }}
              options={SENTIMENTS.map(title => ({ value: title, title }))}
              onChange={value => handleChange(value, row)}
            />
          </div>
        );
      },
    },
    {
      dataIndex: '',
      width: '20%',
      render: (option, row) => (
        <div className="icons-container">
          {row.key == 0 && (
            <div style={{ textAlign: 'center', marginTop: '15px', marginRight: '20px' }}>
              <FontAwesomeIcon
                icon={faPlusCircle}
                size="lg"
                style={{ color: '#3E404B', fontSize: 'large' }}
                onClick={() => dispatch(addGuestAnalysis(row.tableIndex))}
              />
            </div>
          )}
          {row.key !== 0 && (
            <FontAwesomeIcon
              icon={faTimesCircle}
              size="lg"
              style={{ color: '#3E404B', fontSize: 'large', marginTop: '15px' }}
              onClick={() => dispatch(removeGuestAnalysis({ index: row.tableIndex, key: row.key }))}
            />
          )}
          <button
            style={{
              color: 'rgba(222, 172, 85, 1)',
              border: '1px solid',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '15px',
              background:
                'linear-gradient(257.51deg,rgba(222, 172, 85, 0.1) 1.48%,rgba(222, 172, 85, 0.1) 59.07%)',
            }}
            onClick={() => {
              handleRefreshBtn(option, jobID);
            }}
          >
            Sentiment
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card
      style={{ border: `1px solid ${color}` }}
      title="Guest Analysis"
      shape="square"
      bg="mid-dark"
      variant="secondary"
      content={
        <div key={tableIndex} className="guest-analysis-body-wrapper">
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
            showHeader={false}
          />
        </div>
      }
    />
  );
};

export default GuestAnalysis;
