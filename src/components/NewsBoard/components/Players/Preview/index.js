import { LoadingPage, VideoPlayer, Dropdown } from 'components/Common';
import { Col, Radio } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';
import CustomTabs from 'components/Common/CustomTabs';
import LiveVideoPlayer from '../../LiveVideoPlayer/LiveVideoPlayer';

function NewsBoardPreviewPlayers({
  programInfo,
  handlePreviewPlaying,
  isPreviewPlaying,
  isLoading,
  channels,
  channel,
  handleChannelChange,
}) {
  const TV = 'Tv';
  const PREVIEW = 'Preview';
  // const staticChannels = ['BOL News'];
  // const filterChannels = ({ type: source, name }) => source === TV && staticChannels.includes(name);

  const [activeTab, setActiveTab] = useState(PREVIEW);
  const [currentChannel, setCurrentChannel] = useState(channel);
  const isTv = activeTab === TV;
  const handleTabChange = e => {
    setActiveTab(e.target.value);
  };

  const onChannelChange = channel => {
    // setCurrentChannel(channel);
    handleChannelChange(channel, 0);
  };

  const { headerContent, items } = useMemo(() => {
    const previewContent = (
      // <div style={{ height: '100%', background: '#2A324A', borderRadius: '6px' }}>
      //   <span
      //     className="text-white ff-roboto"
      //     style={{ display: 'inline-block', padding: '2px', fontSize: '10px' }}
      //   >
      //     Preview
      //   </span>
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
      // </div>
    );

    const headerContent = (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 5px',
            marginBottom: '8px',
          }}
        >
          {isTv ? (
            <Dropdown channels={channels} title={channel?.name} onSelect={onChannelChange} />
          ) : (
            <span className="preview-channel-name">
              {programInfo?.channel?.toUpperCase() || ''}
            </span>
          )}
          <Radio.Group
            disabled={isTv}
            onChange={handleTabChange}
            value={activeTab}
            className="channels-radio-group"
            buttonStyle="solid"
          >
            {/* <Radio.Button value="Preview">Preview</Radio.Button> */}
            <Radio.Button className="round" value={TV}>
              TV
            </Radio.Button>
          </Radio.Group>
        </div>
        {/* <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Radio.Group
            disabled={isTv}
            onChange={handleTabChange}
            value={activeTab}
            style={{ marginBottom: 8 }}
          >
            <Radio.Button value={TV}>Tv</Radio.Button>
          </Radio.Group>
        </div> */}
      </div>
    );

    const items = [
      { key: PREVIEW, label: PREVIEW, children: previewContent },
      {
        key: TV,
        label: TV,
        children: <div>{channel && <LiveVideoPlayer channel={channel} />}</div>,
      },
    ];

    return {
      headerContent,
      items,
    };
  }, [channel, activeTab, programInfo, channels]);

  useEffect(() => {
    isPreviewPlaying && setActiveTab(PREVIEW);
  }, [isPreviewPlaying]);

  // useEffect(() => {
  //   !channel && setCurrentChannel(channels?.filter(filterChannels)[0]);
  // }, [channels]);

  return (
    <>
      <Col span={6} className="padding-left">
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
          // <div style={{ padding: '0px 5px', height: '100%' }}>
          <CustomTabs
            tabHeader={headerContent}
            activeTab={activeTab}
            defautTab={PREVIEW}
            tabItems={items}
          />
          // </div>
        )}
      </Col>
    </>
  );
}

export default memo(NewsBoardPreviewPlayers);
