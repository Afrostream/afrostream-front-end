import React from 'react';
import { connect } from 'react-redux';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import AfrostreamMonthlyMessage from './Welcome/AfrostreamMonthlyMessage';
import PaymentPage from './Payment/PaymentPage';
import Spinner from './Spinner/Spinner';

@connect(({ User }) => ({User})) class HomePage extends React.Component {
  render() {
    const { props: { User ,children} } = this;
    const token = User.get('token');
    const user = User.get('user');

    if (token) {
      if (!user) {
        return (<Spinner />);
      }
      else if (!user.get('planCode')) {
        var afro_token = user.get('afro_token');
        var email = user.get('email');

        //return ( <PaymentPage />)
        window.location.href= "/payment?email=" + email + "&afroToken=" + token + "&afro_token=" + afro_token;
      }
      else if (user.get('planCode') === 'afrostreammonthly') {
        return ( <AfrostreamMonthlyMessage />)
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
      return (<WelcomePage />);
    }
  }

}

export default HomePage;
