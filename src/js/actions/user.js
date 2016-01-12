import ActionTypes from '../consts/ActionTypes';
import * as ModalActionCreators from './modal';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../config/client';
import { pushState } from 'redux-router';
import _ from 'lodash';
import {isAuthorized} from '../lib/geo';

/**
 * Merge profile return by auth0 whith afrostream api user data
 * @param profile
 * @param data
 * @returns {Function}
 */
const logoutUser = function (actionDispatcher) {
  const storageId = config.apiClient.token;
  const storageRefreshId = config.apiClient.tokenRefresh;
  localStorage.removeItem(storageId);
  localStorage.removeItem(storageRefreshId);
  actionDispatcher(pushState(null, '/'))
};

const mergeProfile = function (data, getState, actionDispatcher) {

  const token = getState().OAuth.get('token');
  const refreshToken = getState().OAuth.get('refreshToken');

  if (!token) {
    return data;
  }

  return async api => {
    try {
      //FIXMEget user infos from afrostream api when get recurly api data has merge into user
      const userInfos = await api(`/api/users/me`, 'GET', {}, token, refreshToken);
      //TODO add subsrciptions status in user
      const userSubscriptions = {
        body: {}
      };//await api(`/subscriptions/status`, 'GET', {}, null, token, refreshToken);
      const userMerged = _.merge(userInfos.body || {}, userSubscriptions.body || {});

      userMerged.user_id = userMerged._id || userMerged.user_id;

      if (userMerged) {
        let planCode = userMerged.planCode;
        if (!planCode) {
          actionDispatcher(pushState(null, '/select-plan'));
        }
      }

      return _.merge(data, {
        user: userMerged
      });

    } catch (e) {
      console.log(e, 'remove user data');
      logoutUser(actionDispatcher);
      return data;
    }
  }

};

/**
 * Subscribe to afrostream plan
 * @param data
 * @returns {Function}
 */
export function subscribe(data, isGift = false) {
  return (dispatch, getState) => {
    const token = getState().OAuth.get('token');
    const refreshToken = getState().OAuth.get('refreshToken');
    return async api => ({
      type: ActionTypes.User.subscribe,
      res: await api(`/api/subscriptions/${isGift ? 'gift' : '' }`, 'POST', data, token, refreshToken),
      isGift
    });
  };
}

export function cancelSubscription() {
  return (dispatch, getState) => {
    const token = getState().OAuth.get('token');
    const refreshToken = getState().OAuth.get('refreshToken');
    return async api => ({
      type: ActionTypes.User.cancelSubscription,
      res: await api(`/api/subscriptions/cancel`, 'GET', {}, token, refreshToken)
    });
  };
}

/**
 * Logout user
 * @returns {Function}
 */
export function logOut() {
  return (dispatch, getState, actionDispatcher) => {
    logoutUser(actionDispatcher);
    return {
      type: ActionTypes.User.logOut
    };
  };
}

export function pendingUser(pending) {
  return {
    type: ActionTypes.User.pendingUser,
    pending
  }
};
/**
 * Get profile from auth0/afrostream
 * @returns {Function}
 */
export function getProfile() {
  return (dispatch, getState, actionDispatcher) => {
    const token = getState().OAuth.get('token');
    const user = getState().User.get('user');
    return async auth0 =>(
      await new Promise(
        (resolve) => {
          //If user alwready in app
          if (user) {
            if (user.get('planCode') === undefined) {
              return resolve(mergeProfile({
                type: ActionTypes.User.getProfile,
                user: null
              }, getState, actionDispatcher));
            } else {
              return resolve({
                type: ActionTypes.User.getProfile,
                user: user.toJS()
              });
            }
          }
          return resolve(mergeProfile({
            type: ActionTypes.User.getProfile,
            user: null
          }, getState, actionDispatcher));
        }
      )
    );

  };
}
