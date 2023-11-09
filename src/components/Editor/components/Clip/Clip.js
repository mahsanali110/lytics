import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Image, Form } from 'antd';

import './Clip.scss';

import { Select } from 'components/Common';

import { USERS_BASE_URL } from 'constants/config';
import { uploadPath } from 'constants/index';
import editorActions from 'modules/editor/actions';
import { makeGuestString } from 'modules/common/utils';

function Clip({ programInfo }) {
  const dispatch = useDispatch();
  const { selectedWindows } = useSelector(state => state.liveClippingReducer);
  const { hosts } = useSelector(state => state.hostsReducer);
  const { guests } = useSelector(state => state.guestsReducer);
  const { videoDuration } = useSelector(state => state.commonReducer);

  const handleUpdateField = ({ field, value, nestedField }) => {
    return dispatch(editorActions.updateByField({ field, value, nestedField }));
  };

  return (
    <>
      <Row className="mb-10" gutter={16}>
        <Col span={12}>
          <Form.Item label="Speakers">
            <Select
              mode="multiple"
              className={'clip-multiple-select'}
              value={programInfo.anchor}
              maxTagCount={1}
              onChange={value =>
                handleUpdateField({ field: 'anchor', value, nestedField: 'clipData' })
              }
              options={hosts.map(({ name }) => ({ title: name, value: name }))}
              placeholder={'Speakers'}
              style={{ width: '100%' }}
              disabled={!selectedWindows.length}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Guest">
            <Select
              mode="multiple"
              className={'clip-multiple-select'}
              value={programInfo.guests?.map(guest => makeGuestString(guest))}
              maxTagCount={1}
              onChange={value => {
                const _value = value.map(guest => ({
                  name: guest.split('|')[0],
                  association: guest.split('|')[1],
                  description: guest.split('|')[2],
                }));
                handleUpdateField({ field: 'guests', value: _value, nestedField: 'clipData' });
              }}
              options={guests.map(({ name, association, description }) => ({
                title: name,
                value: `${name}|${association}|${description}`,
              }))}
              placeholder={'Guest'}
              style={{ width: '100%' }}
              disabled={!selectedWindows.length}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row className="thumbnail-row" justify="center">
        <Col span={16}>
          <Image
            className="thumbnail-image"
            src={
              !selectedWindows.length
                ? `${USERS_BASE_URL}/${uploadPath}/${programInfo.thumbnailPath}`
                : programInfo.thumbnailPath
            }
            fallback="placeholder.png"
            preview={false}
          />
        </Col>
      </Row>

      <Row className="mb-10" justify="center">
        <Col className="text-white">{`${
          programInfo.segmentDuration ? programInfo.segmentDuration : Math.floor(videoDuration)
        } s`}</Col>
      </Row>
    </>
  );
}

export default Clip;
