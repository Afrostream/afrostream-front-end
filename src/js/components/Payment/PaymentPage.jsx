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

  /**
   * Get the value of a querystring
   * @param  {String} field The field to get the value of
   * @param  {String} url   The URL to get the value from (optional)
   * @return {String}       The field value
   */
  getQueryString(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
  }

  render() {

    //localStorage.setItem('afroToken', this.getQueryString('afroToken'));
    //localStorage.setItem('afro_token', this.getQueryString('afro_token'));
    localStorage.setItem('johnarchHere', 'yoAdrian');

    return (<SelectPlan />);
  }
}

export default PaymentPage;
