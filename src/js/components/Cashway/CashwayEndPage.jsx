import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import * as EventActionCreators from '../../actions/event'
import * as ModalActionCreators from '../../actions/modal'
import * as BillingActionCreators from '../../actions/billing'
import {
  FormattedMessage,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./CashwayEndPage.less')
}

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(BillingActionCreators.getSubscriptions())
  ])
})
@connect(({User, Billing}) => ({User, Billing}))
class CashwayEndPage extends React.Component {

  constructor (props) {
    super(props)
  }

  static contextTypes = {
    location: PropTypes.object.isRequired
  }


  showPlan (e) {
    e.stopPropagation()
    e.preventDefault()

    const {
      props: {
        dispatch
      }
    } = this

    dispatch(ModalActionCreators.open({target: 'cashway'}))
  }

  render () {

    const {
      props: {
        Billing
      }
    } = this

    const subscriptionsList = Billing.get('subscriptions')

    if (!subscriptionsList) {
      return <div />
    }

    const cashwaySubscription = subscriptionsList.find((subscription) => {
      return subscription.get('provider').get('providerName') === 'cashway' && subscription.get('subStatus') === 'future'
    })

    if (!cashwaySubscription) {
      return <div />
    }

    const subOpts = cashwaySubscription.get('subOpts')

    return (
      <div className="cashway-end-page">
        <div className="container-fluid brand-bg">
          <section className="cashway-info">
            <div className="row-fluid">
              <div className="col-xs-12 col-md-4">
                <img className="img-responsive img-center"
                     src="/images/payment/cashway/step-1.jpg" alt="code_bare_ccm"/>
                <div className="row-fluid">
                  <div className="col-md-12">
                    <div className="container_title">
                      <FormattedMessage id={`payment.cashway.recupCode`}/>
                      <a target="_blank" href={subOpts.get('couponCodeUrl')}>
                        <FormattedMessage id={`payment.cashway.recupCodeAction`}/>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-xs-12 col-md-4">
                <img className="img-responsive img-center"
                     src="/images/payment/cashway/step-4.jpg" alt="money_ccm"/>
                <div className="row-fluid">
                  <div className="col-md-12">
                    <div className="container_title">
                      <FormattedMessage id={`payment.cashway.rdv`}/>
                      <a href="#" onClick={::this.showPlan}>
                        <FormattedMessage id={`payment.cashway.showMap`}/>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-xs-12 col-md-4">
                <img className="img-responsive img-center"
                     src="/images/payment/cashway/step-2.jpg" alt="validate_ccm"/>
                <div className="row-fluid">
                  <div className="col-md-12">
                    <div className="container_title">
                      <FormattedMessage id={`payment.cashway.partner`}/>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}
export default CashwayEndPage
