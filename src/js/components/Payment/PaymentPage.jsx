import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import * as EventActionCreators from '../../actions/event';
import * as IntercomActionCreators from '../../actions/intercom';
import { prepareRoute,analytics } from '../../decorators';
import config from '../../../../config';
import SelectPlan from './SelectPlan';
import WelcomePage from '../Welcome/WelcomePage';

if (process.env.BROWSER) {
  require('./PaymentPage.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(true))
  ];
})
@analytics()
@connect(({ Intercom,User }) => ({Intercom, User}))
class PaymentPage extends React.Component {

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

  componentWillUnmount() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(IntercomActionCreators.removeIntercom());
  }

  render() {
    const { props: { User, children} } = this;

    const user = User.get('user');

    if (!user) {
      return <WelcomePage/>
    }

    if (children) {
      return children;
    }
    else {
      return (<SelectPlan/>)
    }
  }
}

export default PaymentPage;
