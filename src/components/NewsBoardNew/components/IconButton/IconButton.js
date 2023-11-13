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
        padding: '4px 4px',
        display: 'flex',
        justifyContnet: 'center',
        alignItems: 'center',
        color: sourceBtn(iconDetails.source),
        fontSize: '12px',
        height: '26px',
      }}
      extraClass="library-table-button"
      icon={selectIcon(iconDetails.source)}
      // iconProps={{ width: '9px', height: '9px' }}
    >
      {title}
    </Button>
  );
}

export default IconButton;
