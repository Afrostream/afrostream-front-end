import React, { PropTypes } from 'react';
import SelectPlan from './SelectPlan';
import { connect } from 'react-redux';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import * as EventActionCreators from '../../actions/event';
import * as IntercomActionCreators from '../../actions/intercom';
import { prepareRoute } from '../../decorators';
import config from '../../../../config';

if (canUseDOM) {
  var selectPlanGa = require('react-ga');
}

if (process.env.BROWSER) {
  require('./PaymentPage.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(EventActionCreators.pinHeader(true))
    ];
}) @connect(({ Intercom}) => ({Intercom})) class PaymentPage extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(IntercomActionCreators.createIntercom());
  }

  componentWillMount() {
    if (canUseDOM) {
      selectPlanGa.initialize(config.google.analyticsKey, {debug: true});
      selectPlanGa.pageview('/select-plan');
      this.context.router.transitionTo('/select-plan');
    }
  }

  render() {
    return (<SelectPlan />);
  }
}

export default PaymentPage;
