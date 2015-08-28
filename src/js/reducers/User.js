import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({
  'user': null,
  'token': null
});


export default createReducer(initialState, {

  [ActionTypes.User.subscribe](state, { userId,res }) {
    const data = res.body;
    console.log('ActionTypes.User.subscribe',data)
    return state.merge({
      ['user']: user
    });
  },

  [ActionTypes.User.getIdToken](state, { token }) {
    return state.merge({
      ['token']: token
    });
  },

  [ActionTypes.User.showLock](state, {user,token,refreshToken}) {
    return state.merge({
      ['user']: user,
      ['token']: token,
      ['refreshToken']: refreshToken
    });
  },

  [ActionTypes.User.getProfile](state, { user }) {
    console.log('ActionTypes.User.getProfile', user);
    return state.merge({
      ['user']: user
    });
  },

  [ActionTypes.User.createLock](state, { lock }) {
    return state.merge({
      ['lock']: lock
    });
  },

  [ActionTypes.User.logOut](state, { }) {
    return state.merge({
      ['user']: null,
      ['token']: null,
      ['refreshToken']: null
    });
  }
});
