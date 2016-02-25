import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import { prepareRoute } from '../decorators';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import Spinner from './Spinner/Spinner';
import * as CategoryActionCreators from '../actions/category';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(CategoryActionCreators.getAllSpots()),
    store.dispatch(CategoryActionCreators.getMeaList())
  ];
})
@connect(({ User }) => ({User}))
class HomePage extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentWillReceiveProps() {
    this.checkAuth()
  }

  componentDidMount() {
    this.checkAuth()
  }

  checkAuth() {
    const { props: { User } } = this;
    const user = User.get('user');
    if (user) {
      let planCode = user.get('planCode');
      if (!planCode) {
        this.context.history.pushState(null, '/select-plan');
      }
    }
  }

  renderChildren() {
    const { props: { children } } = this;
    return React.Children.map(children, (child) => {
      let path = this.props.location.pathname;
      let key = path.split('/')[1] || 'root';
      console.log('child', key);
      return React.cloneElement(child, {
        key
      });
    });
  }

  renderContent() {
    const { props: { User ,children} } = this;
    const pending = User.get('pending');
    const user = User.get('user');
    let isPending = Boolean(pending);
    if (user) {
      if (children) {
        //return this.renderChildren();
        return children;
      }
      else {
        return (<BrowsePage key="browse-page"/>)
      }
    } else {
      return (<WelcomePage spinner={isPending} {...this.props} key="welcome-page"/>);
    }
  }

  render() {
    //TODO FIX animation transition
    //return (
    //  <ReactCSSTransitionGroup transitionName="page-transition" transitionEnter={true} transitionLeave={true}
    //                           transitionEnterTimeout={3000} transitionLeaveTimeout={3000}>
    //    {this.renderContent()}
    //  </ReactCSSTransitionGroup>
    //);
    return (
      this.renderContent()
    );
  }
}

export default HomePage;
