import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { commonActions } from 'modules/common/actions';

let resolveCallback;
const useConfirm = () => {
  const dispatch = useDispatch();
  const { show, text } = useSelector(state => state.commonReducer);

  const closeConfirm = () => {
    dispatch(commonActions.hideConfirm());
  };
  const onConfirm = () => {
    closeConfirm();
    resolveCallback(true);
  };
  const onCancel = () => {
    closeConfirm();
    resolveCallback(false);
  };
  const confirm = text => {
    dispatch(commonActions.showConfirm({ text }));
    return new Promise((res, rej) => {
      resolveCallback = res;
    });
  };
  return { confirm, onConfirm, onCancel, confirmState: { show, text } };
};

export default useConfirm;
