import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox, message as antMessage } from 'antd';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

import './SavePopup.scss';

function SavePopup({
  handleSubmit,
  onCancel,
  programInfo,
  handleUpdateField,
  isClip,
  isScreen,
  isTicker,
}) {
  const editorReducer = useSelector(state => state.editorReducer);

  const [titleValue, setTitleValue] = useState(programInfo.clipTitle);
  const [descriptionValue, setDescriptionValue] = useState(programInfo.programDescription);
  const [nestedField, setNestedField] = useState('');

  useEffect(() => {
    if (isClip) {
      setNestedField('clipData');
    }
    if (isTicker) {
      setNestedField('tickerData');
    }
    if (isScreen) {
      setNestedField('screenData');
    }
  }, [isClip, isTicker, isScreen]);

  useEffect(() => {
    setTitleValue(editorReducer[nestedField]?.clipTitle);
    setDescriptionValue(editorReducer[nestedField]?.programDescription);
  }, [editorReducer[nestedField]]);

  const onBlurTitle = () => {
    handleUpdateField({ field: 'clipTitle', value: titleValue, nestedField });
  };

  const onBlurDescription = () => {
    handleUpdateField({ field: 'programDescription', value: descriptionValue, nestedField });
  };

  const handleCheckBoxClick = (field, value) => {
    handleUpdateField({ field, value, nestedField });
  };

  return (
    <div className="save-wrapper mb-15 mt-15 w-100">
      <h1 className="save-heading">Save</h1>
      <Input
        value={titleValue}
        onChange={e => setTitleValue(e.target.value)}
        className="Popup-input mb-15"
        placeholder="Title (Required)"
        onBlur={onBlurTitle}
        maxLength={100}
      />
      <TextArea
        value={descriptionValue}
        onChange={e => setDescriptionValue(e.target.value)}
        className="Popup-textarea mb-15"
        style={{}}
        placeholder="description"
        onBlur={onBlurDescription}
        maxLength={200}
      />
      <div className="checkbox-container mb-15">
        <Checkbox
          name="isPersonalLibrary"
          onChange={e => handleCheckBoxClick(e.target.name, e.target.checked)}
          checked={editorReducer[nestedField]?.isPersonalLibrary}
          className="checkbox "
        >
          Personal Library
        </Checkbox>
      </div>
      <div className="checkbox-container mb-15">
        <Checkbox
          name="isCompanyLibrary"
          onChange={e => handleCheckBoxClick(e.target.name, e.target.checked)}
          checked={editorReducer[nestedField]?.isCompanyLibrary}
          className="checkbox"
        >
          {' '}
          Company Library
        </Checkbox>
        {/* <Row className="mb-15" justify="center">
          <Col>
            <Button onClick={handleButtonClick}>Save</Button>
          </Col>
        </Row> */}
      </div>
    </div>
  );
}

SavePopup.PropTypes = {
  visible: PropTypes.bool,
  handleSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

SavePopup.defaultProps = {
  visible: false,
  handleSubmit: () => {},
  onCancel: () => {},
};

export default SavePopup;
