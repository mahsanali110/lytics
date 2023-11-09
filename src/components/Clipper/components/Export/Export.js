import { useState, useRef, useEffect } from 'react';
import { Form, Input, Typography, Row, Col } from 'antd';
import { Select, Card, Button } from 'components/Common';
const { TextArea } = Input;
const { Text } = Typography;
import PicturesWall from '../../../AdminPanel/ImageUpload';
import './export.scss';
const ProcessExport = ({
  programInfo,
  programTypes,
  processExport,
  setProcessExport,
  handleExportSubmit,
  programNames,
  channel,
  qualtiyOptions,
  setFileList,
  fileList,
}) => {
  const [ChannelProgramName, setChannelProgramName] = useState([]);
  const onChange = ({ field, value }) => setProcessExport(prev => ({ ...prev, [field]: value }));
  const [thumbnailURL, setthumbnailURL] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    let temp = [];
    programNames.forEach(p => {
      if (channel.actusId == p.channel) {
        temp.push(p);
        // setProcess(prev => ({ ...prev, language: channel.language, region: channel.region }));
      }
    });
    setChannelProgramName(temp);
  }, [programNames, channel]);
  useEffect(() => {
    setthumbnailURL(programInfo?.thumbnailPath);
    setFileList([{ url: programInfo?.thumbnailPath }]);
  }, [programInfo]);
  const handleImageUpload = e => {
    inputRef.current.click();
  };
  const handleURLChange = e => {
    if (e?.target?.files[0]) {
      setthumbnailURL(URL.createObjectURL(e?.target?.files[0]));
    }
  };
  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };
  return (
    <Card
      bg="dark"
      variant="secondary"
      content={
        <section className="process-wrapper export-wrapper">
          <section className="card-detail-body mt-10">
            <div className="sub-heading">
              <Text>Export Information</Text>
            </div>
            <Form layout="vertical">
              {/* <Text className="text-blue large-alt-font-size">Metadata</Text> */}
              <div style={{ width: '100%' }}>
                {/* <Form.Item label="Program Description">
                  <TextArea
                    //style={{ height: '15.8rem' }}
                    defaultValue={processExport.programDescription}
                    onBlur={e => onChange({ field: 'programDescription', value: e.target.value })}
                    className="bg-light-grey"
                    rows={4}
                    placeholder=""
                  />
                </Form.Item> */}
                {/* <Row className="mt-10"> */}
                {/* <div> */}
                <Text className="text-grey small-font-size">Thumbnail</Text>
                {/* </div> */}
                <div style={{ display: 'flex', marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  {/* <Col span="18"> */}
                  <PicturesWall handleImageChange={handleImageChange} fileList={fileList} />
                  {/* <input
                        type="image"
                        src={thumbnailURL}
                        name=""
                        id=""
                        width="100%"
                        height={100}
                        onClick={handleImageUpload}
                      />
                      <input
                        onChange={handleURLChange}
                        ref={inputRef}
                        type="file"
                        id="my_file"
                        style={{ display: 'none' }}
                        accept="image/*"
                      /> */}
                  {/* </Col> */}
                </div>
                {/* </Row> */}
              </div>
              {/* <Form.Item label="Comments">
                <TextArea
                  style={{ height: '10rem' }}
                  defaultValue={processExport.comments}
                  onBlur={e => onChange({ field: 'comments', value: e.target.value })}
                  className="bg-light-grey"
                  rows={4}
                  placeholder=""
                />
              </Form.Item> */}
              <div className="export-output">
                <Text className="text-blue large-alt-font-size">Output</Text>
                <Form.Item label="Program Name">
                  <Select
                    value={processExport.output.programType}
                    placeholder="Enter Here"
                    size="small"
                    onChange={value =>
                      onChange({
                        field: 'output',
                        value: { ...processExport.output, programType: value },
                      })
                    }
                    style={{ width: 300 }}
                    options={ChannelProgramName.map(({ title }) => ({
                      title: title,
                      value: title,
                    }))}
                  />
                </Form.Item>
                <Form.Item label="Format">
                  <Select
                    value={processExport.output.format}
                    placeholder="Enter Here"
                    size="small"
                    onChange={value =>
                      onChange({
                        field: 'output',
                        value: { ...processExport.output, format: value },
                      })
                    }
                    style={{ width: 300 }}
                    options={qualtiyOptions.map(({ quality }, i) => ({
                      title: quality,
                      value: i,
                    }))}
                  />
                </Form.Item>
                {/* <Form.Item label="Frame Size">
                  <Select
                    value={processExport.output.frameSize}
                    placeholder="Enter Here"
                    size="small"
                    onChange={value =>
                      onChange({
                        field: 'output',
                        value: { ...processExport.output, frameSize: value },
                      })
                    }
                    options={['1024x576'].map(title => ({ title, value: title }))}
                  />
                </Form.Item>
                <Form.Item label="Bit Rate">
                  <Select
                    value={processExport.output.frameSize}
                    placeholder="Enter Here"
                    size="small"
                    onChange={value =>
                      onChange({
                        field: 'output',
                        value: { ...processExport.output, frameSize: value },
                      })
                    }
                    options={['1024x576'].map(title => ({ title, value: title }))}
                  />
                </Form.Item> */}
              </div>
            </Form>
          </section>
          <div className="export-footer">
            <Button>PROCESS & EXPORT</Button>
            <Button onClick={handleExportSubmit} style={{ marginLeft: '0.3rem' }}>
              EXPORT
            </Button>
          </div>
        </section>
      }
    />
  );
};
export default ProcessExport;
