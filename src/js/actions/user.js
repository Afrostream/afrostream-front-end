import ActionTypes from '../consts/ActionTypes';
import * as OAuthActionCreators from './oauth';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { pushState, isActive } from 'redux-router';
import _ from 'lodash';

const mergeProfile = function (data, getState, actionDispatcher) {

  const token = getState().OAuth.get('token');
  const coupon = getState().Billing.get('coupon');
  let donePath = getState().Modal.get('donePath');

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
        let subscriptionsStatus = userMerged.subscriptionsStatus;
        let status = subscriptionsStatus.status;
        if ((!planCode && !coupon.get('coupon'))) {
          let isCash = isActive('cash');
          // donePath = donePath || `${isCash ? '/cash' : ''}/select-plan`;
          donePath = donePath || `${isCash ? '/cash' : ''}/select-plan`;
          if (status && status !== 'active') {
            donePath = `${donePath}/none/${status}`;
          }
          actionDispatcher(pushState(null, donePath));
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
 * Get history movies/episodes for user
 * @returns {Function}
 */
export function getHistory () {
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
export function getFavorites (type = 'movies') {
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

export function setFavorites (type, active, id) {
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

export function pendingUser (pending) {
  return {
    type: ActionTypes.User.pendingUser,
    pending
  }
};
/**
 * Get profile from afrostream
 * @returns {Function}
 */
export function getProfile () {
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
