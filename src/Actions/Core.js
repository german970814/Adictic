import _ from 'lodash';

const _constants = ['SET_UPLOADS'];
export const constants = _.zipObject(_constants, _constants);

/**
 * Set the uploads in state
 * 
 * @param {Array|Object} resource The resources to be setted
 */
export const setUploads = (resources) => ({
  type: constants.SET_UPLOADS,
  resources: _.isArray(resources) ? resources : [ resources ],
});
