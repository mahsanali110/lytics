import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Image, message as antMessage } from 'antd';
import { v1 as uuid } from 'uuid';

import './ChannelList.scss';

import { LoadingPage } from 'components/Common';
import { liveClippingActions } from 'modules/LiveClipping/actions';
import useConfirm from 'hooks/useConfirm';
const { addWindow } = liveClippingActions;

function ChannelList({ resetJob, resetReducers }) {
  const { confirm } = useConfirm();
  const dispatch = useDispatch();
  const { loading, channels } = useSelector(state => state.channelsReducer);
  const activeWindows = useSelector(state => state.liveClippingReducer.selectedWindows);
  const { job } = useSelector(state => state.jobsReducer);

  const onChannelClick = async channel => {
    if (activeWindows.length && channel.name === activeWindows[0].name) {
      antMessage.info('Selected channel is already live', 2);
      return;
    }
    if (job.videoPath) {
      const ifConfirm = await resetJob();
      if (!ifConfirm) return;
      resetReducers();
    }
    if (activeWindows.length) {
      let ifConfirm = await confirm(
        'You will lose the unsaved changes if you switch the channel. Are you sure?'
      );
      if (ifConfirm) {
        dispatch(addWindow({ ...channel, id: uuid() }));
        resetReducers();
        dispatch({ type: 'CHANNEL_NAME', payload: channel.actusId });
      }
    } else {
      dispatch(addWindow({ ...channel, id: uuid() }));
      dispatch({ type: 'CHANNEL_NAME', payload: channel.actusId });
    }
  };
  // return <LoadingPage />;
  return loading ? (
    <LoadingPage />
  ) : (
    <div className="channel-container">
      {channels
        .filter(cha => cha.type === 'Tv')
        .map(ch => (
          <div
            onClick={() => onChannelClick(ch)}
            className={
              ch.name === activeWindows[0]?.name ? 'active channel-wrapper' : `channel-wrapper`
            }
          >
            <Image
              className="channel-image"
              src={ch?.secondaryLogoPath ? ch?.secondaryLogoPath : ch.logoPath}
              fallback={'placeholder.png'}
              preview={false}
            />
            {/* <p className="channel-name">{ch.name}</p> */}
          </div>
        ))}
    </div>
  );
}

export default ChannelList;
