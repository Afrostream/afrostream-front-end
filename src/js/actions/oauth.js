import ActionTypes from '../consts/ActionTypes';

export function login(form) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.OAuth.login,
      res: await api(`/auth`, 'POST', form)
    });
  };
}

export function facebook() {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.OAuth.login,
      res: await api(`/auth/facebook`, 'GET')
    });
  };
}
