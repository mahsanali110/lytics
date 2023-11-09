import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { message as antMessage } from 'antd';
import { formatDate, timeDifference, getUser } from 'modules/common/utils';
import commonActions from 'modules/common/actions';
import { jobActions } from 'modules/jobs/actions';
import channelsActions from 'modules/channels/actions';
import { channelActions as multiViewActions } from 'modules/multiview/actions';
import {
  SegmentContainer,
  Button,
  // ActusPlayer,
  CustomPlayerControls,
} from 'components/Common';
import { LoadingPage } from 'components/Common';
import { Export, Process, Thumbnails } from './components';
import useActusPlayer from 'hooks/useActusPlayer';
import './Clipper.scss';
import { useHistory } from 'react-router';
import { SET_SEGMENT_DURATION, RESET_SEGMENT } from '../../modules/common/actions';
const Clipper = ({ setEditClipper, programData, from, to }) => {
  const [fileList, setFileList] = useState([]);

  const [visible, setVisible] = useState(true);
  const [isBroken, setIsBroken] = useState(false);
  const [_to, setToTime] = useState(to);
  const [_from, setFromTime] = useState(from);
  const dispatch = useDispatch();
  const playStorageF = value => {
    setToTime(moment(_to).add(value, 'minutes'));
  };
  const playStorageB = value => {
    setFromTime(moment(_from).subtract(value, 'minutes'));
  };
  useEffect(() => {
    dispatch({ type: SET_SEGMENT_DURATION, payload: moment.duration(_to.diff(_from)).asSeconds() });
  }, [_from, _to]);
  // useEffect(() => {
  //   window.addEventListener('beforeunload', alertUser);
  //   return () => {
  //     window.removeEventListener('beforeunload', alertUser);
  //   };
  // }, []);
  // const alertUser = e => {
  //   const message = 'Are you sure you want to leave? All provided data will be lost.';
  //   e.returnValue = message;
  //   return message;
  // };
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 1500);
  }, []);
  useEffect(() => {
    return () => dispatch({ type: RESET_SEGMENT });
  }, []);
  const [channel, setchannel] = useState({});
  const [qualtiyOptions, setQualtiyOptions] = useState([]);
  const [programInfo, setProgramInfo] = useState(programData);
  const [guests, setGuests] = useState([]);
  const [process, setProcess] = useState({
    programName: '',
    programType: '',
    anchor: [],
    priority: '',
    guest: [],
    language: '',
    region: '',
  });
  const [processExport, setProcessExport] = useState({
    comments: '',
    programDescription: '',
    output: {
      programType: '',
      format: '',
      frameSizePixel: '',
      frameSize: '',
    },
  });
  useEffect(() => {
    dispatch(multiViewActions.getActusURL.request());
  }, []);
  useEffect(() => {
    fetch('./preset.json').then(res => {
      res.json().then(data => {
        setQualtiyOptions([...data]);
      });
    });
  }, []);
  const { ActusPlayer, segments, handleSeekbarChange, actusPlayer, playerCurrentPosition, play } =
    useActusPlayer({
      channelLogoPath: programInfo.channelLogoPath,
      programDate: programInfo.programDate,
      isLive: false,
      channelName: programInfo.channel,
      from: _from,
      to: _to,
      playStorageF,
      playStorageB,
    });
  const clbkPlay = response => {
    if (response.error) {
      //setError(response.error);
      console.error(response.error);
      return;
    }
  };
  const history = useHistory();
  const { channels } = useSelector(state => state.channelsReducer);
  const { hosts, programTypes, programNames } = useSelector(state => state.commonReducer);
  const ACTUS_WEBHOST = useSelector(state => state.multiviewReducer.actus_webhost);
  useEffect(() => {
    channels.map(
      channel => {
        if (channel.actusId === programInfo.channel) {
          setchannel(channel);
        }
      },
      [programInfo, channels]
    );
  }, [channels]);
  const createThumbnail = (channel, time) =>
    `${ACTUS_WEBHOST}/api/channels/${channel}/thumbnail?time=${formatDate(
      time,
      'YYYY_MM_DD_HH_mm_ss'
    )}`;
  useEffect(() => {
    const programTime = [formatDate(from, 'hh:mm:ss A'), formatDate(to, 'hh:mm:ss A')].join(' ');
    const programTime1 = [formatDate(from, 'hh:mm:ss A'), formatDate(to, 'hh:mm:ss A')].join(
      ' to '
    );
    const thumbnailPath = createThumbnail(programData.channel, from);
    setProgramInfo({ ...programData, programTime1, thumbnailPath });
  }, [programData, from, to]);

  // check for broken thumbnails
  const checkBrokenThumbnail = url => {
    const img = new Image();
    img.src = url;
    img.onerror = () => {
      antMessage.error('Thumbnails failed to load, kindly try again', 5);
      setIsBroken(true);
    };
  };
  useEffect(() => {
    if (programInfo.thumbnailPath) {
      checkBrokenThumbnail(programInfo.thumbnailPath);
    }
  }, [programInfo.thumbnailPath]);

  useEffect(() => {
    fetchDefaultConfigurations();
    getChannels();
  }, []);
  const refresh = () => {
    fetchDefaultConfigurations();
    getChannels();
    antMessage.success('Refreshed', 1);
  };
  const getChannels = () => {
    dispatch(channelsActions.getChannels.request());
  };
  const fetchDefaultConfigurations = () => {
    dispatch(commonActions.fetchHosts.request());
    dispatch(commonActions.fetchProgramTypes.request());
    dispatch(commonActions.fetchProgramNames.request());
  };

  const handleSubmit = () => {
    if (isBroken) {
      antMessage.error('Thumbnails are required!', 5);
      return;
    }
    if (process.guest.length > 0) {
      setGuests([]);
      process.guest.forEach(g =>
        guests.push({
          name: g.split('|')[0],
          association: g.split('|')[1],
          description: g.split('|')[2],
        })
      );
    }
    const parts = createParts([...segments], from).filter(part => part.active);
    let videoTotalDuration = 0;
    parts.forEach(part => {
      videoTotalDuration += part.segmentDuration;
    });
    const { firstName, lastName } = getUser();
    const clippedBy = [firstName, lastName].join(' ');
    const { channel, programTime, thumbnailPath } = programInfo;
    const [{ from: segmentStart, to: segmentEnd }] = parts;
    let data = {
      channel: channel,
      channelLogoPath: programInfo.channelLogoPath,
      thumbnailPath: fileList,
      programTime: [formatDate(from, 'hh:mmA'), formatDate(to, 'hh:mmA')].join(' to '),
      programStartTime: formatDate(from, 'HH:mm'),
      programEndTime: formatDate(to, 'HH:mm'),
      segmentStartTime: formatDate(segmentStart, 'DD/MM/YYYY HH:mm:ss'),
      segmentEndTime: formatDate(segmentEnd, 'DD/MM/YYYY HH:mm:ss'),
      segmentDuration: timeDifference(segmentStart, segmentEnd, 'seconds'),
      ...process,
      programDate: formatDate(programInfo.programDate, 'DD/MM/YYYY'),
      actusRequest: {
        from: formatDate(from, 'YYYY-MM-DD HH:mm:ss'),
        to: formatDate(to, 'YYYY-MM-DD HH:mm:ss'),
        parts,
        videoTotalDuration,
      },
      clippedBy,
    };
    delete data.guest;
    let check = true;
    Object.values(data).map(obj => {
      if (obj === '') {
        check = false;
      }
    });
    if (check) {
      data = { ...data, ...processExport, guests };
      console.log(data);
      dispatch(jobActions.createJob.request(data));
      history.push('/');
    } else {
      antMessage.error('All fields are required', 2);
    }
  };
  const handleExportSubmit = () => {
    const parts = createParts([...segments], from).filter(part => part.active);
    const { firstName, lastName } = getUser();
    const clippedBy = [firstName, lastName].join(' ');
    const { channel, programTime, thumbnailPath } = programInfo;
    let data = {
      channel,
      channelLogoPath: programInfo.channelLogoPath,
      thumbnailPath: fileList,
      programTime: [formatDate(from, 'hh:mmA'), formatDate(to, 'hh:mmA')].join(' to '),
      programDate: formatDate(programInfo.programDate, 'DD/MM/YYYY'),
      actusRequest: {
        from: formatDate(from, 'YYYY-MM-DD HH:mm:ss'),
        to: formatDate(to, 'YYYY-MM-DD HH:mm:ss'),
        parts,
      },
      quality: processExport.output.format,
      programName: processExport.output.programType,
      clippedBy,
    };
    let check = true;
    Object.values(data).map(obj => {
      if (obj === '') {
        check = false;
      }
    });
    if (check) {
      data = { ...data, ...processExport };
      delete data.guest;
      dispatch(jobActions.exportVideo.request(data));
      history.push('/');
    } else {
      antMessage.error('All fields are required', 2);
    }
  };
  const createParts = (segments, startTime) => {
    return segments.map((segment, index) => {
      const prevSeg = segments[index - 1];
      const _from = prevSeg?.time ?? 0;
      const _to = segment.time;
      const segmentDuration = _to - _from;
      return createSegmentBoundry(startTime, _from, _to, segment.active, segmentDuration);
    });
  };
  const createSegmentBoundry = (dateTime, from, to, active, segmentDuration) => ({
    from: addTimeToDate(dateTime, from),
    to: addTimeToDate(dateTime, to),
    active: active,
    segmentDuration: segmentDuration,
  });
  const addTimeToDate = (date, seconds, format = 'YYYY-MM-DD HH:mm:ss') => {
    const _date = moment(date);
    return _date.add(seconds, 'seconds').format(format);
  };
  return (
    <>
      {visible ? (
        <LoadingPage />
      ) : (
        <div className="clipper-wrapper">
          {/* <div className="mb-10">
          <Button type="big" icon={LeftOutlined} onClick={() => setEditClipper(false)}>
            BACK
          </Button>
        </div> */}
          <Row gutter={16}>
            <Col span="9">{ActusPlayer}</Col>
            <Col span="5">
              <SegmentContainer title="Resources" color="#EF233C" variant="secondary">
                <Thumbnails
                  channel={programInfo.channel}
                  from={_from}
                  to={_to}
                  handleSeekbarChange={handleSeekbarChange}
                  actusPlayer={actusPlayer}
                  playerCurrentPosition={playerCurrentPosition}
                  play={play}
                />
              </SegmentContainer>
            </Col>
            <Col span="10" className="center-divider">
              <SegmentContainer
                title="Process & Export"
                color="#48BEEB"
                variant="secondary"
                className="ProcessExport"
              >
                <Row>
                  <Col span="12" className="center-divider">
                    <Process
                      programInfo={programInfo}
                      channel={channel}
                      refresh={refresh}
                      programTypes={programTypes}
                      hosts={hosts}
                      programNames={programNames}
                      process={process}
                      setProcess={setProcess}
                      handleSubmit={handleSubmit}
                      processExport={processExport}
                      setProcessExport={setProcessExport}
                    />
                  </Col>
                  <Col span="12">
                    <Export
                      programInfo={programInfo}
                      programNames={programNames}
                      channel={channel}
                      programTypes={programTypes}
                      processExport={processExport}
                      setProcessExport={setProcessExport}
                      handleExportSubmit={handleExportSubmit}
                      qualtiyOptions={qualtiyOptions}
                      setFileList={setFileList}
                      fileList={fileList}
                    />
                  </Col>
                </Row>
              </SegmentContainer>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};
Clipper.propTypes = {
  programData: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object,
  setEditClipper: PropTypes.func,
};
export default Clipper;
