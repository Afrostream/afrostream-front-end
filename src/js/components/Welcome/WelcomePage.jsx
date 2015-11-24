import React from 'react';
import { prepareRoute } from '../../decorators';
import WelcomeHeader from './WelcomeComponents/WelcomeHeader';
import Devices from './WelcomeComponents/Devices';
import PricingTable from './WelcomeComponents/PricingTable';
import * as EventActionCreators from '../../actions/event';

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(EventActionCreators.pinHeader(false))
    ];
}) class WelcomePage extends React.Component {

  render() {
    return (
      <div>
        <WelcomeHeader />
        <Devices />
        <PricingTable />
      </div>
    );
  }
}

export default WelcomePage;
