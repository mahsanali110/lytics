import React from 'react';
import { USERS_BASE_URL } from 'constants/config';

function useSSE(endPoint, successCallback, errorCallback) {
  const es = new EventSource(`${USERS_BASE_URL}/${endPoint}`);
  es.onmessage = successCallback;
  es.onerror = errorCallback;
  const closeConnection = () => {
    es.close();
  };

  return closeConnection;
}

export default useSSE;
