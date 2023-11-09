import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Empty } from 'antd';
import { useSelector } from 'react-redux';

import './JobCard.scss';

import getPannels from './Panels';
import { Collapse, LoadingPage } from 'components/Common';

function JobCard({
  results,
  getJobById,
  loading,
  playCheck,
  setPlayCheck,
  tvOnline,
  handlePreviewPlaying,
}) {
  // Hooks
  const [panels, setPanles] = useState([]);
  // Selectors
  const videoCurrentTime = useSelector(state => state.commonReducer.videoCurrentTime);
  const { job: currentJob } = useSelector(state => state.jobsReducer);

  useEffect(() => {
    setPanles(
      getPannels(
        results,
        getJobById,
        playCheck,
        setPlayCheck,
        tvOnline,
        currentJob,
        videoCurrentTime,
        handlePreviewPlaying
      )
    );
  }, [results.length, currentJob, videoCurrentTime]);

  // const panels = getPannels(results, getJobById, playCheck, setPlayCheck, tvOnline, currentJob, videoCurrentTime);

  return loading ? (
    <div className="center-content" style={{ height: '100%' }}>
      <LoadingPage className={'custom-loading'} />
    </div>
  ) : panels.length ? (
    <div className="job-card-wrapper">
      <Collapse panels={panels} showArrow={false} annimation={'slide'} />
    </div>
  ) : (
    <Empty
      className="center-content"
      style={{ height: '100%', margin: '0', flexDirection: 'column' }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );
}

JobCard.propTypes = {
  results: PropTypes.array,
  getJobById: PropTypes.func,
};

JobCard.defaultProps = {
  results: [],
  getJobById: () => {},
  setPlayCheck: () => {},
};

export default React.memo(JobCard);
