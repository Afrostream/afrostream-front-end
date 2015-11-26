import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import * as EventActionCreators from '../../actions/event';
import { Link } from 'react-router';
import SearchInput from './../Search/SearchBox';
import config from '../../../../config';

@connect(({ User }) => ({User})) class UserButton extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.createLock();
  }

  createLock() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(UserActionCreators.createLock());
    dispatch(UserActionCreators.getIdToken());
  }

  logOut() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(UserActionCreators.logOut());
    this.context.router.transitionTo('/');
  }

  render() {
    const {
      props: {
        User,
        dispatch
        }
      } = this;

    const token = User.get('token');
    const user = User.get('user');
    let hasFormule;
    let justSubscribed;


    if (token) {
      if (user) {

        if (typeof user.get('planCode') !== 'undefined') {
          hasFormule = user.get('planCode');
        }

        if (typeof user.get('newSubscription') !== 'undefined') {
          justSubscribed = user.get('newSubscription');
        }

        if (justSubscribed === true) {

          return (<div />);
        } else if (!hasFormule){
          return this.goToHomePage();
        } else {

          return (
            <ul className="nav navbar-nav navbar-right">
              <li>
                <SearchInput/>
              </li>
              <li className="btn-user pull-right">
                <a href="#" role="button" onClick={::this.toggleSideBar}><img src={user.get('picture')} alt="50x50"
                                                                              className="icon-user img-thumbnail"/></a>
              </li>
            </ul>
          );
        }
      }
      else {

        dispatch(UserActionCreators.getProfile());
        return this.getLoginState();
      }
    } else if ((this.context.router.state.location.pathname === '/AFROLOVE')
      || (this.context.router.state.location.pathname === '/AFROLOVE2')) {
      return(<div />);
      ;
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

  goToHomePage() {
    return (
      <div className="nav navbar-nav navbar-right">
        <button type="button" className="btn btn-login btn-default pull-right" onClick={::this.logOut}>accueil
        </button>
      </div>);
  }

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.showLock());
  }

  toggleSideBar() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(EventActionCreators.toggleSideBar());
  }

  logout() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.logOut());
  }
}

export default UserButton;
