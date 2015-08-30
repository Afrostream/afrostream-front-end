import React from 'react';
import SelectPlan from './SelectPlan';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (process.env.BROWSER) {
  require('./PaymentPage.less');
}

class PaymentPage extends React.Component {

  render() {

    return (
      <div className="row-fluid brand-bg">
        <div className="container brand-bg payment">
          <SelectPlan />
        </div>
      </div>
    );
  }
}

export default PaymentPage;
