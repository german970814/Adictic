import CoreReducer from './Core';
import { createStore, combineReducers } from 'redux';

const reducers = { core: CoreReducer };

export const store = createStore(combineReducers(reducers));
