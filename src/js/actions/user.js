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

/**
 * Get favorites movies/episodes for user
 * @param type
 * @returns {Function}
 */
export function getFavorites(type = 'movies') {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().OAuth.get('token');
    const refreshToken = getState().OAuth.get('refreshToken');
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
      res: await api(`/api/users/${user.get('_id')}/favorites${capitType}`, 'GET', {}, token, refreshToken)
    });
  };
}

export function setFavorites(type, active, id) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().OAuth.get('token');
    const refreshToken = getState().OAuth.get('refreshToken');
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
        dataFav = await api(`/api/users/${user.get('_id')}/favorites${capitType}`, 'POST', {_id: id}, token, refreshToken);
      } else {
        dataFav = await api(`/api/users/${user.get('_id')}/favorites${capitType}/${id}`, 'DELETE', {}, token, refreshToken);
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
