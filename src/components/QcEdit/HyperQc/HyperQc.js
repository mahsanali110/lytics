import './HyperQc.scss';
import moment from 'moment';
import { Button } from 'components/Common';
import { TOOLTIP_COLORS } from 'constants/options';
import { Empty, Image, Input, message, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { jobActions } from 'modules/jobs/actions';
import { useDispatch, useSelector } from 'react-redux';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import { uploadPath } from 'constants/index';
import { CalendarIcon, ClockIcon } from 'assets/icons';
import { formatDate, formateTime } from 'modules/common/utils';
import { pick } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCallback } from 'react';

const HyperQc = () => {
  const dispatch = useDispatch();
  const { tickers, loading, totalPages } = useSelector(state => state.jobsReducer);
  const [currPage, setCurrPage] = useState(1); // storing current page number
  const [prevPage, setPrevPage] = useState(0); // storing current page number
  const [userList, setUserList] = useState([]); // storing list
  const [HasMore, setHasMore] = useState(false); // storing prev page number
  const [Disable, setDisable] = useState([]); // disabling rows on save
  const [Selected, setSelected] = useState({ id: null, count: 0 }); // disabling rows on save
  const [DisableDelete, setDisableDelete] = useState([]); // disabling rows on delete
  const [IdTag, setIdTag] = useState({ id: '', obj: '' });
  const listInnerRef = useRef();
  const [timeVal, setTimeVal] = useState({
    id: '',
    value: '',
  });
  const limitRef = useRef(15);
  let timerRef = useRef();
  const observer = useRef();
  const format = 'YYYY-MM-DDTHH:mm:ss';

  const idTag = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          if (currPage < totalPages) {
            setCurrPage(currPage => currPage + 1);
          } else {
            message.info('No more jobs to load');
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );
  // to check if doubleClickEvent is hit
  useEffect(() => {
    if (timeVal.value == 1) {
      timerRef.current = setTimeout(() => {
        message.info('Double click to delete');
      }, 300);
    }
    if (timeVal.value == 2) {
      clearTimeout(timerRef.current);
      setTimeVal({ ...timeVal, value: 0 });
      setDisableDelete(() => [...DisableDelete, timeVal?.id]);
      setDisable(() => [...Disable, timeVal?.id]);
      dispatch(jobActions.deleteJob.request(timeVal?.id));
    }
  }, [timeVal]);

  useEffect(() => {
    fetchData();
  }, [currPage]);

  //setting data on scroll with unique data check
  useEffect(() => {
    if (tickers?.length && currPage > 1) {
      setPrevPage(currPage);
      const unique = [
        ...new Map([...userList, ...tickers].map(item => [item['id'], item])).values(),
      ];
      setUserList(unique);
    } else {
      setUserList(tickers);
    }
  }, [tickers]);

  function handleSave(id, obj) {
    const data = pick(obj, [
      'programName',
      'programType',
      'priority',
      'source',
      'thumbnailPath',
      'transcription',
      'language',
      'locked',
      'channel',
    ]);
    data.flag = true;
    dispatch(jobActions.updateJob.request({ data, id }));
    setDisable(() => [...Disable, id]);
  }
  function handleChange(e, data, index) {
    const { value } = e.target;
    let newState = [...userList];
    newState[index].transcription[0].line = value;
    setUserList(newState);
  }
  const fetchData = () => {
    // for component filter
    // Date.now() - 864e5 to fetch previous day date
    localStorage.setItem('start_date', moment(Date.now()).format(format));
    localStorage.setItem('end_date', moment(Date.now()).format(format));
    dispatch(
      jobActions.fetchJobs.request({
        source: 'Ticker',
        start_date: localStorage.getItem('start_date')
          ? moment(localStorage.getItem('start_date')).format(format)
          : moment(Date.now()).format(format),
        end_date: localStorage.getItem('end_date')
          ? moment(localStorage.getItem('end_date')).format(format)
          : moment(Date.now()).format(format),
        page: currPage,
        jobState: ['Ready for QC', 'Ready for Marking'],
        limit: Number(limitRef.current),
        sortBy: 'createdAt:desc',
        loading: true,
      })
    );
  };

  function handleDelete(e, id) {
    setTimeVal({ ...timeVal, value: e.detail, id: id });
  }

  function handleSelection(e, id) {
    if (Selected.count == 0 && Selected.id === null) {
      setSelected({ ...Selected, id: id, count: Selected.count + 1 });
    } else if (Selected.id === id && Selected.count == 1) {
      setSelected({ ...Selected, id: id, count: 0 });
    } else if (Selected.id !== id) {
      setSelected({ ...Selected, id: id, count: 1 });
    } else if (Selected.id === id && Selected.count == 0) {
      setSelected({ ...Selected, id: id, count: Selected.count + 1 });
    }
  }

  // shortcut keys for Save and Delete
  useHotkeys(
    'alt+s',
    e => {
      e.preventDefault();
      if (!!IdTag.id && Selected.id == IdTag.id && Selected.count == 1) {
        handleSave(IdTag?.id, IdTag?.obj);
        setSelected({ ...Selected, id: null, count: 0 });
      } else {
        message.info('PLEASE SELECT A TICKER TO SAVE');
      }
    },
    [handleSave]
  );
  useHotkeys(
    'alt+d',
    e => {
      e.preventDefault();
      if (!!IdTag.id && Selected.id == IdTag.id && Selected.count == 1) {
        handleDelete(IdTag.id);
        setDisableDelete(() => [...DisableDelete, IdTag.id]);
        setDisable(() => [...Disable, IdTag.id]);
        dispatch(jobActions.deleteJob.request(IdTag?.id));
        setSelected({ ...Selected, id: null, count: 0 });
      } else {
        message.info('PLEASE SELECT A TICKER TO DELETE');
      }
    },
    [handleDelete]
  );

  return (
    <div className="main-layout">
      <div className={loading ? 'loader' : ''}></div>
      <div
        className={loading ? 'primary-layout loadBlur' : 'primary-layout'}
        id="scrollableDiv"
        ref={listInnerRef}
        style={{ pointerEvents: loading ? 'none' : '' }}
      >
        {userList?.length ? (
          userList.map((obj, index) => (
            <>
              <div
                className={
                  DisableDelete?.includes(obj.id, obj) === true
                    ? 'secondary disable'
                    : Disable?.includes(obj.id) === true
                    ? 'secondary grayout'
                    : `secondary ${Selected?.id === obj.id && Selected.count == 1 ? 'focus' : null}`
                }
                ref={userList.length === index + 1 ? idTag : null}
                onClick={e => {
                  setIdTag({ ...IdTag, id: obj?.id, obj: obj }), handleSelection(e, obj.id);
                }}
              >
                <Image
                  className="image"
                  src={`${USERS_BASE_URL}/${uploadPath}/${userList[index]?.channelLogoPath}`}
                ></Image>
                <div
                  style={{
                    textAlign: 'left',
                    minWidth: '156px',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>
                    <span className="table-icon-wrapper">
                      <CalendarIcon />
                    </span>{' '}
                    <span className="text-white">
                      {formatDate(userList[index]?.programDate, 'DD MMMM YYYY')}
                    </span>
                  </div>
                  <div>
                    <span className="table-icon-wrapper">
                      <ClockIcon />
                    </span>{' '}
                    {userList[index]?.programTime?.toLocaleString('en-US', {
                      hour: 'numeric',
                      hour12: true,
                    })}
                  </div>
                </div>
                <div className="third-div">
                  <img
                    className="thumbnail"
                    src={`${USERS_BASE_URL}/${uploadPath}/${userList[index]?.thumbnailPath}`}
                  ></img>
                  <Input
                    className={`textBox ${userList[index]?.language}`}
                    onChange={e => handleChange(e, obj, index)}
                    onClick={() => setIdTag({ ...IdTag, id: obj?.id, obj: obj })}
                    name="line"
                    value={
                      userList[index].source === 'Ticker'
                        ? userList[index]?.transcription[0]?.line
                        : ''
                    }
                    disabled={DisableDelete.includes(obj.id) ? true : false}
                  />
                </div>
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title={'Save (Alt + S)'}>
                  <FontAwesomeIcon
                    className={DisableDelete?.includes(obj.id) ? 'green-btn disable' : 'green-btn'}
                    onClick={() => handleSave(obj.id, obj)}
                    style={{ marginLeft: '10px' }}
                    disabled={DisableDelete?.includes(obj.id) ? true : false}
                    icon={faSave}
                  />
                </Tooltip>
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title={'Delete (Alt + D)'}>
                  <FontAwesomeIcon
                    type="small"
                    className={DisableDelete?.includes(obj.id) ? 'qc-btn disable' : 'qc-btn'}
                    onClick={e => handleDelete(e, obj?.id)}
                    // onDoubleClick={e => handleDelete(e, obj?.id)}
                    icon={faTrash}
                    style={{ marginLeft: '10px' }}
                  >
                    DELETE
                  </FontAwesomeIcon>
                </Tooltip>
              </div>
            </>
          ))
        ) : loading ? null : (
          <Empty />
        )}
        {userList?.length > 0 && userList?.length < 6 ? (
          <Button onClick={() => fetchData(true)}>Load More</Button>
        ) : null}
      </div>
    </div>
  );
};

export default HyperQc;
