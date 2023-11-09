import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'components/Common';
const { Text } = Typography;
import { Typography, Form, Input, Spin } from 'antd';
import { Button, Select } from 'components/Common';
import { SelectAll } from 'modules/common/utils';
const { TextArea } = Input;
import './BreakingNews.scss';
import { MinusCircleFilled, CloseCircleTwoTone } from '@ant-design/icons';
import commonActions from 'modules/common/actions';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { message as antMessage } from 'antd';
import axios from 'axios';
import { USERS_BASE_URL } from 'constants/config';
import { commonActions as COMMONACTIONS } from 'modules/common/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

function InnerBN({ index, id, channelName, channelIcon, windowIndex, removeInnerShot, IMGsrc }) {
  var videotag;

  var video1;

  const dispatch = useDispatch();
  const [topicsCount, setTopicsCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedTheme, setselectedTheme] = useState('');
  const [AllsubTheme, setAllsubTheme] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [videoRatio, setvideoRatio] = useState('');

  const [shotCount, setShotCount] = useState(0);
  const [selectedsubTheme, setselectedsubTheme] = useState();
  const { topics, topicsError } = useSelector(state => state.commonReducer);
  const selectedChannelWindows = useSelector(
    state => state.multiviewReducer.selectedWindowsAWARENESS
  );

  const canvasRef = useRef(null);
  const exportcanvasRef = useRef(null);
  const StateRef = useRef(shotCount);
  const elRef = useRef(null);
  const setMyState = data => {
    StateRef.current = data;
    setShotCount(data);
  };

  useEffect(() => {
    dispatch(commonActions.fetchTopics.request());
  }, []);

  useEffect(() => {
    if (topicsError || topicsError === networkError) {
      setTopicsCount(prevCount => prevCount + 1);
      if (topicsCount <= errorCount) {
        setTimeout(() => {
          dispatch(commonActions.fetchTopics.request());
        }, errorDelay);
      } else if (topicsError === networkError) {
        alert(`${topicsError}, Please refresh!`);
        window.location.reload();
      } else if (topicsError !== networkError) {
        alert(`${topicsError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [topicsError]);

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
    videotag = document?.querySelector(`[channel="${channelName}"]`)?.getElementsByTagName('video');
    if (videotag !== undefined && videotag.length > 0) {
      video1 = videotag[0];
      setvideoRatio(video1.videoWidth / video1.videoHeight);
    }
  }, [channelName, selectedChannelWindows]);

  const removeTicker = index => {
    let temp = IMGsrc;
    setMyState(StateRef.current - 1);
    temp.splice(index, 1);
    dispatch(COMMONACTIONS.addShotSource({ id, data: temp, sizeCtrl: -1 }));
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

  const exportJPG = () => {
    setLoading(true);

    const SUB_THEME_LABEL = 'Sub-Theme:';
    const ADDED_WIDTH = 240;
    const CANVAS_WIDTH = 720; //Deafault width is 420px in case any of increment in this variable you will have to add the same increment to ADD_WDITH  720-480=240
    const LINE_HEIGHT = 15;
    const COLOR_BLUE = 'blueviolet';
    const COLOR_GREY = '#EAEDF2';

    let el = document.getElementById(`${channelName}logoShot`);
    const canvasExport = exportcanvasRef.current;
    const contextExport = canvasExport.getContext('2d');
    canvasExport.width = CANVAS_WIDTH;
    canvasExport.height = 9999;
    const SUB_THEME_MAX_WIDTH = 298 + ADDED_WIDTH;
    contextExport.font = '15px Roboto';
    let sttemp = [];

    let subThemeWithWidthArr = [];
    selectedsubTheme?.forEach((S, index) => {
      let selectedThemeWidth = contextExport.measureText(`${SUB_THEME_LABEL} ${S}`).width;
      subThemeWithWidthArr.push({ subtheme: S, width: selectedThemeWidth });
    });
    subThemeWithWidthArr.sort(function (a, b) {
      let x = a.width;
      let y = b.width;
      if (x > y) {
        return -1;
      }
      if (x < y) {
        return 1;
      }
      return 0;
    });
    let tempsubThemeWithWidthArr = [];
    let tempsubThemeWithWidthArr2 = [];

    subThemeWithWidthArr?.forEach((S, index) => {
      if (S.width > SUB_THEME_MAX_WIDTH) {
        tempsubThemeWithWidthArr.push(S);
      } else {
        tempsubThemeWithWidthArr2.push(S);
      }
    });
    subThemeWithWidthArr = [...tempsubThemeWithWidthArr2, ...tempsubThemeWithWidthArr.reverse()];
    subThemeWithWidthArr?.forEach((S, index) => {
      if (index == 0) return;
      if (index === selectedsubTheme?.length - 1) return sttemp.push(S.subtheme);
      return sttemp.push(S.subtheme + ',');
    });

    let ststr = sttemp?.join(' ');
    let subthemeHeightOffset = 0;
    let currentLines = 0;
    if (selectedsubTheme?.length > 1) {
      let subthemetemp = subThemeWithWidthArr[0];
      let checkselectedSubThemeWidth = subthemetemp.width;

      let currentLines = countLine(contextExport, ststr, checkselectedSubThemeWidth);
      subthemeHeightOffset = currentLines * LINE_HEIGHT;
    }

    contextExport.fillStyle = 'black';
    contextExport.font = '15px Roboto';
    contextExport.beginPath();
    contextExport.moveTo(10, 10);
    contextExport.lineTo(470 + ADDED_WIDTH, 10);
    contextExport.stroke();
    contextExport.beginPath();
    contextExport.strokeStyle = 'white';
    contextExport.fillStyle = COLOR_GREY;
    contextExport.fillRect(10, 10, 460 + ADDED_WIDTH, 65 + subthemeHeightOffset);
    contextExport.fillStyle = 'black';
    contextExport.drawImage(el, 20, 15, 50, 50);
    contextExport.fillText(channelName, 80, 30);
    contextExport.fillText(moment().format('DD/MM/YYYY'), 80, 60);
    contextExport.strokeStyle = 'black';
    contextExport.beginPath();
    contextExport.moveTo(10, 75 + subthemeHeightOffset);
    contextExport.lineTo(470 + ADDED_WIDTH, 75 + subthemeHeightOffset);
    contextExport.stroke();

    let themeLabelWidth = contextExport.measureText('Theme: ').width;
    let selectedThemeWidth = contextExport.measureText(selectedTheme).width;
    contextExport.fillText(
      'Theme:',
      CANVAS_WIDTH - (themeLabelWidth + selectedThemeWidth) - 20,
      30
    );
    contextExport.fillStyle = COLOR_BLUE;
    contextExport.fillText(selectedTheme, CANVAS_WIDTH - selectedThemeWidth - 20, 30);
    contextExport.fillStyle = 'black';
    let temp = [];
    let subthemetemp = '';
    let subthemeLabelWidth = contextExport.measureText(SUB_THEME_LABEL).width;
    let selectedSubThemeWidth = 0;

    if (selectedsubTheme?.length > 0) {
      subthemetemp = subThemeWithWidthArr[0];
      let checkselectedSubThemeWidth = subthemetemp.width;
      let font = 15;
      while (checkselectedSubThemeWidth > SUB_THEME_MAX_WIDTH && font > 1) {
        font = font - 0.1;
        contextExport.font = `${font}px Roboto`;
        checkselectedSubThemeWidth = contextExport.measureText(
          `${SUB_THEME_LABEL}${subthemetemp.subtheme}`
        ).width;
      }
      selectedSubThemeWidth = contextExport.measureText(subthemetemp.subtheme + ' ').width;
      contextExport.fillStyle = COLOR_BLUE;
      if (selectedsubTheme.length > 1) {
        subthemetemp.subtheme = subthemetemp.subtheme + ',';
      }
      subthemeLabelWidth = contextExport.measureText(SUB_THEME_LABEL + ' ').width;
      contextExport.fillText(subthemetemp.subtheme, CANVAS_WIDTH - selectedSubThemeWidth - 20, 60);

      contextExport.fillStyle = 'black';
      contextExport.fillText(
        SUB_THEME_LABEL + ' ',
        CANVAS_WIDTH - (subthemeLabelWidth + selectedSubThemeWidth) - 20,
        60
      );
    }

    subThemeWithWidthArr?.forEach((S, index) => {
      if (index == 0) return;
      if (index === selectedsubTheme?.length - 1) return temp.push(S.subtheme);
      return temp.push(S.subtheme + ',');
    });
    let str = temp?.join(' ');

    contextExport.fillStyle = COLOR_BLUE;
    contextExport.font = '15px Roboto';
    if (str?.length) {
      printAtWordWrap(
        contextExport,
        str,
        CANVAS_WIDTH - (subthemeLabelWidth + selectedSubThemeWidth) - 20,
        75, // x-axis
        LINE_HEIGHT, // line-height
        subthemeLabelWidth + selectedSubThemeWidth
      );
    }
    currentLines = countLine(contextExport, analysis, 420 + ADDED_WIDTH);
    let analysisHeightOffset = 0;
    if (analysis.length !== 0) {
      analysisHeightOffset = (currentLines + 1) * LINE_HEIGHT;
    }
    if (analysis.length > 0) {
      contextExport.fillStyle = COLOR_GREY;
      contextExport.fillRect(
        10,
        110 + subthemeHeightOffset,
        460 + ADDED_WIDTH,
        analysisHeightOffset
      );
      contextExport.fillStyle = 'black';
      contextExport.fillText('Analysis:', 10, 100 + subthemeHeightOffset);
      if (analysis.length > 0) {
        printAtWordWrap(
          contextExport,
          analysis,
          20,
          130 + subthemeHeightOffset,
          15,
          420 + ADDED_WIDTH
        );
      }
    }
    contextExport.fillStyle = COLOR_BLUE;

    contextExport.fillText('Breaking News', 10, 130 + subthemeHeightOffset + analysisHeightOffset);

    const imageWidthDefault1 = 495 + ADDED_WIDTH + 15;
    const imageWidthDefault2 = 243 + 5 + ADDED_WIDTH / 2;
    let imageheight;
    if (IMGsrc.length === 6) {
      let imageheightSingle2 = imageWidthDefault2 / videoRatio;
      imageheight = imageheightSingle2 + imageheightSingle2 + imageheightSingle2 + 20;

      IMGsrc.forEach((dataURL, index) => {
        var canvasPic = new Image();
        canvasPic.src = dataURL;

        let xAxisOffset = 10;
        let yAxisOffset = 140 + subthemeHeightOffset + analysisHeightOffset;
        if (index == 0) {
        } else if (index == 1) {
          xAxisOffset = imageWidthDefault2;
        } else if (index == 2) {
          yAxisOffset += imageheightSingle2 + 10;
        } else if (index == 3) {
          xAxisOffset = imageWidthDefault2;
          yAxisOffset += imageheightSingle2 + 10;
        } else if (index == 4) {
          yAxisOffset += imageheightSingle2 + imageheightSingle2 + 20;
        } else if (index == 5) {
          xAxisOffset = imageWidthDefault2;
          yAxisOffset += imageheightSingle2 + imageheightSingle2 + 20;
        }
        contextExport.drawImage(
          canvasPic,
          xAxisOffset,
          yAxisOffset,
          imageWidthDefault2,
          imageheightSingle2
        );
      });
    } else if (IMGsrc.length === 5) {
      let imageheightSingle1 = imageWidthDefault1 / videoRatio;
      let imageheightSingle2 = imageWidthDefault2 / videoRatio;
      imageheight = imageheightSingle1 + imageheightSingle2 + imageheightSingle2 + 20;

      IMGsrc.forEach((dataURL, index) => {
        var canvasPic = new Image();
        canvasPic.src = dataURL;

        let imageWidth = 0;
        let xAxisOffset = 10;
        let yAxisOffset = 140 + subthemeHeightOffset + analysisHeightOffset;

        if (index == 0) {
          imageWidth = imageWidthDefault1;
        } else if (index == 1) {
          yAxisOffset += imageheightSingle1 + 10;
          imageWidth = imageWidthDefault2;
        } else if (index == 2) {
          xAxisOffset = imageWidthDefault2;
          yAxisOffset += imageheightSingle1 + 10;
          imageWidth = imageWidthDefault2 + 1;
        } else if (index == 3) {
          yAxisOffset += imageheightSingle1 + imageheightSingle2 + 20;
          imageWidth = imageWidthDefault2;
        } else if (index == 4) {
          xAxisOffset = imageWidthDefault2;
          yAxisOffset += imageheightSingle1 + imageheightSingle2 + 20;
          imageWidth = imageWidthDefault2 + 1;
        }
        contextExport.drawImage(
          canvasPic,
          xAxisOffset,
          yAxisOffset,
          imageWidth,
          imageWidth / videoRatio
        );
      });
    } else if (IMGsrc.length === 4) {
      let imageheightSingle2 = imageWidthDefault2 / videoRatio;
      imageheight = imageheightSingle2 + imageheightSingle2 + 10;

      IMGsrc.forEach((dataURL, index) => {
        var canvasPic = new Image();
        canvasPic.src = dataURL;

        let xAxisOffset = 10;
        let yAxisOffset = 140 + subthemeHeightOffset + analysisHeightOffset;
        if (index == 0) {
        } else if (index == 1) {
          xAxisOffset = imageWidthDefault2;
        } else if (index == 2) {
          yAxisOffset += imageheightSingle2 + 10;
        } else if (index == 3) {
          xAxisOffset = imageWidthDefault2;
          yAxisOffset += imageheightSingle2 + 10;
        }
        contextExport.drawImage(
          canvasPic,
          xAxisOffset,
          yAxisOffset,
          imageWidthDefault2,
          imageheightSingle2
        );
      });
    } else if (IMGsrc.length === 3) {
      const imageheightSingle1 = imageWidthDefault1 / videoRatio;
      const imageheightSingle2 = imageWidthDefault2 / videoRatio;
      imageheight = imageheightSingle1 + imageheightSingle2 + 10;

      IMGsrc.forEach((dataURL, index) => {
        var canvasPic = new Image();
        canvasPic.src = dataURL;

        let imageWidth = 0;
        let xAxisOffset = 10;
        let yAxisOffset = 140 + subthemeHeightOffset + analysisHeightOffset;
        if (index == 0) {
          imageWidth = imageWidthDefault1;
        } else if (index == 1) {
          yAxisOffset += imageheightSingle1 + 10;
          imageWidth = imageWidthDefault2;
        } else if (index == 2) {
          xAxisOffset = imageWidthDefault2;
          yAxisOffset += imageheightSingle1 + 10;
          imageWidth = imageWidthDefault2 + 1;
        }
        contextExport.drawImage(
          canvasPic,
          xAxisOffset,
          yAxisOffset,
          imageWidth,
          imageWidth / videoRatio
        );
      });
    } else if (IMGsrc.length === 2) {
      const imageheightSingle = imageWidthDefault1 / videoRatio;
      imageheight = imageheightSingle + imageheightSingle + 10;
      IMGsrc.forEach((dataURL, index) => {
        var canvasPic = new Image();
        canvasPic.src = dataURL;

        let yAxisOffset = 0;
        if (index == 0) {
          yAxisOffset = 140 + subthemeHeightOffset + analysisHeightOffset;
        } else if (index == 1) {
          yAxisOffset = 140 + imageheightSingle + 10 + subthemeHeightOffset + analysisHeightOffset;
        }
        contextExport.drawImage(canvasPic, 10, yAxisOffset, imageWidthDefault1, imageheightSingle);
      });
    } else if (IMGsrc.length === 1) {
      IMGsrc.forEach((dataURL, index) => {
        if (index == 0) {
          var canvasPic = new Image();
          canvasPic.src = dataURL;
          imageheight = imageWidthDefault1 / videoRatio;
          contextExport.drawImage(
            canvasPic,
            10,
            140 + subthemeHeightOffset + analysisHeightOffset,
            imageWidthDefault1,
            imageheight
          );
        }
      });
    }
    let height = 140 + subthemeHeightOffset + analysisHeightOffset + imageheight + 10;
    let destinationCanvas = document.createElement('canvas');
    destinationCanvas.width = canvasExport.width;
    destinationCanvas.height = height;
    let destCtx = destinationCanvas.getContext('2d');
    destCtx.fillStyle = '#FFFFFF';
    // destCtx.fillStyle = 'red';

    destCtx.fillRect(0, 0, canvasExport.width, canvasExport.height);
    destCtx.drawImage(canvasExport, 0, 0);

    const a = document.createElement('a');
    document.body.appendChild(a);
    var myImage = destinationCanvas.toDataURL('image/png', 1);
    a.href = myImage;

    //exportJPGinBrowser(a);
    exportJPGtoDrive(myImage);

    // This method will download the JPG of Breaking News in user's brower
    function exportJPGinBrowser(a) {
      a.download = 'img.png';
      a.click();
      document.body.removeChild(a);
      removeInnerShot(index);
      antMessage.success('Breaking News exported successfully', 1);
    }

    // This method will export/download the JPG of Breaking News to the Public folder of Node server
    function exportJPGtoDrive(myImage) {
      const channelData = {
        channelName,
        date: moment().format('DD_MM_YYYY_HH_mm_ss'),
        placeholder: '_Breaking_',
      };
      a.href = myImage;
      a.download = `${channelName}_Breaking_${moment().format('DD/MM/YYYY_HH/mm/ss')}.png`;
      a.click();
      document.body.removeChild(a);
      removeInnerShot(index);
      antMessage.success('Breaking News export Initiated', 1);

      axios
        .post(`${USERS_BASE_URL}/exportJob/image-to-drive`, {
          dataUri: myImage,
          channelData,
        })
        .then(function (response) {
          antMessage.success('Breaking News exported successfully', 1);
          setLoading(false);
        })
        .catch(function (error) {
          antMessage.error('Something went wrong!Try again.', 1);

          setLoading(false);
        });
    }
  };

  return (
    <>
      <Card
        bg="dark"
        variant="secondary"
        content={
          <section className="BN-wrapper">
            <section className="card-detail-body mt-10" style={{ position: 'relative' }}>
              <div className="grey-box">
                <div className="heading-wrapper">
                  <div className="heading-left">
                    <div className=" sub-heading">
                      <Text>{channelName}</Text>
                    </div>
                    <div className="ticker-date">
                      <Text>{moment().format('DD/MM/YYYY')}</Text>
                    </div>
                  </div>
                  <div className="heading-right">
                    <div className="channel-logo">
                      <img
                        id={`${channelName}logoShot`}
                        height="30px"
                        width="30px"
                        src={channelIcon}
                        alt=""
                        crossOrigin="Anonymous"
                      />
                    </div>
                  </div>
                </div>

                <div className="ticker-select">
                  <Form layout="vertical">
                    <div className="ticker-select-container">
                      <div style={{ width: '45%' }}>
                        <Form.Item label="Theme">
                          <Spin spinning={topicsError} delay={500}>
                            <Select
                              value={selectedTheme}
                              size="small"
                              // allowClear
                              onChange={value => {
                                setselectedTheme(value);
                              }}
                              options={topics.map(({ name }) => ({ title: name, value: name }))}
                            />
                          </Spin>
                        </Form.Item>
                      </div>
                      <div style={{ width: '45%' }}>
                        <Form.Item label="Sub-Theme">
                          <Spin spinning={topicsError} delay={500}>
                            <Select
                              value={selectedsubTheme}
                              size="small"
                              SelectAll={SelectAll}
                              // allowClear
                              maxTagCount={1}
                              maxTagTextLength={2}
                              onChange={value => {
                                value.includes('All')
                                  ? value.map(value => {
                                      setselectedsubTheme([value, ...AllsubTheme.map(st => st)]);
                                    })
                                  : setselectedsubTheme(value);
                              }}
                              onDeselect={value => {
                                if (value === 'All') setselectedsubTheme([]);
                              }}
                              options={AllsubTheme.map(st => ({ title: st, value: st }))}
                              mode="multiple"
                            />
                          </Spin>
                        </Form.Item>
                      </div>
                    </div>
                    <div
                      style={{
                        width: '94%',
                        marginLeft: '12px',
                        backgroundColor: '#2A324A',
                        borderRadius: '5px',
                      }}
                    >
                      <Form.Item label="">
                        <TextArea
                          style={{ backgroundColor: '#3E404B', fontSize: '11px', opacity: '0.6' }}
                          Value={analysis}
                          onChange={e => setAnalysis(e.target.value)}
                          className="bg-dark-grey"
                          rows={1}
                          placeholder="Analysis"
                          maxLength={256}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                </div>
                <div className="ticker-canvas">
                  <canvas
                    style={{ display: 'none' }}
                    id={`${channelName}CanvasShot`}
                    ref={canvasRef}
                  ></canvas>
                  {IMGsrc.map((s, index) => (
                    <div
                      key={uuidv4()}
                      style={{
                        flexBasis: '30%',
                        flexGrow: '1',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          marginTop: '10px',
                        }}
                      >
                        <img
                          id={`${channelName}imgCanShot`}
                          src={s}
                          alt="ScreenShot"
                          width="96.64"
                          height="56.4"
                        ></img>
                        <MinusCircleFilled
                          style={{
                            // position: 'absolute',
                            // left: '-5px',
                            // top: '-5px',
                            fontSize: '1rem',
                          }}
                          key={index}
                          onClick={() => {
                            removeTicker(index);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ticker-footer">
                  <Button
                    loading={loading}
                    onClick={() => {
                      exportJPG();
                    }}
                  >
                    EXPORT COLLECTION
                  </Button>
                </div>
              </div>
              <CloseCircleTwoTone
                className="window-close-icon"
                style={{
                  position: 'absolute',
                  top: '-7px',
                  // left: '100%',
                  right: '-5px',
                  fontSize: '1.3rem',
                  height: '20px',
                  zIndex: '9999',
                  color: 'rgba(242, 106, 50, 1)',
                }}
                onClick={() => {
                  removeInnerShot(index);
                }}
              />
            </section>
          </section>
        }
      />
      <>
        <canvas
          style={{ display: 'none', width: '400px', height: '1000px' }}
          id={`${channelName}canvas`}
          ref={exportcanvasRef}
        ></canvas>
      </>
    </>
  );
}

export default React.memo(InnerBN);
