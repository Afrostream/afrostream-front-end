import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { prepareRoute } from '../../decorators';
import * as EventActionCreators from '../../actions/event';
import * as IntercomActionCreators from '../../actions/intercom';
import * as BillingActionCreators from '../../actions/billing';
import WelcomePage from '../Welcome/WelcomePage';
import SelectPlan from './SelectPlan';

if (process.env.BROWSER) {
  require('./PaymentPage.less');
}

@prepareRoute(async function ({store}) {
  let isCash = store.router.isActive('cash');
  return await * [
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(BillingActionCreators.getInternalplans(isCash ? 'cashway' : 'common'))
  ];
})
@connect(({Intercom, User}) => ({Intercom, User}))
class PaymentPage extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  componentDidMount () {
    const {
      props: {
        dispatch
      }
    } = this;

    dispatch(IntercomActionCreators.createIntercom());
  }

  componentWillUnmount () {
    const {
      props: {
        dispatch
      }
    } = this;
    dispatch(IntercomActionCreators.removeIntercom());
  }

  render () {
    const {props: {User, children}} = this;

    const user = User.get('user');

    if (!user) {
      return <WelcomePage {...this.props}/>
    }

    return (
      <div className="row-fluid brand-bg">
        <div className="container brand-bg">
          {children ? children : <SelectPlan/>}
        </div>
      </div>
    )
  }
}

export default PaymentPage;
