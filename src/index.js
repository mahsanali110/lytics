import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.min.css';
import './theme/base.scss';

import configureStore, { history } from './store';
import App from './components/App';
import { Popup } from 'components/Common';
import * as serviceWorker from './serviceWorker';

const store = configureStore({});

ReactDOM.render(
  <>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <StrictMode>
          {' '}
          <App />
        </StrictMode>

        <Popup />
      </ConnectedRouter>
    </Provider>
  </>,
  /* global document */
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
