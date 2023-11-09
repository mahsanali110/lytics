import React from 'react';
import { Button } from 'components/Common';
import { sourceBtn, selectIcon } from 'modules/common/utils';

function IconButton({ title, iconDetails, transparent }) {
  return (
    <Button
      style={{
        minWidth: 'fit-content',
        minHeight: 'fit-content',
        borderRadius: '100px',
        backgrouund: transparent,
        display: 'flex',
        justifyContnet: 'center',
        alignItems: 'center',
        padding: '4px 10px',
        color: sourceBtn(iconDetails.source),
      }}
      extraClass="library-table-button"
    >
      <span
        style={{
          fontSize: '12px',
        }}
      >
        {' '}
        {title}{' '}
      </span>
    </Button>
  );
}

export default IconButton;
