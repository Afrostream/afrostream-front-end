import ActionTypes from '../consts/ActionTypes';
import crypto from 'crypto';
import * as ModalActionCreators from './modal';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../config/client';
import { pushState } from 'redux-router';
import _ from 'lodash';
import {isAuthorized} from '../lib/geo';

const gravatar = function (email, options) {
  //check to make sure you gave us something
  var options = options || {},
    base,
    params = [];

  //set some defaults, just in case
  options = {
    size: options.size || '50',
    rating: options.rating || 'g',
    secure: options.secure || (location.protocol === 'https:'),
    backup: options.backup || ''
  };

  //setup the email address
  email = email.trim().toLowerCase();

  //determine which base to use
  base = options.secure ? 'https://secure.gravatar.com/avatar/' : 'http://www.gravatar.com/avatar/';

  //add the params
  if (options.rating) {
    params.push('r=' + options.rating)
  }
  if (options.backup) {
    params.push('d=' + encodeURIComponent(options.backup))
  }
  if (options.size) {
    params.push('s=' + options.size)
  }

  //now throw it all together
  return base + crypto.createHash('md5').update(email).digest('hex') + '?' + params.join('&');
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

      userMerged.picture = gravatar(userMerged.email);

      return _.merge(data, {
        user: userMerged
      });

    } catch (e) {
      console.log(e, 'remove user data');
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
