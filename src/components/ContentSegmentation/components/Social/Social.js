import React, { useEffect, useState } from 'react';
import Model from '../model/Model';
import { Table, Button, SearchField, LoadingPage } from 'components/Common';
import { twitterColumns } from '../column/TwitterColumns';
import { pick, map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { jobActions } from 'modules/jobs/actions';
import { Row, Col } from 'antd';

import './Social.scss';
import EditorBlock from '../EditorBlock/EditorBlock';
import Segment from '../SegmentBlock/Segment';

function Social() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const isTwitter = true;
  const { loading } = useSelector(state => state.jobsReducer);
  const [unvalidData, setunvalidData] = useState([]);
  const [importSingle, setImportSingle] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [openModal, setopenModal] = useState(false);

  const getFormatedJobs = () =>
    map(data.data, job =>
      pick(job, [
        'programName',
        'channel',
        'thumbnailPath',
        'programType',
        'priority',
        'jobState',
        'programDate',
        'programTime',
        'jobState',
        'channelLogoPath',
        'thumbnailPathURL',
        'language',
        'textPath',
        'publisher',
      ])
    );
  useEffect(() => {
    if (data?.data?.length > 0) {
      setDisableBtn(false);
    }
  }, [data]);
  const processJobs = () => {
    const jobs = data.data;
    jobs.forEach((f, index) => {
      const formData = new FormData();
      for (const file of data.files) {
        if (f.thumbnailPath === file.name) {
          formData.append('files', file);
        }
      }
      formData.append('data', JSON.stringify(f)); // appending every file to formdata
      dispatch(jobActions.createSocialJob.request({ data: formData }));
    });

    setData({ data: [] });
  };

  return loading ? (
    <LoadingPage />
  ) : (
    <div className="print-wrapper">
      {data?.data?.length <= 0 && !importSingle ? (
        <>
          {unvalidData.length <= 0 ? (
            <div className="print-model-wrapper">
              <Model
                data={data}
                isTwitter={isTwitter}
                setData={setData}
                unvalidData={unvalidData}
                setunvalidData={setunvalidData}
                openModal={openModal}
                setopenModal={setopenModal}
              ></Model>
            </div>
          ) : (
            <>
              <div className="online-video-button">
                <div className="online-heading">
                  <h1 className="online-heading">Invalid Data Enteries</h1>
                </div>
                <div className="process-button">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setunvalidData([]);
                    }}
                  >
                    IMPORT BATCH
                  </Button>
                </div>
              </div>

              <div className="online-video-valid-wrapper">
                {unvalidData.map((data, index) => (
                  <div className="inner-div">
                    <h1 className="title">Row {data.key + 2}</h1>
                    <ul className="online-video-list">
                      {data.line.map(l => (
                        <li className="list">{l}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : data?.data?.length >= 0 && importSingle ? (
        <div className="print-segment-wrapper">
          <Row gutter={24}>
            <Col span={8}>
              <EditorBlock data={data} setData={setData} source={'Print'} />
            </Col>
            <Col span={16}>
              <Segment data={data} setData={setData} channelType={'Print'} />
            </Col>
          </Row>
        </div>
      ) : !importSingle ? (
        <div className="print-table-wrapper">
          <div className="print-table">
            <div className="main-div">
              <SearchField
                className="search-jobs"
                placeholder="Search Jobs"
                handleOnChange={evt => {
                  handleSearchValue(evt.target.value);
                }}
              />
            </div>
            <div className="process-button-bottom" style={{ zIndex: 1, right: '3rem' }}>
              {/* <Button
                style={{ marginRight: '10px' }}
                variant="secondary"
                onClick={() => {
                  setData({ data: [] });
                  setImportSingle(true);
                }}
              >
                SINGLE IMPORT
              </Button> */}
              <Button
                style={{ marginRight: '10px' }}
                variant="secondary"
                onClick={() => {
                  setData({ data: [] });
                }}
              >
                IMPORT BATCH
              </Button>
              {/* {data?.length <= 0 ? (
                ' '
              ) : ( */}
              <Button
                variant="secondary"
                onClick={() => {
                  processJobs();
                  // antMessage.error('Need error message');
                }}
                disabled={disableBtn}
              >
                PROCESS BATCH
              </Button>
              {/* )} */}
            </div>
            <Table
              columns={twitterColumns}
              data={getFormatedJobs()}
              pagination={true}
              onRow={(record, index) => {}}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default Social;
