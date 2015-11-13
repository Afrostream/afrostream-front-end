import ActionTypes from '../consts/ActionTypes';

export function openGeoWall() {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Modal.target,
      target: 'geoWall'
    };
  };
}

export function close() {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Modal.target,
      target: null
    };
  };
}