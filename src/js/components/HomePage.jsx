import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import PaymentPage from './Payment/PaymentPage';
import PaymentSuccess from './Payment/PaymentSuccess';
import Spinner from './Spinner/Spinner';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

@connect(({ User }) => ({User})) class HomePage extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    document.getElementsByTagName('BODY')[0].scrollTop = 0;
  }

  componentWillMount(){
    const { props: { User } } = this;
    const token = User.get('token');
    const user = User.get('user');
    var pathName = '';
    if (canUseDOM){
      pathName = document.location.pathname;
    }

    if (token) {
      if (!user) {
       if (pathName.indexOf('select-plan') > -1) {
         this.context.router.transitionTo('/');
       }
      }
    } else if (pathName.indexOf('select-plan')  > -1) {
      this.context.router.transitionTo('/');
    }

  }

  render() {
    const { props: { User ,children} } = this;
    const token = User.get('token');
    const user = User.get('user');

    var pathName = '';
    if (canUseDOM) {
      pathName = document.location.pathname;
    }

    if (token) {
      if (!user) {
        return (<WelcomePage />);
      }
      else if (!user.get('planCode')) {
        return (<PaymentPage />);
      }
      else if (typeof user.get('newSubscription') !== 'undefined') {
        if (user.get('newSubscription') === true) {
          return (<PaymentSuccess pathName={pathName} />);
        }
      }
      else {
        if (children) {
          return children;
        }
        else {
          return (<BrowsePage/>)
        }
      }
    } else if (pathName === '/AFROLOVE') {
      return (<WelcomePage promoCode={pathName} />);
    } else {
      return (<WelcomePage />);
    }
  }

}

export default HomePage;
