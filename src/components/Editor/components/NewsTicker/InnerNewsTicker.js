import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'components/Common';
const { Text } = Typography;
import { Typography, Form, Input, Spin } from 'antd';
import { SegmentContainer, Button, Select } from 'components/Common';
const { TextArea } = Input;
import { MinusCircleFilled } from '@ant-design/icons';
import './InnerNewsTicker.scss';
import { useSelector, useDispatch } from 'react-redux';
import { commonActions as COMMONACTIONS } from 'modules/common/actions';
import commonActions from 'modules/common/actions';
import { SelectAll, converBase64formUrl, getImage } from 'modules/common/utils';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { message as antMessage } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { USERS_BASE_URL } from 'constants/config';
import editorActions from 'modules/editor/actions';
import clockSvg from 'assets/icons/clock-black.svg';
import altImage from 'assets/images/images.jpg';
import lyticsLogo from 'assets/images/Lytics_logo_B 1.png';
// var count = 0;
function InnerNewsTicker({ index, data, removeInner }) {
  var videotag;
  var video1;
  var Tickerbutton;
  var context;
  const { id, channelIcon, channelName, windowIndex, IMGsrc } = data;

  const [tickerLength, settickerLength] = useState([]);
  const [tickerSize, settickerSize] = useState(null);
  const [yAxisOffset, setyAxisOffset] = useState(null);
  const [domRendered, setDomRendered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tickerRatioOfVideo, setTickerRatioOfVideo] = useState('');
  const [xAxisCrop, setxAxisCrop] = useState('');

  useEffect(() => {
    fetch('./ticker.json')
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        // store Data in State Data Variable
        settickerLength(data);
      })
      .catch(function (err) {});
  }, []);

  const dispatch = useDispatch();

  const [selectedTheme, setselectedTheme] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [AllsubTheme, setAllsubTheme] = useState([]);
  const [selectedsubTheme, setselectedsubTheme] = useState();
  const [ticketCount, setticketCount] = useState(0);
  const selectedChannelWindows = useSelector(state => state.liveClippingReducer.selectedWindows);

  const { topics, topicsError } = useSelector(state => state.commonReducer);
  const { channels } = useSelector(state => state.channelsReducer);
  const { downloadTicker, tickerData } = useSelector(state => state.editorReducer);

  const canvasRef = useRef(null);
  const canvasComponentRef = useRef(null);
  const exportcanvasRef = useRef(null);
  const StateRef = useRef(ticketCount);
  const TickerSizeStateRef = useRef(tickerSize);
  const yAxisOffsetStateRef = useRef(yAxisOffset);
  const xAxisCropStateRef = useRef(xAxisCrop);
  const tickerRatioOfVideoRef = useRef(tickerRatioOfVideo);

  const setMyState = data => {
    StateRef.current = data;
    setticketCount(data);
  };
  const canvas = canvasRef.current;

  useEffect(() => {
    if (!downloadTicker) return;
    exportJPG();
    dispatch(editorActions.updateByField({ field: 'downloadTicker', value: false }));
  }, [downloadTicker]);

  useEffect(() => {
    channels.forEach(t => {
      if (t.name == channelName) {
        settickerSize(t.tickerSize);
        setyAxisOffset(t.yaxisOffset);
        TickerSizeStateRef.current = t.tickerSize;
        yAxisOffsetStateRef.current = t.yaxisOffset;
        xAxisCropStateRef.current = t.xaxisCrop;
      }
    });
  }, [channels, channelName]);
  useEffect(() => {
    dispatch(commonActions.fetchTopics.request());
  }, []);
  useEffect(() => {
    let temp = [];
    topics.forEach(({ topic2 }) => {
      temp = [...temp, ...topic2];
    });
    let topic2Array = temp.map(({ name }) => name);
    let unique = [...new Set(topic2Array)];
    setAllsubTheme(unique);
  }, [topics]);

  useEffect(() => {
    if (channelName === null || selectedChannelWindows.length <= 0) return;
    videotag = document
      ?.querySelector(`[channelindex="${channelName}${windowIndex}"]`)
      ?.getElementsByTagName('video');
    console.log({ videotag });
    if (videotag !== undefined && videotag.length > 0) {
      video1 = videotag[0];

      if (yAxisOffsetStateRef.current + TickerSizeStateRef.current > video1.videoHeight) {
        TickerSizeStateRef.current = video1.videoHeight - yAxisOffsetStateRef.current;
      }
      if (video1.videoWidth !== 0) {
        tickerRatioOfVideoRef.current = video1.videoWidth / TickerSizeStateRef.current;
      }
    } else {
      return;
    }
  }, [channelName, selectedChannelWindows]);

  const removeTicker = index => {
    let temp = IMGsrc;
    temp.splice(index, 1);
    dispatch(COMMONACTIONS.addTickerSource({ id, data: temp, sizeCtrl: -1 }));
  };

  function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0) {
      context.fillText(text, x, y);
      return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
      var str = words.slice(0, idx).join(' ');
      var w = context.measureText(str).width;
      if (w > fitWidth) {
        if (idx == 1) {
          idx = 2;
        }
        context.fillText(words.slice(0, idx - 1).join(' '), x, y + lineHeight * currentLine);
        currentLine++;
        words = words.splice(idx - 1);
        idx = 1;
      } else {
        idx++;
      }
    }
    if (idx > 0) context.fillText(words.join(' '), x, y + lineHeight * currentLine);
  }

  function countLine(context, text, fitWidth) {
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0) {
      return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
      var str = words.slice(0, idx).join(' ');
      var w = context.measureText(str).width;
      if (w > fitWidth) {
        if (idx == 1) {
          idx = 2;
        }
        currentLine++;
        words = words.splice(idx - 1);
        idx = 1;
      } else {
        idx++;
      }
    }
    return ++currentLine;
  }

  const exportJPG = async () => {
    setLoading(true);

    const CANVAS_WIDTH = 720;
    const SUB_THEME_MAX_WIDTH = CANVAS_WIDTH - 182; // 182px is the space for Logo+ChannelName+Date
    const SUB_THEME_LABEL = 'Sub-Theme:';
    const LINE_HEIGHT = 15;
    const COLOR_BLUE = '#48BEEB';
    const COLOR_GREY = '#EAEDF2';
    const DEFAULT_FONT_SIZE = '15px Roboto';
    const DEFAULT_MARGIN = 10;
    const TICKER_IMAGE_WIDTH = CANVAS_WIDTH - DEFAULT_MARGIN * 2;
    const TICKER_HEIGHT = TickerSizeStateRef.current;
    const Y_AXIS_OFFSET = yAxisOffsetStateRef.current;

    let el = document.getElementById(`${channelName}logoTicker`);
    const canvasExport = exportcanvasRef.current;
    const contextExport = canvasExport.getContext('2d');
    canvasExport.width = CANVAS_WIDTH;
    canvasExport.height = 9999;
    contextExport.font = DEFAULT_FONT_SIZE;
    let sttemp = [];

    // let subThemeWithWidthArr = [];
    // selectedsubTheme?.forEach((S, index) => {
    //   let selectedThemeWidth = contextExport.measureText(`${SUB_THEME_LABEL} ${S}`).width;
    //   subThemeWithWidthArr.push({ subtheme: S, width: selectedThemeWidth });
    // });
    // subThemeWithWidthArr.sort(function (a, b) {
    //   let x = a.width;
    //   let y = b.width;
    //   if (x > y) {
    //     return -1;
    //   }
    //   if (x < y) {
    //     return 1;
    //   }
    //   return 0;
    // });
    // let tempsubThemeWithWidthArr = [];
    // let tempsubThemeWithWidthArr2 = [];

    // subThemeWithWidthArr?.forEach((S, index) => {
    //   if (S.width > SUB_THEME_MAX_WIDTH) {
    //     tempsubThemeWithWidthArr.push(S);
    //   } else {
    //     tempsubThemeWithWidthArr2.push(S);
    //   }
    // });
    // subThemeWithWidthArr = [...tempsubThemeWithWidthArr2, ...tempsubThemeWithWidthArr.reverse()];
    // subThemeWithWidthArr?.forEach((S, index) => {
    //   if (index == 0) return;
    //   if (index === selectedsubTheme?.length - 1) return sttemp.push(S.subtheme);
    //   return sttemp.push(S.subtheme + ',');
    // });
    // let ststr = sttemp?.join(' ');
    let subthemeHeightOffset = 0;
    // let currentLines = 0;
    // if (selectedsubTheme?.length > 1) {
    //   let subthemetemp = subThemeWithWidthArr[0];
    //   let checkselectedSubThemeWidth = subthemetemp.width;
    //   let currentLines = countLine(contextExport, ststr, checkselectedSubThemeWidth);
    //   subthemeHeightOffset = currentLines * LINE_HEIGHT;
    // }

    contextExport.fillStyle = 'black';
    contextExport.font = '15px Roboto';
    contextExport.beginPath();
    contextExport.moveTo(10, 10);
    contextExport.lineTo(CANVAS_WIDTH - DEFAULT_MARGIN, 10);
    contextExport.stroke();
    contextExport.beginPath();
    contextExport.strokeStyle = 'white';
    contextExport.fillStyle = COLOR_GREY;
    contextExport.fillRect(
      DEFAULT_MARGIN, // x-axis offset
      DEFAULT_MARGIN, // y-asix offset
      CANVAS_WIDTH - DEFAULT_MARGIN * 2, // width of rectangle
      65 + subthemeHeightOffset
    );
    contextExport.fillStyle = 'black';
    const channelImagedataUrl = await converBase64formUrl(channelIcon);
    const channelImg = await getImage(channelImagedataUrl);

    contextExport.drawImage(channelImg, 20, 15, 50, 50);
    contextExport.fillText(channelName, 80, 50);
    contextExport.font = '30px Roboto';
    contextExport.fillText('Tickers', 300, 55);
    contextExport.strokeStyle = 'black';
    contextExport.beginPath();
    contextExport.moveTo(10, 75 + subthemeHeightOffset);
    contextExport.lineTo(CANVAS_WIDTH - DEFAULT_MARGIN, 75 + subthemeHeightOffset);
    contextExport.stroke();
    contextExport.font = '15px Roboto';

    // let themeLabelWidth = contextExport.measureText('Theme: ').width;
    // let selectedThemeWidth = contextExport.measureText(selectedTheme).width;
    const clockSvgImg = await getImage(clockSvg);
    contextExport.drawImage(clockSvgImg, CANVAS_WIDTH - 183, 21, 17, 17);
    // contextExport.fillText('Date:', CANVAS_WIDTH - 200, 50);
    contextExport.fillText(
      moment(tickerData.timeStamp).format('DD/MM/YYYY hh:mm A'),
      CANVAS_WIDTH - 160,
      35
    );
    const lyticsLogoImg = await getImage(lyticsLogo);
    contextExport.drawImage(lyticsLogoImg, CANVAS_WIDTH - 82, 37);

    contextExport.fillStyle = COLOR_BLUE;
    // contextExport.fillText(selectedTheme, CANVAS_WIDTH - selectedThemeWidth - 20, 30);
    contextExport.fillStyle = 'black';
    let temp = [];
    // let subthemetemp = '';
    // let subthemeLabelWidth = contextExport.measureText(SUB_THEME_LABEL).width;
    // let selectedSubThemeWidth = 0;

    // if (selectedsubTheme?.length > 0) {
    //   subthemetemp = subThemeWithWidthArr[0];
    //   let checkselectedSubThemeWidth = subthemetemp.width;
    //   let font = 15;
    //   while (checkselectedSubThemeWidth > SUB_THEME_MAX_WIDTH && font > 1) {
    //     font = font - 0.1;
    //     contextExport.font = `${font}px Roboto`;
    //     checkselectedSubThemeWidth = contextExport.measureText(
    //       `${SUB_THEME_LABEL}${subthemetemp.subtheme}`
    //     ).width;
    //   }
    //   selectedSubThemeWidth = contextExport.measureText(subthemetemp.subtheme + ' ').width;
    //   contextExport.fillStyle = COLOR_BLUE;
    //   if (selectedsubTheme.length > 1) {
    //     subthemetemp.subtheme = subthemetemp.subtheme + ',';
    //   }
    //   subthemeLabelWidth = contextExport.measureText(SUB_THEME_LABEL + ' ').width;
    //   contextExport.fillText(subthemetemp.subtheme, CANVAS_WIDTH - selectedSubThemeWidth - 20, 60);

    //   contextExport.fillStyle = 'black';
    //   contextExport.fillText(
    //     SUB_THEME_LABEL + ' ',
    //     CANVAS_WIDTH - (subthemeLabelWidth + selectedSubThemeWidth) - 20,
    //     60
    //   );
    // }

    // subThemeWithWidthArr?.forEach((S, index) => {
    //   if (index == 0) return;
    //   if (index === selectedsubTheme?.length - 1) return temp.push(S.subtheme);
    //   return temp.push(S.subtheme + ',');
    // });
    // let str = temp?.join(' ');
    // contextExport.fillStyle = COLOR_BLUE;
    // contextExport.font = '15px Roboto';
    // if (str?.length) {
    //   printAtWordWrap(
    //     contextExport,
    //     str,
    //     CANVAS_WIDTH - (subthemeLabelWidth + selectedSubThemeWidth) - 20,
    //     75, // x-axis
    //     LINE_HEIGHT, // line-height
    //     subthemeLabelWidth + selectedSubThemeWidth
    //   );
    // }
    // currentLines = countLine(contextExport, analysis, 420);
    // let analysisHeightOffset = 0;
    // if (analysis.length !== 0) {
    //   analysisHeightOffset = (currentLines + 1) * LINE_HEIGHT;
    // }
    // if (analysis.length > 0) {
    //   contextExport.fillStyle = COLOR_GREY;
    //   contextExport.fillRect(
    //     10,
    //     110 + subthemeHeightOffset,
    //     CANVAS_WIDTH - DEFAULT_MARGIN * 2,
    //     analysisHeightOffset
    //   );
    //   contextExport.fillStyle = 'black';
    //   contextExport.fillText('Analysis:', 10, 100 + subthemeHeightOffset);
    //   if (analysis.length > 0) {
    //     printAtWordWrap(
    //       contextExport,
    //       analysis,
    //       20,
    //       130 + subthemeHeightOffset,
    //       15,
    //       CANVAS_WIDTH - DEFAULT_MARGIN * 4
    //     );
    //   }
    // }
    contextExport.fillStyle = COLOR_BLUE;

    contextExport.fillStyle = '#48BEEB';

    contextExport.fillText('Tickers', 10, 100);

    let offset = 0;
    IMGsrc.forEach(dataURL => {
      var canvasPic = new Image();
      canvasPic.src = dataURL;

      const newTickerHeight =
        canvasPic.width /
        ((canvasPic.width - xAxisCropStateRef.current) / TickerSizeStateRef.current);
      contextExport.drawImage(
        canvasPic,
        0, //sourceX
        0, // sourceY
        canvasPic.width, // sourceWidth
        TICKER_HEIGHT, //sourceHeight
        DEFAULT_MARGIN, // destX
        110 + offset, // destY
        TICKER_IMAGE_WIDTH, // destWidth
        newTickerHeight // destHeight
      );
      offset += newTickerHeight + DEFAULT_MARGIN / 2;
    });
    let height = 110 + offset + DEFAULT_MARGIN;
    let destinationCanvas = document.createElement('canvas');
    destinationCanvas.width = canvasExport.width;
    destinationCanvas.height = height;
    let destCtx = destinationCanvas.getContext('2d');
    destCtx.fillStyle = '#FFFFFF';

    destCtx.fillRect(0, 0, canvasExport.width, canvasExport.height);
    destCtx.drawImage(canvasExport, 0, 0);

    const a = document.createElement('a');
    document.body.appendChild(a);
    var myImage = destinationCanvas.toDataURL('image/png', 1);
    a.href = myImage;
    // exportJPGtoDrive(myImage);
    exportJPGinBrowser(a);
    function exportJPGinBrowser(a) {
      a.download = `${channelName}_Ticker_${moment(tickerData.timeStamp).format(
        'DD/MM/YYYY_HH:mm:ss'
      )}.png`;
      a.click();
      document.body.removeChild(a);
      // setIMGsrc([]);
      setMyState(0);
      // removeInner(index);
      antMessage.success('Ticker exported successfully', 1);
      setLoading(false);
    }

    // This method will export/download the JPG of Breaking News to the Public folder of Node server
    function exportJPGtoDrive(myImage) {
      const channelData = {
        channelName,
        date: moment().format('DD_MM_YYYY_HH_mm_ss'),
        placeholder: '_Ticker_',
      };
      a.href = myImage;
      a.download = `${channelName}_Ticker_${moment().format('DD/MM/YYYY_HH/mm/ss')}.png`;
      a.click();
      document.body.removeChild(a);
      setMyState(0);
      removeInner(index);
      antMessage.success('Ticker export Initiated', 1);
      axios
        .post(`${USERS_BASE_URL}/exportJob/image-to-drive`, {
          dataUri: myImage,
          channelData,
        })
        .then(function (response) {
          antMessage.success('Ticker exported successfully', 1);
          setLoading(false);
        })
        .catch(function (error) {
          antMessage.error('Something went wrong!Try again.', 1);

          setLoading(false);
        });
    }
  };

  return (
    <div className="inner-ticker-wrapper mb-15">
      <div className="news-ticker-wrapper">
        <div className="channel-logo">
          <img
            id={`${channelName}logoTicker`}
            height="30px"
            width="30px"
            src={channelIcon}
            alt=""
            crossOrigin="Anonymous"
          />
        </div>
        {IMGsrc.map((s, index) => (
          <div
            key={index}
            style={{
              // position: 'absolute',
              // top: `${index * 70}px`,
              marginLeft: '15px',
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              // objectPosition: '15% 100%',
              width: '350px',
              height: `${350 / tickerRatioOfVideoRef.current}px`,
            }}
          >
            <img
              id={`${channelName}imgCanTicker`}
              src={s}
              alt="Ticker"
              width="320"
              // height="330"
              style={{
                objectFit: 'cover',
                objectPosition: '0px 0px',
                // clip: 'rect(0px,600px,60px,0px)',
              }}
            ></img>
            <CloseCircleTwoTone
              key={index}
              className="close-ticker-icon"
              style={{
                marginLeft: '7px',
                marginTop: `${320 / tickerRatioOfVideoRef.current / 2 - 10}px`,
                fontSize: '1.3rem',
                height: '20px',
              }}
              onClick={() => {
                removeTicker(index);
              }}
            />
          </div>
        ))}
      </div>
      <>
        <canvas
          style={{ display: 'none', width: '400px', height: '1000px' }}
          id="exportCanvas"
          ref={exportcanvasRef}
        ></canvas>
      </>
    </div>
  );
}

export default React.memo(InnerNewsTicker);
