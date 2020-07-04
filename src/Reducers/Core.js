import _ from 'lodash';
import { constants } from '@Actions/Core';

const initialState = {
  resources: []
}

const reducer = {
  [constants.SET_UPLOADS]: (state, { resources }) => ({ ...state, resources }),
};

export default (state=initialState, action) => {
  return action.type in reducer ?
    reducer[action.type]({ ...state }, action) : state;
}
