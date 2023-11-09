import React from 'react';
import { useState, useEffect } from 'react';
import { Row, Col, Space, Image } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import CONFIG from '../../../player_config.json';
import { v1 as uuid } from 'uuid';
// Custom Imports
import _ from 'lodash';
import { message as antMessage } from 'antd';
import Channels from '../../MultiView/Channels/Channels';
import ChannelWindow from '../../MultiView/ChannelWindow/ChannelWindow';
import { Clipper } from 'components';
import channelActions from 'modules/channels/actions';
import './ClientMultiview.scss';
import { MenuAlt } from 'assets/icons';
import { channelActions as CA } from '../../../modules/multiview/actions';
// import { channelActions } from '../../modules/multiview/actions';
import { MAXIMUM_WINDOWS_ACTIVE } from '../../../constants/strings';
import { ACTUS_PATH, ACTUS_CHANNELS_API_PATH } from 'constants/index';
import axios from 'axios';
// const { addWindow } = channelActions;
const { addWindow } = CA;
const ClientMultiview = () => {
  const selectedChannelWindows = useSelector(state => state.multiviewReducer.selectedWindows);
  const { channels } = useSelector(state => state.channelsReducer);
  const [editClipper, setEditClipper] = useState(false);
  const [Newchannels, SetNewchannels] = useState([]);
  const [visibleChannel, setvisibleChannel] = useState('inactive');
  const [clipperData, setClipperData] = useState({});
  const dispatch = useDispatch();

  const showDrawer = type => {
    if (type === 'channel') {
      if (visibleChannel === 'inactive') {
        setvisibleChannel('');
      } else {
        setvisibleChannel('inactive');
      }
    }
  };
  let channelHeight = '';
  if (visibleChannel === 'inactive' ? (channelHeight = '60vh') : '');
  useEffect(() => {
    fetchChannels();
  }, []);
  const fetchChannels = () => dispatch(channelActions.getChannels.request());
  const onEditClip = ({ programDate, fromTime, toTime, channelName, channelIcon }) => {
    const data = {
      from: fromTime,
      to: toTime,
      programData: {
        channel: channelName,
        channelLogoPath: channelIcon,
        programDate,
      },
    };
    setClipperData(data);
    setEditClipper(true);
  };
  useEffect(() => {
    SetNewchannels(
      channels
        .filter(obj => {
          return obj.type === 'Tv';
        })
        .sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
    );
  }, [channels]);

  const checkActus = () => {
    axios
      .get('http://172.168.1.131/actus5/api/channels', {
        headers: {
          ActAuth: `ActAuth eyJpZCI6MiwibmFtZSI6ImFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJzZXNzaW9uX2d1aWQiOiJjN2UyMDIwNC1kMmNhLTQ2MjYtYjQyYi03ODc2YmRiNjkzNDYiLCJpbl9kaXJlY3Rvcnlfc2VydmljZSI6ZmFsc2UsImFkX2dyb3VwX25hbWUiOm51bGwsInNjb3BlIjoiY2xpcHBpbmciLCJJZGVudGl0eSI6bnVsbH0mWCZYJlgtNDY1Nzk0Njkw`,
        },
      })
      .then(res => {
        dispatch(CA.updateActus({ field: 'private', value: 'http://172.168.1.131/actus5' }));

        return;
      })
      .catch(error => {
        console.error(error);
      });
    axios
      .get(ACTUS_CHANNELS_API_PATH, {
        headers: {
          ActAuth: `ActAuth eyJpZCI6MiwibmFtZSI6ImFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJzZXNzaW9uX2d1aWQiOiJjN2UyMDIwNC1kMmNhLTQ2MjYtYjQyYi03ODc2YmRiNjkzNDYiLCJpbl9kaXJlY3Rvcnlfc2VydmljZSI6ZmFsc2UsImFkX2dyb3VwX25hbWUiOm51bGwsInNjb3BlIjoiY2xpcHBpbmciLCJJZGVudGl0eSI6bnVsbH0mWCZYJlgtNDY1Nzk0Njkw`,
        },
      })
      .then(res => {
        dispatch(CA.updateActus({ field: 'public', value: ACTUS_PATH }));

        return;
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    checkActus();
    dispatch(CA.getActusURL.request());
  }, []);

  return editClipper ? (
    <Clipper setEditClipper={setEditClipper} {...clipperData} />
  ) : (
    <div class="client-multiview-wrapper">
      <Row>
        <Col span={visibleChannel === 'inactive' ? '1' : '6'}>
          <div className={`channel-wrapper ${visibleChannel}`}>
            <Channels data={Newchannels} showDrawer={showDrawer} role="client" />
          </div>
        </Col>
        <Col span={visibleChannel === 'inactive' ? '23' : '18'}>
          <div>
            <Row gutter={16}>
              {selectedChannelWindows.map((ch, index) => {
                return (
                  <React.Fragment key={ch.id}>
                    <Col
                      span={10}
                      key={ch.id}
                      // style={{paddingLeft:'3rem'}}
                      className="ant-last-col animate__animated animate__slideInLeft abc"
                    >
                      <ChannelWindow
                        id={ch.id}
                        name={ch.name}
                        icon={ch.logoPath}
                        windowIndex={index}
                        onEditClip={onEditClip}
                        ControlMute={{
                          Muteflag: index ? true : false,
                          Count: index === 1 ? 1 : 0,
                        }}
                      />
                    </Col>
                  </React.Fragment>
                );
              })}
            </Row>
          </div>
        </Col>
      </Row>
      <div className="channel-drawer-button-main">
        <div className="channel-drawer-button-left">
          <Space>
            <div
              className="channel-drawer-button-wrapper"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{ height: '70px' }}
                onClick={() => showDrawer('channel')}
                className={visibleChannel === 'inactive' ? ' ' : 'unshowSlider'}
              >
                <MenuAlt
                  style={{
                    width: '3rem',
                    height: '3rem',
                    fontSize: '2rem',
                    marginTop: '1rem',
                    marginLeft: '12px',
                    marginBottom: '2rem',
                  }}
                ></MenuAlt>
              </div>
              <div style={{ maxHeight: '92%', overflow: 'auto' }}>
                {Newchannels.map(c => (
                  <Image
                    style={{
                      //  marginLeft: '5px',
                      marginTop: '10px',
                      //  marginBottom: '6px',
                      cursor: 'pointer',
                      // margin:'10px',
                      paddingLeft: '14px',
                      paddingRight: '14px',
                      paddingBottom: '8px',
                      paddingTop: '8px',
                      marginHorizontal: 10,
                      //  backgroundColor:'grey'
                    }}
                    src={c.logoPath}
                    width={70}
                    height={60}
                    fallback="placeholder.png"
                    preview={false}
                    onClick={() => {
                      if (selectedChannelWindows.length < CONFIG.CLIENT.MAX_WINDOWS) {
                        dispatch(addWindow({ ...c, id: uuid() }));
                        dispatch({ type: 'CHANNEL_NAME', payload: c.actusId });
                      } else {
                        antMessage.warning(MAXIMUM_WINDOWS_ACTIVE);
                      }
                    }}
                  ></Image>
                ))}
              </div>
            </div>
          </Space>
        </div>
      </div>
    </div>
  );
};
export default ClientMultiview;
