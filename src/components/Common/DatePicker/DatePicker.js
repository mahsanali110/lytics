import React from 'react';
import { DatePicker } from 'antd';

import './DatePicker.scss';

function IMSDatePicker({ ...rest }) {
  return (
    <div className="ims-datepicker-wrapper">
      <DatePicker className="ims-datepicker" {...rest} />
    </div>
  );
}

export default IMSDatePicker;
