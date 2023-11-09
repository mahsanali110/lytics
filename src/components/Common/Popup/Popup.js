import React from 'react';
import { createPortal } from 'react-dom';
import useConfirm from 'hooks/useConfirm';
import { Button } from 'components/Common';
import './Popup.scss';

const Popup = () => {
  const { onConfirm, onCancel, confirmState } = useConfirm();
  const portalElement = document.getElementById('portal');
  const component = confirmState.show ? (
    <div className="portal-overlay">
      <div className="confirm-dialog">
        <p>{confirmState?.text && confirmState.text}</p>
        <div className="confirm-dialog__footer">
          <Button variant="primary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onConfirm}>
            Ok
          </Button>
        </div>
      </div>
    </div>
  ) : null;
  return createPortal(component, portalElement);
};

export default Popup;
