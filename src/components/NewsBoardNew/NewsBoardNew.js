import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import axios from 'axios';
import { pick } from 'lodash';

import './NewsBoardNew.scss';

// import { ContentWrapper, JobCard } from './components';

// Replace Ant Design components with Material-UI components
import useSSE from 'hooks/useSSE';
import NewsBoardPlayers from './components/Players/players';
// import ReactPlayer from 'react-player';
import ReactPlayer from 'react-player/youtube';

import { useDispatch, useSelector } from 'react-redux';
import { ACTUS_CHANNELS_API_PATH, ACTUS_PATH, newsBoardStreamEndPoint } from 'constants/index';
import channelsActions from 'modules/channels/actions';
import { channelActions as CA } from '../../modules/multiview/actions';
import { jobActions } from 'modules/jobs/actions';
import newsboardActions from 'modules/newsboard/actions';
import { filterJobSources } from 'constants/index';

import moment from 'moment'; // Assuming this is used for date formatting
import { Box, Grid } from '@mui/material';
import BarGraph from './components/Bargraph/Bargraph';
import LivePieChart from './components/LivePieChart/LivePieChart';
import HeaderContent from './components/HeaderContent/HeaderContent';
import InfoTray from './components/InfoTray/InfoTray';
import ListingHeaderContent from './components/ListingHeaderContent/ListingHeaderContent';
import Card from './components/Card/Card';

const NewsBoardNew = () => {
  const dispatch = useDispatch();

  // * Constants
  const TV = 'Tv';

  // * Selectors
  const { channels } = useSelector(state => state.channelsReducer);
  const { job, loading } = useSelector(state => state.jobsReducer);
  const { tvOnline, printWeb, social, ticker } = useSelector(state => state.newsboardReducer);
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
  // * Hooks
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [tableFilters, setTableFilters] = useState({
    // start_date: moment().subtract(1, 'days').format(format), // ! set the date to previous 3 days, kindly don't change it
    // end_date: moment().format(format),
    limit: 30,
    guest: '',
    page: pageNumber ?? 1,
    escalation: '',
    association: '',
    appliedPreset: '',
    searchText: searchText,
    jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
  });

  //  useEffect(() => {
  //    fetchDefault();
  //    const closeEventStream = useSSE(
  //      newsBoardStreamEndPoint,
  //      streamSuccessCallback,
  //      streamErrorCallback
  //    );
  //    checkActus();
  //    dispatch(jobActions.reset.request());
  //    dispatch(CA.getActusURL.request());

  //    return () => {
  //      dispatch(jobActions.resetJob());
  //      closeEventStream();
  //      dispatch(newsboardActions.resetNewsboardReducer());
  //    };
  //  }, []);

  // * Functions
  // function streamSuccessCallback(event) {
  //   const data = JSON.parse(event.data);
  //   if (data?.eventType === 'new-job') {
  //     dispatch(newsboardActions.updateJobArray(data.data));
  //   }
  // }

  // function streamErrorCallback(error) {
  //   console.log({ error });
  // }
  // const fetchDefault = () => {
  //   dispatch(
  //     newsboardActions.fetchTvOnlineJobs.request({
  //       ...tableFilters,
  //       source: filterJobSources.filter(src => src === 'Tv' || src === 'Online'),
  //       channel: [
  //         ...channels
  //           .filter(_ => {
  //             if (_.type === 'Tv' || _.type === 'Online') return _;
  //           })
  //           .map(_ => _.name),
  //       ],
  //     })
  //   );
  //   dispatch(
  //     newsboardActions.fetchPrintWeb.request({
  //       ...tableFilters,
  //       source: filterJobSources.filter(src => src === 'Blog' || src === 'Print'),
  //       channel: [
  //         ...channels
  //           .filter(_ => {
  //             if (_.type === 'Blog' || _.type === 'Print') return _;
  //           })
  //           .map(_ => _.name),
  //       ],
  //     })
  //   );
  //   dispatch(
  //     newsboardActions.fetchSocialJobs.request({
  //       ...tableFilters,
  //       source: filterJobSources.filter(src => src === 'Social'),
  //       channel: [
  //         ...channels
  //           .filter(_ => {
  //             if (_.type === 'Social') return _;
  //           })
  //           .map(_ => _.name),
  //       ],
  //     })
  //   );
  //   dispatch(
  //     newsboardActions.fetchTickerJobs.request({
  //       ...tableFilters,
  //       source: filterJobSources.filter(src => src === 'Ticker'),
  //       channel: [
  //         ...channels
  //           .filter(_ => {
  //             if (_.type === 'Ticker') return _;
  //           })
  //           .map(_ => _.name),
  //       ],
  //     })
  //   );
  //   dispatch(channelsActions.getChannels.request());
  // };

  // const getJobById = useCallback(
  //   id => {
  //     dispatch(jobActions.getJobById.request(id));
  //   },
  //   [dispatch]
  // );

  // const checkActus = () => {
  //   axios
  //     .get('http://172.168.1.131/actus5/api/channels', {
  //       headers: {
  //         ActAuth: `ActAuth eyJpZCI6MiwibmFtZSI6ImFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJzZXNzaW9uX2d1aWQiOiJjN2UyMDIwNC1kMmNhLTQ2MjYtYjQyYi03ODc2YmRiNjkzNDYiLCJpbl9kaXJlY3Rvcnlfc2VydmljZSI6ZmFsc2UsImFkX2dyb3VwX25hbWUiOm51bGwsInNjb3BlIjoiY2xpcHBpbmciLCJJZGVudGl0eSI6bnVsbH0mWCZYJlgtNDY1Nzk0Njkw`,
  //       },
  //     })
  //     .then(res => {
  //       dispatch(CA.updateActus({ field: 'private', value: 'http://172.168.1.131/actus5' }));
  //       return;
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  //   axios
  //     .get(ACTUS_CHANNELS_API_PATH, {
  //       headers: {
  //         ActAuth: `ActAuth eyJpZCI6MiwibmFtZSI6ImFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJzZXNzaW9uX2d1aWQiOiJjN2UyMDIwNC1kMmNhLTQ2MjYtYjQyYi03ODc2YmRiNjkzNDYiLCJpbl9kaXJlY3Rvcnlfc2VydmljZSI6ZmFsc2UsImFkX2dyb3VwX25hbWUiOm51bGwsInNjb3BlIjoiY2xpcHBpbmciLCJJZGVudGl0eSI6bnVsbH0mWCZYJlgtNDY1Nzk0Njkw`,
  //       },
  //     })
  //     .then(res => {
  //       dispatch(CA.updateActus({ field: 'public', value: ACTUS_PATH }));

  //       return;
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // };

  // const tvChannels = useMemo(() => {
  //   const filterChannels = ({ type: source, name }) => source === TV;

  //   return channels?.filter(filterChannels) || [];
  // }, [channels]);

  // const handlePreviewPlaying = value => {
  //   setIsPreviewPlaying(value);
  // };

  const newsBoarsUpperSection = [
    {
      headerContent: <HeaderContent isTv={false} graph={false} />,
      children: (
        <ReactPlayer
          controls={true}
          playing={true}
          muted={true}
          playIcon={<button>Play</button>}
          width={'100%'}
          height="90%"
          url="https://www.youtube.com/watch?v=O3DPVlynUM0"
        />
      ),
    },
    {
      headerContent: <HeaderContent isTv={true} graph={true} />,

      children: (
        <Box className="test">
          <BarGraph />
        </Box>
      ),
    },
    {
      headerContent: <HeaderContent isTv={true} graph={true} />,

      children: (
        <Box className="test">
          <LivePieChart />
        </Box>
      ),
    },
    {
      headerContent: <HeaderContent isTv={true} graph={true} />,
      children: (
        <ReactPlayer
          controls={true}
          playing={true}
          muted={true}
          playIcon={<button>Play</button>}
          width={'100%'}
          height="90%"
          url="https://www.youtube.com/watch?v=O3DPVlynUM0"
        />
      ),
    },
  ];
  const newsBoardlowerSection = [
    {
      // headerContent:<HeaderContent  isTv={false} graph={false}/>,
      headerContent: <ListingHeaderContent isTv={true} graph={false} />,
      children: (
       <Card/>
      ),
    },
    {
      headerContent: <ListingHeaderContent isTv={true} graph={false} />,
      children: (
        <Card/>
      ),
    },
    {
      headerContent: <ListingHeaderContent isTv={true} graph={false} />,
      children: (
        <Card/>
      ),
    },
    {
      headerContent: <ListingHeaderContent isTv={true} graph={false} />,
      children: (
        <Card/>
      ),
    },
  ];

  return (
    <div className="newsboard-wrapper">
      <div className="channels-wrapper">
        <Grid container spacing={2}>
          {newsBoarsUpperSection.map(item => (
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3} >
              {item.headerContent}
              {item.children}
            </Grid>
          ))}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={2}>
            <InfoTray />
          </Grid>
          {newsBoardlowerSection.map(item => (
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              {item.headerContent}
              {item.children}
            </Grid>
          ))}
        </Grid>

        {/* <NewsBoardPlayers
          channels={tvChannels}
          isLoading={loading || tvOnline.loading}
          programInfo={programInfo}
          isPreviewPlaying={isPreviewPlaying}
          handlePreviewPlaying={handlePreviewPlaying}
        /> */}
      </div>

      {/* Cards Wrapper */}
      <Grid container spacing={3} className="cards-wrapper" style={{ height: '100%' }}>
        <Grid item xs={6}>
          {/* <ContentWrapper heading={'TV & Online'}>
            <JobCard
              loading={tvOnline.loading}
              getJobById={getJobById}
              results={tvOnline.results}
              handlePreviewPlaying={handlePreviewPlaying}
              tvOnline
            />
          </ContentWrapper> */}
        </Grid>
        <Grid item xs={6}>
          {/* <ContentWrapper heading={'Web & Print'}>
            <JobCard loading={printWeb.loading} results={printWeb.results} />
          </ContentWrapper> */}
        </Grid>
        <Grid item xs={6}>
          {/* <ContentWrapper heading={'Twitter'}>
            <JobCard loading={social.loading} results={social.results} />
          </ContentWrapper> */}
        </Grid>
        <Grid item xs={6}>
          {/* <ContentWrapper heading={'Tickers'}>
            <JobCard loading={ticker.loading} results={ticker.results} />
          </ContentWrapper> */}
        </Grid>
      </Grid>
      <div className="cards-wrapper"></div>
    </div>
  );
};

export default memo(NewsBoardNew);
