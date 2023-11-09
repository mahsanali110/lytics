import React from 'react';
import { Button } from 'components/Common';
import { sourceBtn, selectIcon } from 'modules/common/utils';

function IconButton({ title, iconDetails, transparent }) {
  return (
    <Button
      style={{
        minWidth: 'fit-content',
        minHeight: 'fit-content',
        borderRadius: '4px',
        backgrouund: transparent,
        display: 'flex',
        justifyContnet: 'center',
        alignItems: 'center',
        color: sourceBtn(iconDetails.source),
      }}
      extraClass="library-table-button"
    >
      {title}
    </Button>
  );
}

export default IconButton;
