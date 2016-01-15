import ActionTypes from '../consts/ActionTypes';
import * as ModalActionCreators from './modal';
import * as UserActionCreators from './user';
import {isAuthorized} from '../lib/geo';

export function open(target, closable = true) {
  return (dispatch, getState, actionDispatcher) => {

    return async () => {
      let authorized = true;
      if (target === 'showSignup') {
        try {
          authorized = await isAuthorized();
        } catch (err) {
          console.error('showSingupLock error requesting /auth/geo ', err);
        }
      }

      if (!authorized) {
        return actionDispatcher(ModalActionCreators.open('geoWall'));
      }

      return {
        type: ActionTypes.Modal.open,
        target,
        closable
      };
    }
  }
}

export function close() {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(false));
    return {
      type: ActionTypes.Modal.close,
      target: null
    };
  }
}
