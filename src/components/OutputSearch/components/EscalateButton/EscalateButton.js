import React from 'react';
import './EscalateButton.scss';

const EscalateButton = ({ handleSubmit, disable }) => {
  return (
    <button
      className={`escalte-button ${disable ? 'disable' : ''}`}
      onClick={e => {
        e.stopPropagation();
        // escalateJob(record.id);
        handleSubmit();
      }}
    >
      ESCALATE
    </button>
  );
};

export default React.memo(EscalateButton);
