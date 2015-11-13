import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import PaymentPage from './Payment/PaymentPage';
import PaymentForm from './Payment/PaymentForm';
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
    debugger;
    const { props: { User } } = this;
    const token = User.get('token');
    const user = User.get('user');
    var pathName = '';
    if (canUseDOM){
      pathName = document.location.pathname;
    }
    debugger;
    if (token) {
      if (!user) {
       if (pathName.indexOf('select-plan') > -1
         && pathName.indexOf('select-plan/afrostreamgift') == -1) {
         this.context.router.transitionTo('/');
       }
      }
    } else if (pathName.indexOf('select-plan')  > -1
        && pathName.indexOf('select-plan/afrostreamgift') == -1) {
      this.context.router.transitionTo('/');
    }
    debugger;

  }

  render() {

    var pathName = '';
    if (canUseDOM){
      pathName = document.location.pathname;
    }

    const { props: { User ,children} } = this;
    const token = User.get('token');
    const user = User.get('user');

    if (token) {
      if (!user) {
        return (<WelcomePage />);

      }
      else if (!user.get('planCode')) {
        return (<PaymentPage planType='normal' />);
      }
      else if (typeof user.get('newSubscription') !== 'undefined') {
        if (user.get('newSubscription') === true) {
          var pathName = '';
          if (canUseDOM){
            pathName = document.location.pathname;
          }
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
    } else if (pathName === '/select-plan/afrostreamgift/checkout') {
      debugger;
      return(<PaymentForm
        planName='afrostreamgift'
        unitAmountInCents='5999'
        startDate='' />);

    }  else {
      debugger;
      return (<WelcomePage />);
    }
  }

}

export default HomePage;
