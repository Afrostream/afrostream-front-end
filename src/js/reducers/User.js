import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import _ from 'lodash'
const initialState = Immutable.fromJS({
  'user': null,
  'subscriptionCancelled': false
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

  [ActionTypes.User.getFavoritesMovies](state, { res }) {
    const data = res.body;
    return state.merge({
      ['favorites/movies']: data
    });
  },

  [ActionTypes.User.setFavoriteMovies](state, { res }) {
    const data = res.body;
    return state.merge({
      ['favorites/movies']: [data]
    });
  },

  [ActionTypes.User.logOut](state, { }) {
    return state.merge({
      ['user']: null
    });
  }
});
