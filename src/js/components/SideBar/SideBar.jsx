import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import * as EventActionCreators from '../../actions/event';
import { Link } from 'react-router';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./SideBar.less');
}

@connect(({ User,Event }) => ({User, Event})) class SideBar extends React.Component {

  componentDidMount() {
    $(document).on('mouseup', this.toggleSideBar.bind(this));
  }

  componentWillUnMount() {
    $(document).off('mouseup', this.toggleSideBar.bind(this));
  }

  toggleSideBar() {
    const {
      props: {
        dispatch,
        Event
        }
      } = this;

    const toggled = Event.get('sideBarToggled');
    if (toggled) {
      dispatch(EventActionCreators.toggleSideBar());
    }
  }

  render() {

    return (
      <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
          <li className="sidebar-brand">
            <a href="#">
              Menu
            </a>
          </li>
          <li><Link to="/compte">Mon compte</Link></li>
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
