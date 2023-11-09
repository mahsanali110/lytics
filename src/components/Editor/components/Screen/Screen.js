import React, { useState, useEffect } from 'react';
import { Card } from 'components/Common';
const { Text } = Typography;
import { Typography, Select, Form, Input, Skeleton, Space } from 'antd';
import { SegmentContainer, Button } from 'components/Common';
const { TextArea } = Input;
import image from '../../../../assets/images/ary-news.png';
import './Screen.scss';
import InnerScreen from './InnerScreen';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { commonActions as COMMONACTIONS } from 'modules/common/actions';
import commonActions from 'modules/common/actions';
import { message as antMessage } from 'antd';

function Screen() {
  // const [shotArray, setshotArray] = useState([]);
  const dispatch = useDispatch();
  const { shotArray } = useSelector(state => state.commonReducer);

  const refreshData = () => {
    dispatch(commonActions.fetchTopics.request());
    antMessage.success('Refreshed', 1);
  };
  const removeInnerShot = key => {
    let temp = shotArray.filter(item => item.id !== key);
    dispatch(COMMONACTIONS.addShot(temp));
  };
  return (
    <div className="screen-parent">
      {shotArray.map((data, index) => {
        return (
          <InnerScreen
            index={data.id}
            key={data.id}
            id={data.id}
            channelIcon={data.channelIcon}
            channelName={data.channelName}
            windowIndex={data.windowIndex}
            IMGsrc={data.IMGsrc}
            removeInnerShot={removeInnerShot}
          ></InnerScreen>
        );
      })}
      {!shotArray.length ? (
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
                    marginTop: '20px',
                    marginLeft: '8px',
                  }}
                >
                  <Skeleton.Image style={{ marginTop: '15px' }} />
                  <Skeleton.Image style={{ marginTop: '15px', marginLeft: '33px' }} />
                  <Skeleton.Image style={{ marginTop: '15px', marginLeft: '33px' }} />
                  <Skeleton.Image style={{ marginTop: '15px' }} />
                  <Skeleton.Image style={{ marginTop: '15px', marginLeft: '33px' }} />
                  <Skeleton.Image style={{ marginTop: '15px', marginLeft: '33px' }} />
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

export default Screen;
