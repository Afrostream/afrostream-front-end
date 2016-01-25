import ActionTypes from '../consts/ActionTypes';
import crypto from 'crypto';
import * as ModalActionCreators from './modal';
import * as OAuthActionCreators from './oauth';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../config/client';
import { pushState } from 'redux-router';
import _ from 'lodash';
import {isAuthorized} from '../lib/geo';

const mergeProfile = function (data, getState, actionDispatcher) {

  const token = getState().OAuth.get('token');
  const donePath = getState().Modal.get('donePath');
  const refreshToken = getState().OAuth.get('refreshToken');

  if (!token) {
    return data;
  }

  return async api => {
    actionDispatcher(pendingUser(true));
    try {
      //FIXMEget user infos from afrostream api when get recurly api data has merge into user
      const userInfos = await api(`/api/users/me`, 'GET', {}, token, refreshToken);
      //TODO add subsrciptions status in user
      const userSubscriptions = {
        body: {}
      };
      //const userSubscriptions = await api(`/api/subscriptions/status`, 'GET', {}, token, refreshToken);
      const userMerged = _.merge(userInfos.body || {}, userSubscriptions.body || {});

      userMerged.user_id = userMerged._id || userMerged.user_id;

      if (userMerged) {
        let planCode = userMerged.planCode;
        if (!planCode) {
          actionDispatcher(pushState(null, donePath ? donePath : '/select-plan'));
        }
      }

      if (userMerged.facebook) {
        userMerged.picture = `http://graph.facebook.com/${userMerged.facebook.id}/picture`;
      } else {
        userMerged.picture = `/avatar/${userMerged.email}`;
      }

      if (donePath) {
        actionDispatcher(pushState(null, donePath));
      }

      return _.merge(data, {
        user: userMerged
      });

    } catch (e) {
      console.log(e, 'remove user data');
      actionDispatcher(OAuthActionCreators.logOut());
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

export function pendingUser(pending) {
  return {
    type: ActionTypes.User.pendingUser,
    pending
  }
};
/**
 * Get profile from afrostream
 * @returns {Function}
 */
export function getProfile() {
  return (dispatch, getState, actionDispatcher) => {
    return async () => {
      await actionDispatcher(OAuthActionCreators.getIdToken());

      const token = getState().OAuth.get('token');
      const user = getState().User.get('user');
      return async () => {
        //If user alwready in app
        if (user) {
          return {
            type: ActionTypes.User.getProfile,
            user: user.toJS()
          };
        }
        return mergeProfile({
          type: ActionTypes.User.getProfile,
          user: null
        }, getState, actionDispatcher);
      }
    };
  };
}
