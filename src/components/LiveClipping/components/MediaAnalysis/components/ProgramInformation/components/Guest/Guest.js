import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { Select, Remove } from 'components/Common';

import {} from 'react-redux';

const { TextArea } = Input;

const Guest = ({ onChange, onRemove, name, description, guestsOptions }) => {
  const [desc, setDesc] = useState(description);
  useEffect(() => {
    setDesc(description);
  }, [description]);
  return (
    <>
      <Form.Item label="Participant Name">
        <Select
          name="name"
          value={name}
          size="small"
          onChange={value => onChange({ value, field: 'name' })}
          options={guestsOptions.map(({ name, association }) => ({
            value: `${name} (${association})`,
            title: `${name} (${association})`,
          }))}
        />
      </Form.Item>
      <Form.Item>
        <TextArea
          className="bg-light-grey"
          rows={7}
          name="description"
          value={desc}
          onChange={e => {
            setDesc(e.target.value);
          }}
          onBlur={e => onChange({ field: 'description', value: desc })}
        />
      </Form.Item>
      <Remove handleClick={onRemove} />
    </>
  );
};

Guest.propTypes = {
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  guestsOptions: PropTypes.array,
};

export default Guest;
