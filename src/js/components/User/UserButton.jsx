import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';
import * as OAuthActionCreators from '../../actions/oauth';
import * as UserActionCreators from '../../actions/user';
import * as EventActionCreators from '../../actions/event';
import { Link } from 'react-router';
import SearchInput from './../Search/SearchBox';
import FavoritesButton from './../Favorites/FavoritesButton';
import config from '../../../../config';

@connect(({ User, OAuth, Event }) => ({User, OAuth, Event}))
class UserButton extends React.Component {

  componentDidMount() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.getProfile());
  }

  logOut() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(OAuthActionCreators.logOut());
  }

  render() {
    const {
      props: {
        User,
        OAuth
        }
      } = this;

    const token = OAuth.get('token');
    const user = User.get('user');
    if (token) {
      if (user) {
        return (
          <ul className="nav navbar-nav navbar-right">
            <li className="btn-user pull-right">
              <a href="#" role="button" onClick={::this.toggleSideBar} id="userButton"><img src={user.get('picture')}
                                                                                            alt="50x50"
                                                                                            id="userButtonImg"
                                                                                            className="icon-user img-thumbnail"/></a>
            </li>
            <li className="pull-right">
              <SearchInput/>
            </li>
            <li className="pull-right">
              <FavoritesButton/>
            </li>
          </ul>
        );
      }
      else {
        return this.getLoginState();
      }
    } else {
      return this.getLoginState();
    }
  }

  getLoginState() {
    return (
      <div className="nav navbar-nav navbar-right">
        <button type="button" className="btn btn-login btn-default pull-right" onClick={::this.showLock}>connexion
        </button>
      </div>);
  }

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(ModalActionCreators.open('showSignin'));
  }

  toggleSideBar() {
    const {
      props: {
        dispatch,Event
        }
      } = this;

    dispatch(EventActionCreators.toggleSideBar());
  }

}

export default UserButton;
