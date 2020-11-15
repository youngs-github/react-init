import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { testReducer } from '../view/redux/store';

export default createStore(combineReducers({ testState: testReducer }), applyMiddleware(thunk));
