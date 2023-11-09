import PropTypes from 'prop-types';

import { Form, Input } from 'antd';
import { Select, Remove } from 'components/Common';

import {} from 'react-redux';

const { TextArea } = Input;

const Theme = ({ onChange, onRemove, mainTheme, subTheme, description, themeOptions }) => {
  console.log({mainTheme})
  const subThemeOptions = () => {
    const currentTheme = themeOptions.find(theme => theme.name === mainTheme) ?? {};
    const subThemes = currentTheme?.subTheme ?? [];
    return subThemes.map(value => ({ value, title: value }));
  };

  return (
    <>
      <Form.Item label="Main Theme">
        <Select
          value={mainTheme}
          name="mainTheme"
          size="small"
          onChange={value => onChange({ field: 'mainTheme', value })}
          options={themeOptions.map(({ name }) => ({ value: name, title: name }))}
        />
      </Form.Item>
      <Form.Item label="Sub Theme/Segment(s)">
        <Select
          value={subTheme}
          name="subTheme"
          mode="multiple"
          allowClear
          size="small"
          onChange={value => onChange({ field: 'subTheme', value })}
          options={subThemeOptions()}
        />
      </Form.Item>
      <Form.Item>
        <TextArea
          defaultValue={description}
          name="description"
          className="bg-light-grey"
          rows={7}
          onBlur={e => onChange({ field: 'description', value: e.target.value })}
        />
      </Form.Item>
      <Remove handleClick={onRemove} />
    </>
  );
};

Theme.propTypes = {
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  mainTheme: PropTypes.string,
  subTheme: PropTypes.array,
  description: PropTypes.string,
  themeOptions: PropTypes.array,
};

export default Theme;
