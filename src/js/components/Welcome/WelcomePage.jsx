import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import config from '../../../../config/client';
import WelcomeHeader from './WelcomeComponents/WelcomeHeader';
import Devices from './WelcomeComponents/Devices';
import PricingTable from './WelcomeComponents/PricingTable';
import Partners from './WelcomeComponents/Partners';
import Press from './WelcomeComponents/Press';
import WelcomeFooter from './WelcomeComponents/WelcomeFooter';

class WelcomePage extends React.Component {

  render() {

    return (
      <div>
        <WelcomeHeader />
        <Devices />
        <PricingTable />
        <Partners />
        <Press />
        {/*<WelcomeFooter />*/}
      </div>
    );
  }
}

export default WelcomePage;
