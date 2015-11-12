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

  state = {
    isGift: 0
  }

  componentDidMount() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(IntercomActionCreators.createIntercom());
  }

  componentWillMount() {
    var pathName = '/selectPlan';
    if (canUseDOM) {
      selectPlanGa.initialize(config.google.analyticsKey, {debug: true});
      selectPlanGa.pageview('/select-plan');
      if (document.location.pathname === '/gift') {
        pathName = '/gift';
        this.setState({isGift: 1});
      } else {
        this.setState({isGift: 0});
        this.context.router.transitionTo('/select-plan');
      }
    }
  }

  render() {
    debugger;
    return (<SelectPlan isGift={this.state.isGift} />);
  }
}

export default PaymentPage;
