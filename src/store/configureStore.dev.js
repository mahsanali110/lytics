import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../modules/rootReducer';
import rootSaga from '../modules/rootSaga';

export const history = createBrowserHistory();

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [routerMiddleware(history), sagaMiddleware];

  const store = createStore(
    rootReducer(history),
    compose(
      applyMiddleware(...middleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;

// import { createBrowserHistory } from 'history'
// import { applyMiddleware, compose, createStore } from 'redux'
// import { routerMiddleware } from 'connected-react-router'
// import createSagaMiddleware from 'redux-saga';
// import rootReducer from '../modules/rootReducer';
// import rootSaga from '../modules/rootSaga';

// export const history = createBrowserHistory();

// const sagaMiddleware = createSagaMiddleware();

// const initialState = {};
// const enhancers = [];
// const middleware = [routerMiddleware(history), sagaMiddleware];
// /*
// if (process.env.NODE_ENV === 'development') {
//   const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
//   if (typeof devToolsExtension === 'function') {
//     enhancers.push(devToolsExtension());
//   }
// }*/

// const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

// const store = createStore(connectRouter(history)(rootReducer), initialState, composedEnhancers);

// sagaMiddleware.run(rootSaga);

// export default store;
