import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { pick } from 'lodash';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { USERS_BASE_URL } from 'constants/config';
import { uploadPath } from 'constants/index';

import './LiveVideoPlayer.scss';

import { ChannelWindow } from '../';
import { LoadingPage, VideoPlayer } from 'components/Common';

function LiveVideoPlayer({ closeWindow, resetJob }) {
  const selectedChannelWindows = useSelector(state => state.liveClippingReducer.selectedWindows);
  const { job, loading } = useSelector(state => state.jobsReducer);

  const { loading: libraryLoading, singleJobLoading } = useSelector(
    state => state.libraryJobsReducer
  );

  const [PlayCheck, setPlayCheck] = useState(true);

  const programInfo = pick(job, [
    'channel',
    'clippedBy',
    'programName',
    'programDate',
    'programTime',
    'segmentTime',
    'thumbnailPath',
    'channelLogoPath',
    'videoPath',
  ]);

  return (
    <div className="video-player-container">
      {selectedChannelWindows.map((ch, index) => (
        <ChannelWindow
          key={ch.id}
          id={ch.id}
          name={ch.name}
          icon={ch.logoPath}
          windowIndex={index}
          closeWindow={closeWindow}
        />
      ))}
      {!selectedChannelWindows.length && job?.videoPath && (
        <div className="job-player-container">
          {singleJobLoading ? (
            <LoadingPage />
          ) : (
            <>
              <VideoPlayer
                src={job.videoPath}
                programInfo={programInfo}
                isClient={true}
                setPlayCheck={setPlayCheck}
                // poster={`${USERS_BASE_URL}/${uploadPath}/${job.thumbnailPath}`}
              />
              {/* <CloseCircleTwoTone className="window-close-icon" onClick={resetJob} /> */}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LiveVideoPlayer;
