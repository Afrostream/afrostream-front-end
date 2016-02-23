import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import _ from 'lodash'
const initialState = Immutable.fromJS({
  'user': null,
  'subscriptionCancelled': false,
  'favorites/episodes': null,
  'favorites/movies': null
});


export default createReducer(initialState, {

  [ActionTypes.User.subscribe](state, { res, isGift}) {
    const data = isGift ? {} : res.body;
    return state.merge({
      ['user']: _.merge(state.get('user').toJS(), data)
    });
  },

  [ActionTypes.User.cancelSubscription](state, { res }) {
    const data = res.body;
    return state.merge({
      ['user']: _.merge(state.get('user').toJS(), data),
      ['subscriptionCancelled']: true
    });
  },

  [ActionTypes.User.getProfile](state, { user}) {
    return state.merge({
      ['user']: user,
      ['pending']: false
    });
  },

  [ActionTypes.User.pendingUser](state, { pending }) {
    return state.merge({
      ['pending']: pending
    });
  },

  // #### RECOMMENDATIONS ####
  [ActionTypes.User.getRecommendations](state, { videoId, res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`reco/${videoId}`]: data
    });
  },

  [ActionTypes.User.rateVideo](state, { videoId, res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`video/${videoId}`]: data
    });
  },

  [ActionTypes.User.trackVideo](state, { videoId, res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`video/${videoId}`]: data
    });
  },

  [ActionTypes.User.getHistory](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`history`]: data
    });
  },

  [ActionTypes.User.getVideoTracking](state, { videoId, res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`video/${videoId}`]: data
    });
  },

  // #### FAVORITES ####
  [ActionTypes.User.getFavoritesMovies](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['favorites/movies']: data
    });
  },

  [ActionTypes.User.getFavoritesEpisodes](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['favorites/episodes']: data
    });
  },

  [ActionTypes.User.setFavoritesMovies](state, { res }) {
    if (!res) {
      return state;
    }
    return state.merge({
      ['favorites/movies']: res
    });
  },

  [ActionTypes.User.setFavoritesEpisodes](state, { res }) {
    if (!res) {
      return state;
    }
    return state.merge({
      ['favorites/episodes']: res
    });
  },
  // ####

  [ActionTypes.User.logOut](state, { }) {
    return state.merge({
      ['user']: null
    });
  }
});
