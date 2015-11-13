import ActionTypes from '../consts/ActionTypes';

export function create(email) {
  return (dispatch, getState) => {
    return async api => ({
      type: 'whatever',
      res: await api(`/waitingUsers/`, 'POST', { email: email })
    });
  };
}