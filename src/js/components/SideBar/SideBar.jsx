import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import * as EventActionCreators from '../../actions/event';
import { Link } from 'react-router';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./SideBar.less');
}

@connect(({ User }) => ({User})) class SideBar extends React.Component {

  render() {

    return (
      <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
          <li className="sidebar-brand">
            <a href="#">
              Menu
            </a>
          </li>
          <li><Link to="/compte" onClick={::this.close}>Mon compte</Link></li>
          <li role="separator" className="divider"></li>
          <li><a href="#" onClick={::this.logout}>Se deconnecter</a></li>
        </ul>
      </div>
    );
  }

  close() {
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

export default SideBar;
