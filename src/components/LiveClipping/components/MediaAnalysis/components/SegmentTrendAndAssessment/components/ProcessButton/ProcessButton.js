import React, { useState, useEffect } from 'react';
import { message as antMessage } from 'antd';

import { Button } from 'components/Common';

function ProcessButton({ loading, disabled, text, onClick: OnProcessClick, thumbnail }) {
  const [isBroken, setIsBroken] = useState(false);
  const checkBrokenImage = url => {
    const img = new Image();
    img.src = url;
    img.onerror = () => {
      antMessage.error('Thumbnail failed to load, kindly add it manually', 5);
      setIsBroken(true);
    };
  };

  const showBrokenToast = () => {
    return antMessage.error('Thumbnail is required!', 5);
  };

  useEffect(() => {
    if (thumbnail && thumbnail?.length && thumbnail[0]?.url) {
      checkBrokenImage(thumbnail[0]?.url);
    } else if (thumbnail && thumbnail?.length && !thumbnail[0]?.url) {
      setIsBroken(false);
    } else if (thumbnail && !thumbnail?.length) {
      setIsBroken(true);
    }
  }, [thumbnail]);

  return (
    <Button
      loading={loading}
      variant="secondary"
      // onKeyPress={e => e.key === 'Enter' && handleSubmit()}
      onClick={isBroken ? showBrokenToast : OnProcessClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}

export default ProcessButton;
