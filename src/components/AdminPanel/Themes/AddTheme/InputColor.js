import React from 'react';
import Panel from 'rc-color-picker/lib/Panel';
import { Dropdown, Input, Button } from 'antd';

function InputColor({ color, onChange }) {

  const [internalColor, setInternalColor] = React.useState(color);
  React.useEffect(() => {
    setInternalColor(color);
  }, [color]);

  const handleChange = color => {
    setInternalColor(color.color);

    if (onChange) {
      onChange({ target: { name: 'color', value: color.color } });
    }
  };

  const overlay = (
    <div>
      <Panel color={internalColor} enableAlpha={false} onChange={handleChange} />
    </div>
  );

  return (
    <>
      <Input
        type="text"
        name="color"
        value={internalColor || ''}
        style={{
          background: 'transparent',
          borderColor: 'rgba(242, 242, 242, 0.24)',
          borderRadius: '4px',
          fontSize: '11px',
          padding: '3px',
        }}
        onChange={onChange}
        suffix={
          <Dropdown trigger={['click']} overlay={overlay}>
            <button
              style={{
                background: internalColor,
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            >
              {' '}
            </button>
          </Dropdown>
        }
      />
    </>
  );
}

export default InputColor;
