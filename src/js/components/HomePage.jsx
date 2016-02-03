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
    store.dispatch(CategoryActionCreators.getAllSpots())
  ];
})
@connect(({ User }) => ({User}))
class HomePage extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired
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

  renderContent() {
    const { props: { User ,children} } = this;
    const pending = User.get('pending');
    const user = User.get('user');
    let isPending = Boolean(pending);
    if (user) {
      if (children) {
        return children;
      }
      else {
        return (<BrowsePage/>)
      }
    } else {
      return (<WelcomePage spinner={isPending} {...this.props}/>);
    }
  }

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="search" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        {this.renderContent()}
      </ReactCSSTransitionGroup>
    );
  }
}

export default HomePage;
