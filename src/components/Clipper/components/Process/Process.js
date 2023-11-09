import { useState, useEffect } from 'react';
import { Form, Typography, Tooltip } from 'antd';
import { Select, Card, Button } from 'components/Common';
import { formatDate, formateTime } from 'modules/common/utils';
import { PRIORITY_COLORS } from 'constants/options';
import { RedoOutlined } from '@ant-design/icons';
import { SelectAll } from 'modules/common/utils';
import './preocess.scss';
const { Text } = Typography;
import { TOOLTIP_COLORS } from 'constants/options';
import { useDispatch, useSelector } from 'react-redux';
import guestsActions from 'modules/guests/actions';
const Process = ({
  programInfo,
  channel,
  refresh,
  programTypes,
  hosts,
  programNames,
  process,
  setProcess,
  handleSubmit,
  processExport,
  setProcessExport,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(guestsActions.getGuests.request());
  }, []);
  const { guests, loading } = useSelector(state => state.guestsReducer);

  const onChange = ({ field, value }) =>
    setProcess(prev => ({
      ...prev,
      [field]: value,
    }));
  const [ChannelProgramName, setChannelProgramName] = useState([]);
  const [ChannelALLProgramName, setChannelALLProgramName] = useState([]);
  const [ChannelHostName, setChannelHostName] = useState([]);
  const [seletedProgramName, setseletedProgramName] = useState('');
  const [seletedProgramType, setseletedProgramType] = useState('');
  const [checkparticipent, setcheckparticipent] = useState(false);
  const [checkAnchor, setcheckAnchor] = useState(true);
  useEffect(() => {
    setProcess(prev => ({ ...prev, language: channel.language, region: channel.region }));
    let temp = [];
    programNames.forEach(p => {
      if (channel.actusId == p.channel && p.type == seletedProgramType) {
        temp.push(p);
        // setProcess(prev => ({ ...prev, language: channel.language, region: channel.region }));
      }
    });
    setChannelProgramName(temp);
    setProcess(prev => ({ ...prev, programName: '', anchor: [] }));
    let temp2 = [];
    programNames.forEach(p => {
      if (channel.actusId == p.channel) {
        temp2.push(p);
      }
    });
    setChannelALLProgramName(temp2);
  }, [programNames, channel, seletedProgramType]);

  useEffect(() => {
    let temp = [];
    ChannelALLProgramName.forEach(p => {
      temp.push(p.host);
    });
    temp = temp.flat(1);
    setChannelHostName(temp);
  }, [ChannelALLProgramName]);
  useEffect(() => {
    ChannelProgramName.forEach(p => {
      if (p.title === seletedProgramName) {
        setProcess(prev => ({ ...prev, anchor: p.host }));
        if (p.host.length == 0) {
          setcheckAnchor(false);
        } else {
          setcheckAnchor(true);
        }
        console.log(p.host.length);
      }
    });
  }, [seletedProgramName]);
  function onSearch(val) {
    console.log('search:', val);
  }
  return (
    <Card
      bg="dark"
      variant="secondary"
      content={
        <section className="process-wrapper">
          <section className="card-detail-body mt-10">
            <div className="sub-heading">
              <Text>Program Information</Text>
              <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Refresh The Metadata">
                <RedoOutlined onClick={refresh} />
              </Tooltip>
            </div>
            <div className="mb-10">
              <Text className="text-grey small-font-size mr-10">Channel:</Text>
              <Text className="text-pink small-font-size">{channel.name}</Text>
            </div>
            <div className="mb-10">
              <Text className="text-grey small-font-size mr-10">Date:</Text>
              <Text className="text-pink small-font-size">
                {formatDate(programInfo.programDate, 'DD/MM/YYYY')}
              </Text>
            </div>
            <div className="mb-10">
              <Text className="text-grey small-font-size mr-10">Time:</Text>
              <Text className="text-pink small-font-size">
                {formateTime(programInfo.programTime1)}
              </Text>
            </div>
            <Form layout="vertical">
              <Form.Item label="Program Type" required>
                <Select
                  value={process.programType}
                  size="small"
                  onChange={value => {
                    onChange({ field: 'programType', value });
                    setseletedProgramType(value);
                  }}
                  options={programTypes.map(({ name }) => ({ title: name, value: name }))}
                />
              </Form.Item>
              <Form.Item label="Program Name" required>
                <Select
                  value={process.programName}
                  size="small"
                  onChange={value => {
                    onChange({ field: 'programName', value }), setseletedProgramName(value);
                  }}
                  options={ChannelProgramName.map(({ title }) => ({ title, value: title }))}
                />
              </Form.Item>

              <Form.Item label="Channel Anchors" required={checkAnchor}>
                <Select
                  value={process.anchor}
                  mode="multiple"
                  SelectAll={SelectAll}
                  maxTagCount={1}
                  size="small"
                  onChange={value => {
                    value.includes('All')
                      ? value.map(value => {
                          onChange({
                            field: 'anchor',
                            value: [value, ...ChannelHostName.map(value => value)],
                          });
                        })
                      : onChange({
                          field: 'anchor',
                          value,
                        });
                  }}
                  onDeselect={value => {
                    if (value === 'All') onChange({ field: 'anchor', value: [] });
                  }}
                  options={ChannelHostName.map(name => ({ title: name, value: name }))}
                />
              </Form.Item>
              <Form.Item label="Participant(s) Name" required={checkparticipent}>
                <Select
                  value={process.guest}
                  mode="multiple"
                  SelectAll={SelectAll}
                  maxTagCount={1}
                  size="small"
                  onSearch={onSearch}
                  // filterOption={true}
                  // showSearch
                  onChange={value => {
                    value.includes('All')
                      ? value.map(value => {
                          onChange({
                            field: 'guest',
                            value: [
                              value,
                              ...guests?.map(
                                ({ name, association, description }) =>
                                  `${name}|${association}|${description}`
                              ),
                            ],
                          });
                        })
                      : onChange({
                          field: 'guest',
                          value,
                        });
                  }}
                  onDeselect={value => {
                    if (value === 'All') onChange({ field: 'guest', value: [] });
                  }}
                  options={guests.map(({ name, association, description }) => ({
                    value: `${name}|${association}|${description}`,
                    title: `${name} (${association})`,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Channel Region" required>
                <Select
                  value={process.region}
                  size="small"
                  onChange={value => onChange({ field: 'region', value })}
                  options={['Local', 'National', 'International'].map(title => ({
                    title,
                    value: title,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Processing Priority" required>
                <Select
                  className={`${PRIORITY_COLORS[process.priority]}`}
                  value={process.priority}
                  placeholder=""
                  size="small"
                  onChange={value => onChange({ field: 'priority', value })}
                  options={Object.keys(PRIORITY_COLORS).map(title => ({ title, value: title }))}
                />
              </Form.Item>

              <Form.Item label="Processing Language" required>
                <Select
                  value={process.language}
                  size="small"
                  onChange={value => onChange({ field: 'language', value })}
                  options={['URDU', 'ENGLISH'].map(title => ({ title, value: title }))}
                />
              </Form.Item>
            </Form>
            {/* <Export
              programInfo={programInfo}
              programTypes={programTypes}
              processExport={processExport}
              setProcessExport={setProcessExport}
            /> */}
          </section>
          <div className="clipper-footer">
            <Button onClick={handleSubmit}>PROCESS</Button>
          </div>
        </section>
      }
    />
  );
};

export default Process;
