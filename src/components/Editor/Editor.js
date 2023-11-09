import React, { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Prompt } from 'react-router-dom';
import { v1 as uuid } from 'uuid';
import { cloneDeep } from 'lodash';
import { message as antMessage } from 'antd';

import './Editor.scss';

import { LoadingPage } from 'components/Common';
import {
  Tabs,
  ChannelList,
  LiveVideoPlayer,
  JobTable,
  GeneralTabContent,
  Clip,
  SavePopup,
  Screen,
  NewsTicker,
} from './components';
import { getUser, isEmpty, formatDate, DataURIToBlob } from 'modules/common/utils';
import { USERS_BASE_URL } from 'constants/config';
import { ACTUS_PATH, ACTUS_CHANNELS_API_PATH } from 'constants/index';

import channelsActions from 'modules/channels/actions';
import { channelActions as CA } from '../../modules/multiview/actions';
import { liveClippingActions } from 'modules/LiveClipping/actions';
import { jobActions } from 'modules/jobs/actions';
import programNamesActions from 'modules/programNames/actions';
import programTypesActions from 'modules/programTypes/actions';
import guestsActions from 'modules/guests/actions';
import hostsActions from 'modules/hosts/actions';
import libraryJobsActions from 'modules/libraryJobs/actions';
import { commonActions } from 'modules/common/actions';

import useConfirm from 'hooks/useConfirm';
import { DEFAULT_SEGMENT } from 'constants/options';
import editorActions from 'modules/editor/actions';
import usersActions from 'modules/users/actions';
import { URGENT_PRIORITY } from 'constants/strings';

function Editor() {
  //////////// Hooks /////////////////
  const { confirm } = useConfirm();
  const dispatch = useDispatch();
  const { job } = useSelector(state => state.jobsReducer);
  const {
    clipData,
    screenData,
    tickerData,
    clipProcessFields,
    screenProcessFields,
    tickerProcessFields,
    activeTab,
    actusVideoId,
    exportVideo,
    youtubeData,
  } = useSelector(state => state.editorReducer);
  const { formDetails: user } = useSelector(state => state.usersReducer);
  const { tickerArray, shotArray } = useSelector(state => state.commonReducer);

  const { selectedWindows } = useSelector(state => state.liveClippingReducer);
  const { isLoggedIn } = useSelector(state => state.authReducer);

  const element = useRef(null);
  const [height, setHeight] = useState('auto');

  ////////// End Hooks //////////////

  //////////// Effects ////////////
  useLayoutEffect(() => {
    calcHeight();
  }, [element.current]);

  useEffect(() => {
    checkActus();
    // dispatch(jobActions.resetJob());
    dispatch(jobActions.reset.request());
    dispatch(CA.getActusURL.request());
    window.addEventListener('resize', calcHeight);
    fetchDefault();
    // initBeforeUnLoad(true);
    return () => {
      dispatch(liveClippingActions.removeWindow({ windowIndex: 0 }));
      resetReducers();
    };
  }, []);

  //////////// End Effects ////////////

  //////////// Methods ////////////
  const calcHeight = () => {
    if (element.current) {
      let newHeight = window.innerHeight - (element.current.offsetTop + 30);
      setHeight(`${newHeight}px`);
    }
  };

  const fetchDefault = () => {
    dispatch(channelsActions.getChannels.request());
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programTypesActions.getProgramTypes.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(hostsActions.getHosts.request());
    dispatch(usersActions.getUsers.request({ role: 'Client' }));
    dispatch(usersActions.getUser.request(getUser().id));
  };

  const resetReducers = () => {
    dispatch(editorActions.resetReducer());
    dispatch(commonActions.updataByField({ field: 'tickerArray', value: [] }));
    dispatch(commonActions.updataByField({ field: 'shotArray', value: [] }));
  };

  const resetTickerReducers = () => {
    dispatch(editorActions.resetTickerData());
    dispatch(commonActions.updataByField({ field: 'tickerArray', value: [] }));
  };

  const resetScreenReducers = () => {
    dispatch(editorActions.resetScreenData());
    dispatch(commonActions.updataByField({ field: 'shotArray', value: [] }));
  };

  const initBeforeUnLoad = showExitPrompt => {
    window.onbeforeunload = event => {
      if (showExitPrompt) {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = '';
        }
        window.history.pushState({}, '', '/#/mediamanager');
        return '';
      }
    };
  };

  const closeWindow = async () => {
    let ifConfirm = await confirm('You will lose your unsaved progress!');

    if (ifConfirm) {
      dispatch(liveClippingActions.removeWindow({ windowIndex: 0 }));
      resetReducers();
    }
    return ifConfirm;
  };

  const resetJob = async () => {
    let ifConfirm = await confirm('You will lose your unsaved progress!');
    if (ifConfirm) dispatch(jobActions.resetJob());
    return ifConfirm;
  };

  const checkActus = () => {
    axios
      .get('http://172.168.1.131/actus5/api/channels', {
        headers: {
          ActAuth: `ActAuth eyJpZCI6MiwibmFtZSI6ImFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJzZXNzaW9uX2d1aWQiOiJjN2UyMDIwNC1kMmNhLTQ2MjYtYjQyYi03ODc2YmRiNjkzNDYiLCJpbl9kaXJlY3Rvcnlfc2VydmljZSI6ZmFsc2UsImFkX2dyb3VwX25hbWUiOm51bGwsInNjb3BlIjoiY2xpcHBpbmciLCJJZGVudGl0eSI6bnVsbH0mWCZYJlgtNDY1Nzk0Njkw`,
        },
      })
      .then(res => {
        console.log('http://172.168.1.131/actus5');
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
        console.log(ACTUS_PATH);
        dispatch(CA.updateActus({ field: 'public', value: ACTUS_PATH }));

        return;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSubmit = () => {
    const { parts } = clipData;
    const { firstName, lastName } = getUser();
    /// for joining two variables in an array
    const clippedBy = [firstName, lastName].join(' ');
    let data = {
      clippedBy,
      channel: selectedWindows[0].name,
      channelLogoPath: selectedWindows[0].logoPath,
      language: selectedWindows[0].language,
      region: selectedWindows[0].region,
      priority: URGENT_PRIORITY, // set to URGENT for fast processing
      source: 'Tv',
      thumbnailPath: [
        {
          uid: uuid(),
          url: clipData.thumbnailPath,
        },
      ],
      clipTitle: clipData.clipTitle,
      programDescription: clipData.programDescription,
      isPersonalLibrary: clipData.isPersonalLibrary,
      isCompanyLibrary: clipData.isCompanyLibrary,
      programTime: clipData.programTime,
      programStartTime: clipData.programTimeFrom,
      programEndTime: clipData.programTimeTo,
      segmentTime: clipData.programTime,
      segmentStartTime: formatDate(parts.from, 'YYYY-MM-DD HH:mm:ss'),
      segmentEndTime: formatDate(parts.to, 'YYYY-MM-DD HH:mm:ss'),
      segmentDuration: clipData.segmentDuration,
      programName: clipData.programName,
      programType: clipData.programType,
      programDate: formatDate(clipData.programDate, 'YYYY-MM-DD'),
      anchor: clipData.anchor,
      guests: clipData.guests,
      actusVideoId,
      segments: [{ ...cloneDeep(DEFAULT_SEGMENT) }],
    };
    let check = true;
    let errMsg;
    Object.keys(data).map(key => {
      if (
        key == 'guests' ||
        key == 'anchor' ||
        key == 'programDescription' ||
        key == 'programName' ||
        key == 'programType'
      )
        return;
      if (isEmpty(data[key])) {
        check = false;
        errMsg = `"${key}" is required`;
        return;
      }
    });
    if (check) {
      dispatch(libraryJobsActions.createJob.request({ data, headers: {} }));
    } else {
      antMessage.error(errMsg, 2);
    }
  };

  const handleSubmitJob = () => {
    const data = {
      ...job,
      isPersonalLibrary: clipData.isPersonalLibrary,
      isCompanyLibrary: clipData.isCompanyLibrary,
      clipTitle: clipData.clipTitle,
      programDescription: clipData.programDescription,
      isJob: true,
    };

    let check = true;
    let errMsg;
    Object.keys(data).map(key => {
      if (
        key == 'isPersonalLibrary' ||
        key == 'isCompanyLibrary' ||
        key == 'clipTitle' ||
        key == 'programDescription' ||
        key == 'programDescription'
      ) {
        if (isEmpty(data[key])) {
          check = false;
          errMsg = `"${key}" is required`;
          return;
        }
      }
    });
    if (check) {
      dispatch(libraryJobsActions.createJob.request({ data, headers: {} }));
    } else {
      antMessage.error(errMsg, 2);
    }
  };

  const handleSubmitScreen = () => {
    const { firstName, lastName } = getUser();
    /// for joining two variables in an array
    const clippedBy = [firstName, lastName].join(' ');
    const formData = new FormData();
    let data = {
      clippedBy,
      channel: selectedWindows[0].name,
      channelLogoPath: selectedWindows[0].logoPath,
      language: selectedWindows[0].language,
      region: selectedWindows[0].region,
      priority: URGENT_PRIORITY,
      source: 'ScreenShot',
      clipTitle: screenData.clipTitle,
      programDescription: screenData.programDescription,
      isPersonalLibrary: screenData.isPersonalLibrary,
      isCompanyLibrary: screenData.isCompanyLibrary,
      programTime: formatDate(screenData.programDate, 'HH:mm'),
      programName: screenData.programName,
      programType: screenData.programType,
      programDate: formatDate(screenData.programDate, 'DD/MM/YYYY'),
    };

    let check = true;
    let errMsg;
    Object.keys(data).map(key => {
      if (
        key == 'guests' ||
        key == 'anchor' ||
        key == 'programDescription' ||
        key == 'programName' ||
        key == 'programType'
      )
        return;
      if (isEmpty(data[key])) {
        check = false;
        errMsg = `"${key}" is required`;
        return;
      }
    });
    if (check) {
      Object.keys(data).forEach(key => {
        formData.append(`${key}`, data[key]);
      });
      shotArray[0]?.IMGsrc?.forEach(shot => {
        formData.append('files', DataURIToBlob(shot));
      });
      dispatch(
        libraryJobsActions.createJob.request({
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    } else {
      antMessage.error(errMsg, 2);
    }
  };

  const handleSubmitTickcer = () => {
    const { firstName, lastName } = getUser();
    /// for joining two variables in an array
    const clippedBy = [firstName, lastName].join(' ');
    const formData = new FormData();
    let data = {
      clippedBy,
      channel: selectedWindows[0].name,
      channelLogoPath: selectedWindows[0].logoPath,
      language: selectedWindows[0].language,
      region: selectedWindows[0].region,
      priority: URGENT_PRIORITY,
      source: 'Ticker',
      clipTitle: tickerData.clipTitle,
      programDescription: tickerData.programDescription,
      isPersonalLibrary: tickerData.isPersonalLibrary,
      isCompanyLibrary: tickerData.isCompanyLibrary,
      programTime: formatDate(tickerData.programDate, 'HH:mm'),
      programName: tickerData.programName,
      programType: tickerData.programType,
      programDate: formatDate(tickerData.programDate, 'DD/MM/YYYY'),
    };

    let check = true;
    let errMsg;
    Object.keys(data).map(key => {
      if (
        key == 'guests' ||
        key == 'anchor' ||
        key == 'programDescription' ||
        key == 'programName' ||
        key == 'programType'
      )
        return;
      if (isEmpty(data[key])) {
        check = false;
        errMsg = `"${key}" is required`;
        return;
      }
    });
    if (check) {
      Object.keys(data).forEach(key => {
        formData.append(`${key}`, data[key]);
      });
      tickerArray[0]?.IMGsrc?.forEach(ticker => {
        formData.append('files', DataURIToBlob(ticker));
      });
      dispatch(
        libraryJobsActions.createJob.request({
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    } else {
      antMessage.error(errMsg, 2);
    }
  };

  const handleYoutubeShare = useCallback(
    async videoPath => {
      if (!user.youtubeToken) {
        const ifConfirm = await confirm(
          'Youtube sharing concent required. You will be redirect to concent page and will lost all the unsaved progress'
        );
        if (!ifConfirm) return;
        window.location.href = `${USERS_BASE_URL}/social/google`;
        return;
      }
      let check = true;
      let errMsg;
      Object.keys(youtubeData).map(key => {
        if (key === 'playList' || key === 'tags') return;
        if (isEmpty(youtubeData[key])) {
          check = false;
          errMsg = `"${key}" is required`;
          return;
        }
      });
      const { access_token, refresh_token } = user.youtubeToken;
      if (check) {
        const formData = new FormData();
        formData.append('title', youtubeData.title);
        formData.append('tags', JSON.stringify(youtubeData.tags));
        formData.append('playList', youtubeData.playList);
        formData.append('comments', youtubeData.caption);
        formData.append('token', JSON.stringify({ access_token, refresh_token }));
        formData.append('file', videoPath);
        youtubeData.fileList.forEach(file => {
          formData.append('files', file.originFileObj);
        });
        dispatch(libraryJobsActions.youtubePost.request(formData));
      } else {
        antMessage.error(errMsg, 2);
      }
    },
    [youtubeData]
  );

  //////////// End Methods ////////////

  const channelTabContent = (
    <div style={{ height: `${height}`, overflow: 'scroll' }} ref={element}>
      <ChannelList resetJob={resetJob} resetReducers={resetReducers} />
    </div>
  );
  const lyticsTabContent = (
    <div style={{ height: `${height}`, overflow: 'scroll' }} ref={element}>
      <JobTable isLytics closeWindow={closeWindow} resetReducers={resetReducers} />
    </div>
  );

  const CompanyTabContent = (
    <div style={{ height: `${height}`, overflow: 'scroll' }} ref={element}>
      <JobTable isCompany closeWindow={closeWindow} resetReducers={resetReducers} />
    </div>
  );

  const PersonalTabContent = (
    <div style={{ height: `${height}`, overflow: 'scroll' }} ref={element}>
      <JobTable isPersonal closeWindow={closeWindow} resetReducers={resetReducers} />
    </div>
  );

  const clipTabContent = (
    <div style={{ height: `${height}`, overflow: 'scroll' }} ref={element}>
      <GeneralTabContent
        programInfo={selectedWindows.length ? { ...clipData, ...exportVideo } : job}
        // programInfo={clipData}
        handleSubmit={selectedWindows.length ? handleSubmit : handleSubmitJob}
        handleYoutubeShare={handleYoutubeShare}
        processFields={clipProcessFields}
        isClip
      >
        <Clip programInfo={selectedWindows.length ? clipData : job} />
      </GeneralTabContent>
    </div>
  );

  const screenTabContent = (
    <div style={{ height: `${height}`, overflow: 'scroll' }} ref={element}>
      <GeneralTabContent
        // programInfo={selectedWindows.length ? screenData : job}
        programInfo={screenData}
        handleSubmit={handleSubmitScreen}
        processFields={screenProcessFields}
        handleClear={resetScreenReducers}
        isScreen
      >
        <Screen />
      </GeneralTabContent>
    </div>
  );

  const tickerTabContent = (
    <div style={{ height: `${height}`, overflow: 'scroll' }} ref={element}>
      <GeneralTabContent
        // programInfo={selectedWindows.length ? tickerData : job}
        programInfo={tickerData}
        handleSubmit={handleSubmitTickcer}
        processFields={tickerProcessFields}
        handleClear={resetTickerReducers}
        isTicker
      >
        <NewsTicker />
      </GeneralTabContent>
    </div>
  );

  return (
    <div className="editor-wrapper grid">
      <div className="col col-1">
        <Tabs
          type="card"
          tabPanes={[
            {
              title: 'Channels',
              content: channelTabContent,
            },
            {
              title: 'Library',
              content: lyticsTabContent,
            },
            {
              title: 'Company',
              content: CompanyTabContent,
            },
            {
              title: 'Personal',
              content: PersonalTabContent,
            },
          ]}
        />
      </div>
      <div className="col col-2">
        <LiveVideoPlayer closeWindow={closeWindow} resetJob={resetJob} />
      </div>
      <div className="col col-3">
        <Tabs
          type="card"
          defaultActiveKey={activeTab}
          activeKey={activeTab}
          onChange={value => dispatch(editorActions.updateByField({ field: 'activeTab', value }))}
          tabPanes={[
            {
              title: 'Clip',
              content: clipTabContent,
            },
            {
              title: 'Screen',
              content: screenTabContent,
            },
            {
              title: 'Ticker',
              content: tickerTabContent,
            },
          ]}
        />
      </div>
      <Prompt
        when={false}
        message={'You will lose the unsaved changes if you switch the page. Are you sure?'}
      />
    </div>
  );
}

export default Editor;
