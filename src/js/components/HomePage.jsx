import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import { prepareRoute } from '../decorators';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import * as CategoryActionCreators from '../actions/category';

@prepareRoute(async function ({store}) {
  return await * [
    store.dispatch(CategoryActionCreators.getAllSpots()),
    store.dispatch(CategoryActionCreators.getMeaList())
  ];
})
@connect(({User}) => ({User}))
class HomePage extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentWillReceiveProps () {
    this.checkAuth()
  }

  componentDidMount () {
    this.checkAuth()
  }

  checkAuth () {
    const {
      context : {location, history},
      props: {User}
    } = this;

    const user = User.get('user');
    if (user) {
      let isCash = history.isActive('cash');
      let planCode = user.get('planCode');
      let subscriptionsStatus = user.get('subscriptionsStatus');
      let status = subscriptionsStatus ? subscriptionsStatus.get('status') : null;
      if ((!planCode) && (location.pathname !== '/compte')) {
        let donePath = `${isCash ? '/cash' : ''}/select-plan`;
        if (status && status != 'active') {
          donePath = `${donePath}/none/${status}`;
        }
        history.pushState(null, donePath);
      }
    }
  }

  renderContent () {
    const {props: {User, children}} = this;
    const pending = User.get('pending');
    const user = User.get('user');
    let isPending = Boolean(pending);
    if (user) {
      if (children) {
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
    return (
      this.renderContent()
    );
  }
}

export default HomePage;
