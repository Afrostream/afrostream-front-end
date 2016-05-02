import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({
  userActive: true,
  pinHeader: false,
  showChat: false,
  sideBarToggled: false
});

export default createReducer(initialState, {

  [ActionTypes.Event.userActive](state, {active}) {
    return state.merge({
      ['userActive']: active
    });
  },
  [ActionTypes.Event.pinHeader](state, {pin}) {
    return state.merge({
      ['pinHeader']: pin
    });
  },
  [ActionTypes.Event.showChat](state, {show}) {
    return state.merge({
      ['showChat']: show
    });
  },
  [ActionTypes.Event.toggleSideBar](state, {}) {
    let toggled = state.get('sideBarToggled');
    return state.merge({
      ['sideBarToggled']: !toggled
    });
  }
});
