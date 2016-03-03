import ActionTypes from '../consts/ActionTypes';
import crypto from 'crypto';
import * as ModalActionCreators from './modal';
import * as OAuthActionCreators from './oauth';
import * as RecoActionCreators from './reco';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../config/client';
import { pushState } from 'redux-router';
import _ from 'lodash';
import {isAuthorized} from '../lib/geo';

const mergeProfile = function (data, getState, actionDispatcher) {

  const token = getState().OAuth.get('token');
  const donePath = getState().Modal.get('donePath');
  const coupon = getState().Coupon.get('coupon');

  if (!token) {
    return data;
  }

  return async api => {
    actionDispatcher(pendingUser(true));
    try {
      const userInfos = await api(`/api/users/me`, 'GET', {});
      const userMerged = userInfos.body || {};

      userMerged.user_id = userMerged._id || userMerged.user_id;

      if (userMerged) {
        let planCode = userMerged.planCode;
        if (!planCode && !coupon.get('coupon')) {
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
 * Get subscriptions list for user
 * @returns {Function}
 */
export function getSubscriptions() {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    if (!user) {
      return {
        type: ActionTypes.User.getSubscriptions,
        res: null
      }
    }
    return async api => {
      return {
        type: ActionTypes.User.getSubscriptions,
        res: await api(`/api/subscriptions/status`)
      };
    };
  };
}

export function gocardless(planCode, planLabel) {
  return (dispatch, getState, actionDispatcher) => {
    const token = getState().OAuth.get('token');
    let url = `/billing/gocardless/${planCode}?access_token=${token.get('accessToken')}&title=${planLabel}`;
    let width = 800;
    let height = 650;
    let top = (window.outerHeight - height) / 2;
    let left = (window.outerWidth - width) / 2;
    return async () => {
      return await new Promise((resolve, reject) => {
        const redirectFlowPopup = window.open(encodeURI(url), 'gocardless', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
        redirectFlowPopup.onbeforeunload = function () {
          try {
            let redirectFlows = localStorage.getItem('gocardlessRedirectFlow');
            let redirectFlowsData = JSON.parse(redirectFlows);
            localStorage.removeItem('gocardlessRedirectFlow');
            if (redirectFlowsData) {
              resolve(redirectFlowsData);
            } else {
              throw new Error('get gocardless data redirect impossible');
            }
          } catch (err) {
            reject(err);
          }
        }
      });
    };
  };
}
/**
 * Subscribe to afrostream plan
 * @param data
 * @returns {Function}
 */
export function subscribe(data, isGift = false) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.User.subscribe,
      res: await api(`/api/billings/${isGift ? 'gifts' : 'subscriptions'}`, 'POST', data),
      isGift
    });
  };
}

export function cancelSubscription(subscription) {
  return (dispatch, getState) => {
    let uuid = subscription.get('subscriptionBillingUuid');
    return async api => ({
      type: ActionTypes.User.cancelSubscription,
      res: await api(`/api/billings/subscriptions/${uuid}/cancel`, 'PUT', {})
    });
  };
}

/**
 * Get history movies/episodes for user
 * @returns {Function}
 */
export function getHistory() {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().OAuth.get('token');
    const refreshToken = getState().OAuth.get('refreshToken');
    if (!user) {
      return {
        type: ActionTypes.User.getHistory,
        res: null
      }
    }

    return async api => ({
      type: ActionTypes.User.getHistory,
      res: await api(`/api/users/${user.get('_id')}/history`, 'GET', {}, token, refreshToken)
    });
  };
}
/**
 * Get favorites movies/episodes for user
 * @param type
 * @returns {Function}
 */
export function getFavorites(type = 'movies') {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const capitType = _.capitalize(type);
    const returnTypeAction = ActionTypes.User[`getFavorites${capitType}`];
    if (!user) {
      return {
        type: returnTypeAction,
        res: null
      }
    }

    let readyFavorites = getState().User.get(`favorites/${type}`);
    if (readyFavorites) {
      console.log(`favorites ${type} already present in data store`);
      return {
        type: returnTypeAction,
        res: {
          body: readyFavorites.toJS()
        }
      };
    }

    return async api => ({
      type: returnTypeAction,
      res: await api(`/api/users/${user.get('_id')}/favorites${capitType}`, 'GET', {})
    });
  };
}

export function setFavorites(type, active, id) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const capitType = _.capitalize(type);
    const returnTypeAction = ActionTypes.User[`setFavorites${capitType}`];
    if (!user) {
      return {
        type: returnTypeAction,
        res: null,
        id
      }
    }
    return async api => {
      let list = getState().User.get(`favorites/${type}`);
      let dataFav;
      if (active) {
        dataFav = await api(`/api/users/${user.get('_id')}/favorites${capitType}`, 'POST', {_id: id});
      } else {
        dataFav = await api(`/api/users/${user.get('_id')}/favorites${capitType}/${id}`, 'DELETE', {});
      }

      let index = await list.findIndex((obj)=> {
        return obj.get('_id') == id;
      });

      let newList;
      if (index > -1) {
        newList = list.delete(index);
      } else {
        newList = list.push(dataFav.body);
      }

      return {
        type: returnTypeAction,
        res: newList.toJS()
      };
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
 * Get profile from afrostream
 * @returns {Function}
 */
export function getProfile() {
  return (dispatch, getState, actionDispatcher) => {
    return async () => {
      await actionDispatcher(OAuthActionCreators.getIdToken());
      const user = getState().User.get('user');
      return async () => {
        return mergeProfile({
          type: ActionTypes.User.getProfile,
          user: null
        }, getState, actionDispatcher);
      }
    };
  };
}
