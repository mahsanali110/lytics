import React, { useState, useEffect } from 'react';
import Model from '../model/Model';
import { Table, Button, LoadingPage, SearchField } from 'components/Common';
import { printColumns } from '../column/PrintColumns';
import { pick, map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { jobActions } from 'modules/jobs/actions';
import { Row, Col } from 'antd';

import './web.scss';
import EditorBlock from '../EditorBlock/EditorBlock';
import Segment from '../SegmentBlock/Segment';

function Web() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const isPrint = true;
  const { loading } = useSelector(state => state.jobsReducer);
  const [unvalidData, setunvalidData] = useState([]);
  const [importSingle, setImportSingle] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [openModal, setopenModal] = useState(false);

  useEffect(() => {
    if (data?.data?.length > 0) {
      console.log(data.data.length);
      setDisableBtn(false);
    }
  }, [data]);
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
  const processJobs = () => {
    const jobs = data.data;

    jobs.forEach((f, index) => {
      const formData = new FormData();
      for (const file of data.files) {
        if (f.thumbnailPath === file.name) {
          formData.append('files', file);
        }
        console.log('here in files sent to BE', file);
      }
      formData.append('data', JSON.stringify(f)); // appending every file to formdata
      dispatch(jobActions.createWebsiteJob.request({ data: formData }));
    });

    setData([]);
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
                isPrint={isPrint}
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
              <EditorBlock data={data} setData={setData} source={'Blog'} />
            </Col>
            <Col span={16}>
              <Segment
                data={data}
                setData={setData}
                channelType={'Website/Blog'}
                // setImportSingle={setImportSingle}
              />
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
                }}
                disabled={disableBtn}
              >
                PROCESS BATCH
              </Button>
              {/* )} */}
            </div>
            <Table
              columns={printColumns}
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

export default Web;
