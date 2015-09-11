import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../actions/user';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import Redirect from './Redirect/Redirect';
import AfrostreamMonthlyMessage from './Welcome/AfrostreamMonthlyMessage';
import Spinner from './Spinner/Spinner';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

@connect(({ User }) => ({User})) class HomePage extends React.Component {

  getQueryString(field, url) {
    if (canUseDOM) {
      let href = url ? url : window.location.href;
      let reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
      let string = reg.exec(href);
      return string ? string[1] : null;
    }
    return null;
  }

  logout() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.logOut());
  }

  render() {
    const { props: { User ,children} } = this;
    const token = User.get('token');
    const user = User.get('user');
    let paymentStatus = this.getQueryString('payment_success');

    if (token) {
      if (!user) {
        debugger;
        console.log('*** passing by spinner ***');
        return (<Spinner />);
      }
      else if (!user.get('planCode') && paymentStatus !== 'true') {
        debugger;
        console.log('*** passing by redirect ***');
        return (<Redirect />)
      }
      else if (!user.get('planCode') && paymentStatus === 'true') {
        debugger;
        //return (<Redirect />)
        console.log('*** passing by logout ***');
        this::logout;
      }
      else if (user.get('planCode') === 'afrostreammonthly') {
        debugger;
        console.log('*** passing by monthly message ***');
        return ( <AfrostreamMonthlyMessage />)
      }
      else {
        debugger;
        console.log('*** passing by browse ***');
        return (<div className="row-fluid">{children ? children : <BrowsePage/>}</div>)
      }
    } else {
      debugger;
      console.log('*** passing by welcomepage ***');
      return (<WelcomePage />);
    }
  }

}

export default HomePage;
