import React, { useEffect, useState } from 'react';
import { Button, LoadingPage, SearchField } from 'components/Common';
import { getColumns } from '../column/OnlineColumns';
import { pick, map, result } from 'lodash';
import './onlinevideos.scss';
import Model from '../model/Model';
import IMSTable from 'components/Common/Table/Table';
import { useDispatch, useSelector } from 'react-redux';
import { jobActions } from 'modules/jobs/actions';
function OnlineVideos() {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  // const importVideos = useSelector(state => state.importVideos);
  const { loading } = useSelector(state => state.jobsReducer);
  const [unvalidData, setunvalidData] = useState([]);
  const isOnline = true;
  const [fileList, setFileList] = useState([]);
  const [disableBtn, setDisableBtn] = useState(true);
  const [openModal, setopenModal] = useState(false);

  function handleSearchValue(evt) {
    if (evt === '') {
      setTableData(csvData);
    } else {
      setSearchValue(evt.toUpperCase());
      const filteredData = data?.data?.filter(entry =>
        entry?.channel?.toUpperCase().includes(searchValue)
      );
      setTableData(filteredData);
    }
  }
  useEffect(() => {
    if (data?.data?.length > 0) {
      setDisableBtn(false);
    }
  }, [data]);
  const getFormatedJobs = () =>
    map(data.data, job =>
      pick(job, [
        // 'id',
        'programName',
        'channel',
        'thumbnailPath',
        'programType',
        'priority',
        'anchor',
        'programDate',
        'programTime',
        'channelLogoPath',
        'language',
        'videoPath',
        'publisher',
        'thumbnailPathURL',
        // 'activeDownload',
      ])
    );
  const csvData = getFormatedJobs();
  const [tableData, setTableData] = useState();
  useEffect(() => {
    setTableData(() => [...csvData]);
    dispatch(jobActions.importVideos(data.files));
  }, [data]);

  const processJobs = () => {
    const jobs = data.data;
    jobs.forEach((f, index) => {
      const formData = new FormData();
      for (const file of data.files) {
        if (f.videoPath === file.name || f.thumbnailPath === file.name) {
          formData.append('files', file);
        }
      }
      formData.append('data', JSON.stringify(f));
      dispatch(jobActions.createMediaJobs.request({ data: formData }));
    });
    setData({ data: [] });
  };
  const columns = getColumns(data);
  return loading ? (
    <LoadingPage />
  ) : (
    <div className="online-video-wrapper">
      {data?.data?.length <= 0 ? (
        <>
          {unvalidData.length <= 0 ? (
            <div className="online-video-model-wrapper">
              <Model
                data={data}
                isOnline={isOnline}
                setData={setData}
                unvalidData={unvalidData}
                setunvalidData={setunvalidData}
                fileList={fileList}
                setfileList={setFileList}
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
      ) : (
        <div className="online-video-table-wrapper">
          <div className="online-table">
            <div className="main-div">
              <SearchField
                className="search-jobs"
                placeholder="Search Jobs"
                handleOnChange={evt => {
                  handleSearchValue(evt.target.value);
                }}
              />
            </div>
            <div className="process-button-bottom">
              <Button
                style={{ marginRight: '10px' }}
                variant="secondary"
                onClick={() => {
                  setData({ data: [] });
                }}
              >
                IMPORT BATCH
              </Button>
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
            </div>
            <IMSTable
              columns={columns}
              data={tableData}
              pagination={true}
              onRow={(record, index) => {}}
              style={{ marginTop: '2rem' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default OnlineVideos;
