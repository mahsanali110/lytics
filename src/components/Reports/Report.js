import React, { useEffect, useState } from 'react';
import PDF, { handleGeneratePdf } from './PdfReport/Pdf2';
import { Card, Button, Select } from 'components/Common';
import { Col, Row, Form, Tooltip, Spin, message as antMessage } from 'antd';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { DAYS, MONTHS, YEARS } from 'constants/options';
import { useDispatch, useSelector } from 'react-redux';
import programNamesActions from 'modules/programNames/actions';
import themesActions from 'modules/theme/actions';
import { pdfReport } from 'modules/reports/action';
import { modifyOptions, onSelect, onDeselect, onClear } from './utils';
import moment from 'moment';
import { TOOLTIP_COLORS } from '../../constants/options';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

import './Report.scss';
import _ from 'lodash';
const initialState = {
  channel: [],
  programType: [],
  programName: [],
  theme: [],
  subTheme: [],
  dateFrom: '',
  dateTo: '',
};
const initialState2 = {
  theme: [],
  subTheme: [],
};
// const initialFromDateValue = {
//   day: moment().format('DD'),
//   month: moment().format('MM'),
//   year: moment().format('YYYY'),
// };

// const initialToDateValue = {
//   day: moment().format('DD'),
//   month: moment().format('MM'),
//   year: moment().format('YYYY'),
// };

const Report = () => {
  const [programNamesCount, setProgramNamesCount] = useState(1);
  const [themesCount, setThemesCount] = useState(1);
  const dispatch = useDispatch();
  const { programNames, programNamesError } = useSelector(state => state.programNamesReducer);
  const { themeRecords, themesError } = useSelector(state => state.themesReducer);
  const { report } = useSelector(state => state.reportReducer);
  const [reportRecord, setReportRecord] = useState(initialState);
  const [reportRecord2, setReportRecord2] = useState(initialState2);
  const [programRecord, setProgramRecord] = useState([]);
  const [selectedThemeRecord, setSelectedThemeRecord] = useState([]);
  // const [toDate, setToDate] = useState(initialToDateValue);
  // const [fromDate, setFromDate] = useState(initialFromDateValue);
  let [dateFrom, setDateFrom] = useState();
  let [dateTo, setDateTo] = useState();

  useEffect(() => {
    let lte = moment().format('YYYY-MM-DD');
    let gte = moment().subtract(1, 'day').format('YYYY-MM-DD');
    setDateFrom(gte);
    setDateTo(lte);
  }, []);

  useEffect(() => {
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(themesActions.getThemes.request());
  }, []);

  useEffect(() => {
    if (programNamesError || programNamesError === networkError) {
      setProgramNamesCount(prevCount => prevCount + 1);
      if (programNamesCount <= errorCount) {
        setTimeout(() => {
          dispatch(programNamesActions.getProgramNames.request());
        }, errorDelay);
      } else if (programNamesError === networkError) {
        alert(`${programNamesError}, Please refresh!`);
        window.location.reload();
      } else if (programNamesError !== networkError) {
        alert(`${programNamesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [programNamesError]);
  useEffect(() => {
    if (themesError || themesError === networkError) {
      setThemesCount(prevCount => prevCount + 1);
      if (themesCount <= errorCount) {
        setTimeout(() => {
          dispatch(themesActions.getThemes.request());
        }, errorDelay);
      } else if (themesError === networkError) {
        alert(`${themesError}, Please refresh!`);
        window.location.reload();
      } else if (themesError !== networkError) {
        alert(`${themesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [themesError]);

  useEffect(() => {
    let channels = modifyOptions(_.uniqBy(programNames, 'channel'), 'channel').map(
      ({ channel }) => channel
    );
    let types = modifyOptions(_.uniqBy(programNames, 'type'), 'type').map(({ type }) => type);

    let programes = modifyOptions(_.uniqBy(programNames, 'title'), 'title').map(
      ({ title }) => title
    );
    let mainThemes = modifyOptions(_.uniqBy(themeRecords, 'name'), 'name').map(({ name }) => name);

    let subThemes = [];
    modifyOptions(_.uniqBy(themeRecords, 'subTheme'), 'subTheme').map(({ subTheme }, index) => {
      !index ? subThemes.push(subTheme) : subTheme.map(theme => subThemes.push(theme));
    });
    setReportRecord({
      ...reportRecord,
      programType: [...types],
      programName: [...programes],
      channel: [...channels],
    });
  }, [programNames]);

  useEffect(() => {
    let mainThemes = modifyOptions(_.uniqBy(themeRecords, 'name'), 'name').map(({ name }) => name);

    let subThemes = [];
    modifyOptions(_.uniqBy(themeRecords, 'subTheme'), 'subTheme').map(({ subTheme }, index) => {
      !index ? subThemes.push(subTheme) : subTheme.map(theme => subThemes.push(theme));
    });
    setReportRecord2({
      theme: [..._.uniq(mainThemes)],
      subTheme: [..._.uniq(subThemes)],
    });
  }, [themeRecords]);

  // useEffect(() => {
  //   let filterType = programNames?.filter(
  //     programType => programType.channel === reportRecord.channel
  //   );
  //   setReportRecord({ ...reportRecord, programType: '', programName: '' });
  //   setProgramRecord(filterType);
  // }, [reportRecord.channel]);

  useEffect(() => {
    let filterType = [];
    programNames?.map(programType =>
      reportRecord.channel?.map(channel => {
        if (programType.channel === channel) {
          filterType.push(programType);
        }
      })
    );
    setReportRecord({ ...reportRecord });
    setProgramRecord([...filterType]);
  }, [reportRecord.channel]);
  useEffect(() => {
    let filterThemeRecord = [];
    themeRecords?.map(themeRecord => {
      // themeRecord => themeRecord.name === reportRecord.theme
      reportRecord2?.theme?.map(theme => {
        if (themeRecord.name === theme) {
          filterThemeRecord.push(themeRecord);
        }
      });
    });
    setSelectedThemeRecord(filterThemeRecord);
  }, [reportRecord2.theme]);

  useEffect(() => {
    let arr = [];
    let options = [];
    selectedThemeRecord.forEach(val => {
      val.subTheme.map(el => options.push(el));
    });
    reportRecord2.subTheme.map(val => {
      if (options.includes(val)) arr.push(val);
    });
    setReportRecord2({ ...reportRecord2, subTheme: [...arr] });
  }, [selectedThemeRecord]);

  useEffect(() => {
    let arr = [];
    let arr2 = [];
    let options = [];
    let options2 = [];
    modifyOptions(_.uniqBy(programRecord, 'title')).map(({ title }) => options.push(title));
    modifyOptions(_.uniqBy(programRecord, 'type')).map(({ type }) => options2.push(type));
    reportRecord.programName.map(val => {
      if (options.includes(val)) arr.push(val);
    });
    reportRecord.programType.map(val => {
      if (options2.includes(val)) arr2.push(val);
    });
    const all = arr.length ? ['Select All'] : [];
    setReportRecord({
      ...reportRecord,
      programName: [...all, ...arr2, ...arr],
      programType: [...all, ...arr2],
    });
  }, [programRecord]);

  const handleRangeChange = (dates, dateStrings) => {
    setDateFrom('');
    setDateTo('');
    setDateFrom(dateStrings[0]);
    setDateTo(dateStrings[1]);
  };

  const handlegenerate = async () => {
    if (
      !reportRecord.channel.length ||
      !reportRecord.programType.length ||
      !reportRecord.programName.length ||
      // toDate.month === '' ||
      // toDate.month === '' ||
      // toDate.year === '' ||
      // fromDate.month === '' ||
      // fromDate.month === '' ||
      // fromDate.year === '' ||
      dateFrom === '' ||
      dateTo === '' ||
      !reportRecord2.theme.length
    ) {
      antMessage.error('Kindly Fill All The Fields ', 5);
    } else {
      const data = {
        ..._.omitBy(reportRecord, _.isEmpty),
        ..._.omitBy(reportRecord2, _.isEmpty),
        dateFrom,
        dateTo,
      };
      dispatch(pdfReport.getTalkShowReport.request(data));
      setTimeout(() => {
        handleGeneratePdf(data.dateFrom, data.dateTo);
      }, 2000);
    }
  };

  const content = (
    <>
      <Row />
      <Form size="small" layout="vertical" className="reports-form" onFinish={handlegenerate}>
        <Form.Item label="Channel" required>
          <Select
            type="text"
            mode="multiple"
            className="form-input"
            name="channel"
            options={modifyOptions(_.uniqBy(programNames, 'channel'), 'channel').map(
              ({ channel }) => ({
                value: channel,
                title: channel,
              })
            )}
            onChange={value => setReportRecord({ ...reportRecord, channel: value })}
            onSelect={value => {
              onSelect(
                value,
                'channel',
                modifyOptions(_.uniqBy(programNames, 'channel')),
                reportRecord,
                setReportRecord
              );
            }}
            onDeselect={value => onDeselect(value, 'channel', reportRecord, setReportRecord)}
            onClear={() => onClear('channel', reportRecord, setReportRecord)}
            value={reportRecord.channel}
          />
        </Form.Item>
        <Form.Item label="Program Type" required>
          <Select
            mode="multiple"
            type="text"
            size="small"
            className="form-input"
            name="programType"
            options={modifyOptions(_.uniqBy(programRecord, 'type'), 'type').map(({ type }) => ({
              value: type,
              title: type,
            }))}
            onChange={value => ('' ? {} : setReportRecord({ ...reportRecord, programType: value }))}
            onSelect={value =>
              onSelect(
                value,
                'programType',
                modifyOptions(_.uniqBy(programRecord, 'type')),
                reportRecord,
                setReportRecord
              )
            }
            onDeselect={value => onDeselect(value, 'programType', reportRecord, setReportRecord)}
            onClear={() => onClear('programType', reportRecord, setReportRecord)}
            value={reportRecord?.programType}
          />
        </Form.Item>
        <Form.Item label="Program Name" required>
          <Select
            mode="multiple"
            // type="text"
            className="form-input"
            name="programName"
            // options={modifyOptions(programRecord, 'title')?.map(({ title }) => ({ value: title, title: title }))}
            options={modifyOptions(_.uniqBy(programRecord, 'title'), 'title').map(({ title }) => ({
              value: title,
              title: title,
            }))}
            onChange={value =>
              value === '' ? {} : setReportRecord({ ...reportRecord, programName: value })
            }
            onSelect={value =>
              onSelect(
                value,
                'programName',
                modifyOptions(_.uniqBy(programRecord, 'title')),
                reportRecord,
                setReportRecord
              )
            }
            onDeselect={value => onDeselect(value, 'programName', reportRecord, setReportRecord)}
            onClear={() => onClear('programName', reportRecord, setReportRecord)}
            value={reportRecord?.programName}
          />
        </Form.Item>
        <Form.Item label="Date" required>
          <RangePicker
            onChange={handleRangeChange}
            className="form-input"
            defaultValue={[moment().subtract(1, 'day'), moment()]}
          />
        </Form.Item>

        {/* <Form.Item label="Date From" required>
          <Row>
            <Col span={4}>
              <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Day">
                <Select
                  value={fromDate.day}
                  type="text"
                  className="form-input"
                  name="day"
                  options={DAYS.map(day => ({ title: day, value: day }))}
                  onChange={value => {
                    setFromDate({ ...fromDate, day: value });
                  }}
                />
              </Tooltip>
            </Col>
            <Col span={4}>
              <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Month">
                <Select
                  value={fromDate.month}
                  type="text"
                  className="form-input"
                  name="month"
                  options={MONTHS.map(month => ({ title: month, value: month }))}
                  onChange={value => {
                    setFromDate({ ...fromDate, month: value });
                  }}
                />
              </Tooltip>
            </Col>
            <Col span={6}>
              <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Year">
                <Select
                  value={fromDate.year}
                  type="text"
                  className="form-input"
                  name="year"
                  options={YEARS.map(year => ({ title: year, value: year }))}
                  onChange={value => {
                    setFromDate({ ...fromDate, year: value });
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="Date To" required>
          <Row>
            <Col span={4}>
              <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Day">
                <Select
                  value={toDate.day}
                  type="text"
                  options={DAYS.map(day => ({ title: day, value: day }))}
                  onChange={value => {
                    setToDate({ ...toDate, day: value });
                  }}
                  className="form-input"
                  name="dateFromDays"
                />
              </Tooltip>
            </Col>
            <Col span={4}>
              <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Month">
                <Select
                  value={toDate.month}
                  type="text"
                  className="form-input"
                  options={MONTHS.map(month => ({ title: month, value: month }))}
                  onChange={value => {
                    setToDate({ ...toDate, month: value });
                  }}
                  name="dateFromMoths"
                />
              </Tooltip>
            </Col>
            <Col span={6}>
              <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Year">
                <Select
                  value={toDate.year}
                  type="text"
                  options={YEARS.map(year => ({ title: year, value: year }))}
                  onChange={value => {
                    setToDate({ ...toDate, year: value });
                  }}
                  className="form-input"
                  name="dateFromYears"
                />
              </Tooltip>
            </Col>
          </Row>
        </Form.Item> */}
        <Form.Item label="Main Theme" required>
          <Select
            mode="multiple"
            type="text"
            className="form-input"
            name="mainTheme"
            options={modifyOptions(_.uniqBy(themeRecords, 'name'), 'name', 'top')?.map(
              ({ name }) => ({
                value: name,
                title: name,
              })
            )}
            onChange={value => setReportRecord({ ...reportRecord, theme: value })}
            onSelect={value =>
              onSelect(
                value,
                'theme',
                modifyOptions(_.uniqBy(themeRecords, 'name')),
                reportRecord2,
                setReportRecord2
              )
            }
            onDeselect={value => onDeselect(value, 'theme', reportRecord2, setReportRecord2)}
            onClear={() => onClear('theme', reportRecord2, setReportRecord2)}
            value={reportRecord2.theme}
          />
        </Form.Item>
        <Form.Item label="Sub Theme/Segment(s)" required>
          <Select
            mode="multiple"
            type="text"
            options={_.uniq(
              modifyOptions(selectedThemeRecord, 'subTheme', 'top')
                ?.map(({ subTheme }) => subTheme)
                .flat()
            ).map(name => ({ value: name, title: name }))}
            onChange={value => setReportRecord({ ...reportRecord, subTheme: value })}
            onSelect={value =>
              onSelect(
                value,
                'subTheme',
                modifyOptions(selectedThemeRecord),
                reportRecord2,
                setReportRecord2
              )
            }
            onDeselect={value => onDeselect(value, 'subTheme', reportRecord2, setReportRecord2)}
            onClear={() => onClear('subTheme', reportRecord2, setReportRecord2)}
            className="form-input"
            name="dateFromYears"
            value={reportRecord2.subTheme}
          />
        </Form.Item>
        {/* <Form.Item label="Anchor (s)">
          <Select
            mode="multiple"
            type="text"
            options={programRecord
              ?.map(({ host }) => host)
              .flat()
              .map(name => ({ value: name, title: name }))}
            onChange={value => setReportRecord({ ...reportRecord, host: value })}
            className="form-input"
            name="dateFromYears"
          />
        </Form.Item> */}
        <div className="report-button">
          <Button variant="secondary" htmlType="submit">
            Generate Report
          </Button>
        </div>
      </Form>
      <Row />
    </>
  );
  return (
    <>
      <Row gutter={16} className="report-container-div">
        <Col span={2} />
        <Col span={7}>
          <Spin spinning={programNamesError || themesError} delay={500}>
            <Card title="Talk Show Report" content={content} />
          </Spin>
        </Col>
        <Col span={7}>
          <Card title="Guest Analysis Report" />
        </Col>
        <Col span={7}>
          <Card title="Trend Analysis Report" />
        </Col>
        <Col span={1} />
      </Row>
      <PDF report={report} />
    </>
  );
};
export default Report;
