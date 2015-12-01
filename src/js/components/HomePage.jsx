import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import PaymentPage from './Payment/PaymentPage';
import PaymentSuccess from './Payment/PaymentSuccess';
import Spinner from './Spinner/Spinner';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

@connect(({ User }) => ({User}))
class HomePage extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { props: { User } } = this;
    const token = User.get('token');
    const user = User.get('user');
    let pathName = this.context.router.state.location.pathname;

    if (!token || !user) {
      if (pathName.indexOf('select-plan') > -1) {
        this.context.router.transitionTo('/');
      }
    }

  }

  render() {
    const { props: { User ,children} } = this;
    const token = User.get('token');
    const user = User.get('user');
    let pathName = this.context.router.state.location.pathname.split('/').join('');

    if (user) {
      if (!user.get('planCode')) {
        return (<PaymentPage />);
      }
      else {
        if (children) {
          return children;
        }
        else {
          return (<BrowsePage/>)
        }
      }
    } else {
      return (<WelcomePage spinner={token} promoCode={pathName}/>);
    }
  }
}

export default HomePage;
