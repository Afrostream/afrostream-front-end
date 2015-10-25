import React from 'react';
import SelectPlan from './SelectPlan';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import * as EventActionCreators from '../../actions/event';
import { prepareRoute } from '../../decorators';
if (process.env.BROWSER) {
  require('./PaymentPage.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(EventActionCreators.pinHeader(true))
    ];
}) class PaymentPage extends React.Component {

  componentDidMount() {
    setTimeout(function() {
      document.getElementById('intercom-container').style.display = 'block';
    }, 3000);
  }

  render() {

    return (<div className="row-fluid"><SelectPlan /></div>);
  }
}

export default PaymentPage;
