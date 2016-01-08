import ActionTypes from '../consts/ActionTypes';

export function login(form) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.OAuth.login,
      res: await api(`/posts`, 'POST', form)
    });
  };
}
