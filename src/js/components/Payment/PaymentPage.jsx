import React from 'react';
import SelectPlan from './SelectPlan';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import * as EventActionCreators from '../../actions/event';
import * as UserActionCreators from '../../actions/user';
import { prepareRoute } from '../../decorators';
if (process.env.BROWSER) {
  require('./PaymentPage.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(UserActionCreators.secureRoute()),
      store.dispatch(EventActionCreators.pinHeader(true))
    ];
}) class PaymentPage extends React.Component {

  render() {
    return (<SelectPlan />);
  }
}

export default PaymentPage;
