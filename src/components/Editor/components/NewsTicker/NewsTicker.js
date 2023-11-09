import React, { useState, useEffect } from 'react';
import { Card } from 'components/Common';
const { Text } = Typography;
import { Typography, Select, Form, Input, Skeleton, Space } from 'antd';
import { SegmentContainer, Button } from 'components/Common';
const { TextArea } = Input;
import image from '../../../../assets/images/ary-news.png';
import './NewsTicker.scss';
import InnerNewsTicker from './InnerNewsTicker';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { commonActions as COMMONACTIONS } from 'modules/common/actions';
import commonActions from 'modules/common/actions';
import { message as antMessage } from 'antd';

function NewsTicker() {
  const dispatch = useDispatch();

  const { tickerArray } = useSelector(state => state.commonReducer);

  const refreshData = () => {
    dispatch(commonActions.fetchTopics.request());
    antMessage.success('Refreshed', 1);
  };
  const removeInner = key => {
    const temp = tickerArray.filter(item => item.id !== key);
    dispatch(COMMONACTIONS.addTicker(temp));
  };

  return (
    <div className="news-ticker-wrapper-parent">
      {tickerArray.map((data, index) => {
        return (
          <InnerNewsTicker
            index={data.id}
            key={data.id}
            data={data}
            removeInner={removeInner}
          ></InnerNewsTicker>
        );
      })}
      {!tickerArray.length ? (
        <>
          <Card
            bg="dark"
            variant="secondary"
            content={
              <>
                <Space style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '350px',
                    }}
                  >
                    <Skeleton.Input
                      style={{ width: 100, borderRadius: '5px' }}
                      active={false}
                      size={'default'}
                    />
                    <Skeleton.Avatar active={false} size={'default'} shape={'circle'} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                    <div>
                      <Skeleton.Input
                        style={{ width: 170, borderRadius: '5px' }}
                        active={false}
                        size={'default'}
                      />
                      <Skeleton.Input
                        style={{ width: 170, marginLeft: '15px', borderRadius: '5px' }}
                        active={false}
                        size={'default'}
                      />
                    </div>
                    <div>
                      <Skeleton.Input
                        style={{ width: 355, marginTop: '20px', borderRadius: '5px' }}
                        active={false}
                        size={'default'}
                      />
                    </div>
                  </div>
                </Space>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '20px',
                    marginLeft: '8px',
                  }}
                >
                  <Skeleton.Image style={{ width: '355px', height: '50px', marginTop: '15px' }} />
                  <Skeleton.Image style={{ width: '355px', height: '50px', marginTop: '15px' }} />
                  <Skeleton.Image style={{ width: '355px', height: '50px', marginTop: '15px' }} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                    marginBottom: '15px',
                  }}
                >
                  <Skeleton.Button
                    active={false}
                    size={'large'}
                    style={{ width: '220px', height: '60px', borderRadius: '10px' }}
                    shape={'default'}
                    block={true}
                  />
                </div>
              </>
            }
          />
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default NewsTicker;
