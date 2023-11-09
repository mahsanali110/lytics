import React from 'react';
import { Row, Col, Form } from 'antd';
import { YoutubeFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import './YoutubeShare.scss';

import { SocialAccordionWrapper, UplaodThumbnail, TextArea } from '../';
import { Select, Input } from 'components/Common';
import editorActions from 'modules/editor/actions';

function YoutubeShare({ handleUpdateField }) {
  const dispatch = useDispatch();
  const { youtubeData } = useSelector(state => state.editorReducer);

  const hanldeFileChange = ({ fileList }) => {
    handleUpdateField({ field: 'fileList', value: fileList, nestedField: 'youtubeData' });
  };

  const heading = (
    <Row gutter={8} justify="center" style={{ alignItems: 'center' }}>
      <Col>
        <YoutubeFilled
          style={{
            color: 'red',
            fontSize: '32px',
          }}
        />
      </Col>
      <Col className="youtube-heading text-white ff-roboto">Youtube Share</Col>
    </Row>
  );
  const content = (
    <div>
      <Form layout="vertical">
        <Row className="mb-10" gutter={12}>
          <Col span={12}>
            <Form.Item label="Title">
              <Input
                value={youtubeData.title}
                onBlur={e =>
                  handleUpdateField({
                    field: 'title',
                    value: e.target.value,
                    nestedField: 'youtubeData',
                  })
                }
                placeholder="Title"
                maxLength={100}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Playlist">
              <Select
                value={youtubeData.playList}
                onChange={value =>
                  handleUpdateField({
                    field: 'playList',
                    value,
                    nestedField: 'youtubeData',
                  })
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row className="mb-10" gutter={12}>
          <Col span={20}>
            <Form.Item label="Tags">
              <Input
                value={youtubeData.tags.join(',')}
                onChange={e =>
                  handleUpdateField({
                    field: 'tags',
                    value: e.target.value.split(','),
                    nestedField: 'youtubeData',
                  })
                }
                placeholder="Tags (comma separated)"
                maxLength={100}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row className="mt-15">
          <Col span={24}>
            <UplaodThumbnail fileList={youtubeData.fileList} hanldeFileChange={hanldeFileChange} />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <TextArea
              value={youtubeData.caption}
              onChange={value =>
                handleUpdateField({
                  field: 'caption',
                  value,
                  nestedField: 'youtubeData',
                })
              }
              rows={10}
              maxLength={250}
              placeholder={'Caption'}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );

  const panels = [
    {
      heading,
      content,
    },
  ];
  return (
    <di className="youtube-accordion-wrapper">
      <SocialAccordionWrapper
        className="youtube-accordion mt-15"
        panels={panels}
        bordered={false}
        ghost
      />
    </di>
  );
}

export default YoutubeShare;
