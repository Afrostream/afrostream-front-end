import React, { PropTypes }  from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../decorators'
import WelcomePage from './Welcome/WelcomePage'
import BrowsePage from './Browse/BrowsePage'
import * as CategoryActionCreators from '../actions/category'
import { withRouter } from 'react-router'

@prepareRoute(async function ({store}) {
  return await * [
    store.dispatch(CategoryActionCreators.getAllSpots()),
    store.dispatch(CategoryActionCreators.getMeaList())
  ];
})
@connect(({User}) => ({User}))
class HomePage extends React.Component {


  componentWillReceiveProps () {
    this.checkAuth()
  }

  componentDidMount () {
    this.checkAuth()
  }

  checkAuth () {
    const {
      props: {location, history, router, User}
    } = this;

    const user = User.get('user');
    if (user) {
      let isCash = router.isActive('cash');
      let planCode = user.get('planCode');
      let subscriptionsStatus = user.get('subscriptionsStatus');
      let status = subscriptionsStatus ? subscriptionsStatus.get('status') : null;
      if ((!planCode) && (location.pathname !== '/compte')) {
        let donePath = `${isCash ? '/cash' : ''}/select-plan`;
        if (status && status !== 'active') {
          donePath = `${donePath}/none/${status}`;
        }
        history.pushState(null, donePath);
      }
    }
  }

  renderChildren () {
    const {props: {children, location}} = this;
    return React.Children.map(children, (child) => {
      let path = location.pathname;
      let key = path.split('/')[1] || 'root';
      return React.cloneElement(child, {
        key
      });
    });
  }

  renderContent () {
    const {props: {User, children}} = this;
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

  render () {
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


HomePage.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
};

export default withRouter(HomePage)
