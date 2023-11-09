import React, { useState, useEffect, useRef } from 'react';
import './OnlinePublicationSource.scss';
import Jobs from '../Jobs/Jobs';
import { Tabs } from 'components/Common';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { jobActions } from 'modules/jobs/actions';
import { qcJobsStreamEndPoint } from 'constants/index';
import useSSE from 'hooks/useSSE';

const OnlinePublicationSource = ({ history }) => {
  const dispatch = useDispatch();
  const [jobSource, setJobSource] = useState('Tv');
  const { statuses, startDate, endDate } = useSelector(state => state.jobfilterReducer);
  const { results } = useSelector(state => state.jobsReducer);
  const statesRef = useRef(statuses);
  const resultsRef = useRef(results);
  const dateRangeRef = useRef({ startDate: null, endDate: null });
  const jobSourceRef = useRef('Tv');
  useEffect(() => {
    statesRef.current = [...statuses];
    // dispatch(jobActions.updateJobArray([]));
  }, [statuses]);
  useEffect(() => {
    resultsRef.current = [...results];
  }, [results]);

  useEffect(() => {
    dateRangeRef.current.startDate = moment(startDate)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toISOString();
    dateRangeRef.current.endDate = moment(endDate)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toISOString();
  }, [startDate, endDate]);

  useEffect(() => {
    setJobSource('Tv');
    const closeEventStream = useSSE(
      qcJobsStreamEndPoint,
      streamSuccessCallback,
      streamErrorCallback
    );
    return () => {
      closeEventStream();
      if (window.location.hash === '#/hyper-qc') {
        dispatch(jobActions.reset.request());
      }
    };
  }, []);

  const sorterFunction = (jobA, jobB) => {
    const jobADate = moment(jobA.programDate)
      .utcOffset(0)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toISOString();
    const jobBDate = moment(jobB.programDate)
      .utcOffset(0)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toISOString();
    return moment(jobADate) > moment(jobBDate) ? 1 : -1;
  };

  const streamSuccessCallback = event => {
    const data = JSON.parse(event.data);

    // return on stream connection
    if (data.eventName === 'connect') return;
    if (!(data?.data?.source === jobSourceRef.current)) return;

    // return if new job does'nt fall into filter date and status
    const newJobProgramDate = moment(data?.data?.programDate)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toISOString();
    const newStartDate = dateRangeRef.current.startDate;
    const newEndDate = dateRangeRef.current.endDate;

    if (
      moment(newJobProgramDate) < moment(newStartDate) ||
      moment(newJobProgramDate) > moment(newEndDate)
    )
      return;

    if (!statesRef.current.includes(data?.data?.jobState)) return;

    if (data.eventType === 'new-job') {
      const newJobs = [...resultsRef.current, data?.data];
      newJobs.sort(sorterFunction);
      dispatch(jobActions.updateJobArrayThroughEvent(newJobs));
    }
    if (data.eventType === 'updated-job') {
      const currentJobID = data?.data?.id;
      const newJobs = resultsRef.current.map(job => {
        if (job.id === currentJobID) return data?.data;
        return job;
      });
      dispatch(jobActions.updateJobArrayThroughEvent(newJobs));
    }
  };

  const streamErrorCallback = error => {
    console.log({ error });
  };

  function callback(key) {
    if (key == 0) {
      setJobSource('Tv');
      jobSourceRef.current = 'Tv';
    } else if (key == 1) {
      setJobSource('Online');
      jobSourceRef.current = 'Online';
    } else if (key == 2) {
      setJobSource('Print');
      jobSourceRef.current = 'Print';
    } else if (key == 3) {
      setJobSource('Blog');
      jobSourceRef.current = 'Blog';
    } else if (key == 4) {
      setJobSource('Social');
      jobSourceRef.current = 'Social';
    } else if (key == 5) {
      setJobSource('Ticker');
      jobSourceRef.current = 'Ticker';
    }
  }
  return (
    <div className="online-publication-wrapper">
      <Tabs
        destroyInactiveTabPane={true}
        onChange={callback}
        type="card"
        tabPanes={[
          { title: 'TV', content: <Jobs history={history} jobSource={jobSource} /> },
          {
            title: 'Online Videos',
            content: <Jobs history={history} jobSource={jobSource} />,
          },
          { title: 'Print', content: <Jobs history={history} jobSource={jobSource} /> },
          { title: 'Website/Blogs', content: <Jobs history={history} jobSource={jobSource} /> },
          { title: 'Social', content: <Jobs history={history} jobSource={jobSource} /> },
          { title: 'Ticker', content: <Jobs history={history} jobSource={jobSource} /> },
        ]}
      />
    </div>
  );
};

export default OnlinePublicationSource;
