import React, { memo, useEffect, useMemo, useState } from 'react';
import { Grid, Radio, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LoadingPage from 'components/Common/LoadingPage';
import VideoPlayer from 'components/Common/VideoPlayer';
// import Dropdown from 'components/Common/Dropdown';
import CustomTabs from 'components/Common/CustomTabs';

const useStyles = makeStyles((theme) => ({
  // container: {
  //   padding: theme.spacing(0, 5, 0, 0),
  // },
  // header: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   padding: theme.spacing(0, 1),
  //   marginBottom: theme.spacing(1),
  // },
  // previewChannelName: {
  //   fontSize: '1rem',
  // },
  // channelsRadioGroup: {
  //   buttonStyle: 'solid',
  // },
  // roundButton: {
  //   borderRadius: '20px',
  // },
}));

function NewsBoardPreviewPlayers({
  programInfo,
  handlePreviewPlaying,
  isPreviewPlaying,
  isLoading,
  channels,
  channel,
  handleChannelChange,
}) {
  const classes = useStyles();
  const TV = 'Tv';
  const PREVIEW = 'Preview';

  const [activeTab, setActiveTab] = useState(PREVIEW);
  const isTv = activeTab === TV;

  const handleTabChange = (e) => {
    setActiveTab(e.target.value);
  };

  const onChannelChange = (channel) => {
    handleChannelChange(channel, 0);
  };

  const { headerContent, items } = useMemo(() => {
    const previewContent = (
      <VideoPlayer
        isLibrary={true}
        isClient={true}
        setPlayCheck={() => {}}
        src={programInfo.videoPath}
        programInfo={programInfo}
        shortPlayerControls
        handlePreviewPlaying={handlePreviewPlaying}
        isPreviewPlaying={isPreviewPlaying}
      />
    );

    const headerContent = (
      <div className={classes.header}>
        {isTv ? (
          <Dropdown channels={channels} title={channel?.name} onSelect={onChannelChange} />
        ) : (
          <Typography className={classes.previewChannelName}>
            {programInfo?.channel?.toUpperCase() || ''}
          </Typography>
        )}
        <Radio.Group
          disabled={isTv}
          onChange={handleTabChange}
          value={activeTab}
          className={classes.channelsRadioGroup}
        >
          <Radio.Button className={classes.roundButton} value={TV}>
            TV
          </Radio.Button>
        </Radio.Group>
      </div>
    );

    return {
      headerContent,
      items: [{ key: PREVIEW, label: PREVIEW, children: previewContent }],
    };
  }, [channel, activeTab, programInfo, channels, classes]);

  useEffect(() => {
    isPreviewPlaying && setActiveTab(PREVIEW);
  }, [isPreviewPlaying]);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} className={classes.container}>
      {isLoading || !channels?.length ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LoadingPage className={'custom-loading'} />
        </div>
      ) : (
        <CustomTabs tabHeader={headerContent} activeTab={activeTab} defautTab={PREVIEW} tabItems={items} />
      )}
    </Grid>
  );
}

export default memo(NewsBoardPreviewPlayers);
