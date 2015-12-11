import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import PaymentPage from './Payment/PaymentPage';
import PaymentSuccess from './Payment/PaymentSuccess';
import Spinner from './Spinner/Spinner';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

@connect(({ User }) => ({User}))
class HomePage extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidUpdate() {
    this.validateState()
  }

  componentDidMount() {
    this.validateState()
  }

  validateState() {
    const { props: { User } } = this;
    const user = User.get('user');
    if (user) {
      let planCode = user.get('planCode');
      if (!planCode) {
        this.context.router.transitionTo('/select-plan');
      }
    }
  }

  render() {
    const { props: { User ,children} } = this;
    const token = User.get('token');
    const pending = User.get('pending');
    const user = User.get('user');
    let isPending = Boolean(token || pending);
    if (user) {
      if (children) {
        return children;
      }
      else {
        return (<BrowsePage/>)
      }
    } else {
      return (<WelcomePage spinner={isPending}/>);
    }
  }
}

export default HomePage;
