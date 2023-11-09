import React, { useState } from 'react';
import OnlineVideos from './components/onlineVideos/OnlineVideos';
import Print from './components/print/Print';
import Web from './components/web/Web';
import Multiview from '../MultiView/MultiView';
import './contentSegmentation.scss';
import {
  Tabs,
  Button,
  PageNavigation,
  VideoPlayer,
  Statement,
  LoadingPage,
} from 'components/Common';
function ContentSegmentation() {
  const [onlineData, setOnlineData] = useState([]);
  const [printData, setprintData] = useState([]);
  const [blogdata, setBlogData] = useState([]);

  return ( 
    <div className="content-segmentation-wrapper">
      {/* <Tabs
        type="card"
        tabPanes={[
          { title: 'TV', content: <Multiview></Multiview> },
          {
            title: 'Online Videos',
            content: <OnlineVideos data={onlineData} setData={setOnlineData}></OnlineVideos>,
          },
          { title: 'Print', content: <Print data={printData} setData={setprintData}></Print> },
          { title: 'Website/Blogs', content: <Web data={blogdata} setData={setBlogData}></Web> },
        ]}
      /> */}
    </div>
  );
}

export default ContentSegmentation;
