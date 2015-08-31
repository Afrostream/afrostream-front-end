import React from 'react';
import { connect } from 'react-redux';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import AfrostreamMonthlyMessage from './Welcome/AfrostreamMonthlyMessage';
import PaymentPage from './Payment/PaymentPage';

@connect(({ User }) => ({User})) class HomePage extends React.Component {
  render() {
    const { props: { User ,children} } = this;
    const token = User.get('token');
    const user = User.get('user');

    if (token) {
      if (!user) {
        return (<WelcomePage />);
      }
      else if (!user.get('planCode')) {
        return ( <PaymentPage />)
      }
      else if (user.get('planCode') === 'afrostreammonthly') {
        return ( <AfrostreamMonthlyMessage />)
      }
      else {
        return (<div className="row-fluid">{children ? children : <BrowsePage/>}</div>)
    }
  } else {
  return (<WelcomePage />);
}
}

}

export default HomePage;
