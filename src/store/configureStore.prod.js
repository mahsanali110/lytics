import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import rootReducer from '../modules/rootReducer';
import rootSaga from '../modules/rootSaga';

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const history = createHistory();
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware, routerMiddleware(history))
  );
  sagaMiddleware.run(rootSaga);
  store.history = history;
  return store;
}
