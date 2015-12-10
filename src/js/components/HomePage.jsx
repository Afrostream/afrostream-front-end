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

  render() {
    const { props: { User ,children} } = this;
    const token = User.get('token');
    const user = User.get('user');

    if (user) {
      if (children) {
        return children;
      }
      else {
        return (<BrowsePage/>)
      }
    } else {
      return (<WelcomePage spinner={token}/>);
    }
  }
}

export default HomePage;
