import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import shallowEqual from 'react-pure-render/shallowEqual'
import classSet from 'classnames'
import config from '../../../../config'
import { getI18n } from '../../../../config/i18n'
import * as BillingActionCreators from '../../actions/billing'
import * as UserActionCreators from '../../actions/user'
import * as EventActionCreators from '../../actions/event'
import * as ModalActionCreators from '../../actions/modal'
import * as OAuthActionCreators from '../../actions/oauth'
import PaymentImages from './PaymentImages'
import Spinner from '../Spinner/Spinner'
import CashwayEndPage from '../Cashway/CashwayEndPage'
import PaymentSuccess from './PaymentSuccess'
import PaymentError from './PaymentError'
import PaymentMethod from './PaymentMethod'
import Query from 'dom-helpers/query'
import DomClass from 'dom-helpers/class'
import scriptLoader from '../../lib/script-loader'
import { withRouter } from 'react-router'
import _ from 'lodash'
import * as ReactFB from '../../lib/fbEvent'
import Q from 'q'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'

const {gocarlessApi, recurlyApi, stripeApi, braintreeApi} = config
if (process.env.BROWSER) {
  require('./PaymentForm.less')
}

@connect(({User, Billing, OAuth}) => ({User, Billing, OAuth}))
@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
class PaymentForm extends React.Component {

  constructor (props) {
    super(props)
  }

  state = {
    hasLib: true,
    subscriptionStatus: 0,
    loading: false,
    pageHeader: getI18n().payment.header
  }

  hasPlan () {

    const {
      props: {
        router,
        Billing,
        location,
        params: {planCode}
      }
    } = this

    let {query} = location

    let isCash = router.isActive('cash')

    let planCodes = Billing.get(`internalPlans/${isCash ? 'cashway' : (query && query.contextBillingUuid || 'common')}`)

    if (!planCodes) {
      return false
    }

    let plan = planCodes.find((plan) => {
      return planCode === plan.get('internalPlanUuid')
    })

    return plan
  }

  setupPlan () {
    let currentPlan = this.hasPlan()
    if (!currentPlan) {
      return
    }

    let internalPlanUuid = currentPlan.get('internalPlanUuid')
    this.setState({
      internalPlanUuid: internalPlanUuid,
      currentPlan: currentPlan
    })

    ReactFB.track({
      event: 'InitiateCheckout', params: {
        'content_name': internalPlanUuid,
        'value': currentPlan.get('amount')
      }
    })
  }

  componentDidMount () {
    this.setupPlan()
    this.attachTooltip()
  }

  componentDidUpdate () {
    this.attachTooltip()
  }

  attachTooltip () {
    if (this.refs.droitstip) {
      $(this.refs.droitstip).tooltip()
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      props: {
        Billing
      }
    } = this

    if (nextProps.isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      this.setState({
        hasLib: nextProps.isScriptLoadSucceed
      })
    }

    if (!shallowEqual(nextProps.Billing, Billing)) {
      this.setupPlan()
    }
  }

  renderUserForm () {

    const {
      props: {
        User
      }
    } = this

    const currentPlan = this.hasPlan()

    if (currentPlan && currentPlan.get('internalPlanUuid') === config.netsize.internalPlanUuid) {
      return
    }

    const user = User.get('user')
    let firstName = ''
    let lastName = ''
    if (user) {
      let userJs = user.toJS()
      firstName = userJs && userJs.facebook && userJs.facebook.first_name || userJs && userJs.first_name
      lastName = userJs && userJs.facebook && userJs.facebook.last_name || userJs && userJs.last_name
    }

    return (
      <div className="panel-group">
        <div className="panel">
          <div className="row no-padding">
            <div className="col-md-6">
              <TextField
                floatingLabelFixed={true}
                fullWidth={true}
                type="text"
                className="first-name"
                data-billing="first_name"
                ref="firstName"
                id="first_name"
                autoComplete="given-name"
                name="first-name"
                defaultValue={firstName}
                floatingLabelText={getI18n().payment.name} required
                disabled={this.state.disabledForm}/>
            </div>
            <div className="col-md-6">
              <TextField
                floatingLabelFixed={true}
                fullWidth={true}
                type="text"
                className="last-name"
                data-billing="last_name"
                ref="lastName"
                id="last_name"
                autoComplete="surname"
                name="last-name"
                defaultValue={lastName}
                floatingLabelText={getI18n().payment.lastName} required
                disabled={this.state.disabledForm}/>
            </div>
          </div>
        </div>
      </div>)
  }

  renderSubmit () {

    const {
      props: {
        dispatch,
        history,
      }
    } = this
    const currentPlan = this.state.currentPlan

    if (!currentPlan) {
      return
    }

    const internalPlanUuid = currentPlan.get('internalPlanUuid')

    let buttonLabel = getI18n().planCodes.action
    if (currentPlan && internalPlanUuid === config.netsize.internalPlanUuid) {
      buttonLabel = getI18n().planCodes.actionMobile
    }

    const inputChangeAction = {
      onClick: event => {
        event.preventDefault()
        //get InternalPlan
        dispatch(BillingActionCreators.getInternalplans({
          contextBillingUuid: 'common',
          passToken: true,
          reload: true,
          checkMobile: false
        })).then(()=> {
          history.push('/select-plan')
        })
      }
    }

    return (<div className="row">
        <div className="col-md-12">
          <button
            id="subscribe"
            type="submit"
            form="subscription-create"
            className="button-create-subscription pull-right"
            disabled={this.state.disabledForm}
          >{buttonLabel}
          </button>
          <button
            className="button-cancel-subscription pull-right"
            {...inputChangeAction}>{`${getI18n().planCodes.noMobilePlans}`}
          </button>
        </div>
      </div>
    )
  }

  renderDroits () {

    let checkClass = {
      'form-group': true,
      'col-md-12': true,
      'checkbox': true,
      'checkbox-has-error': this.state.error ? ~this.state.error.fields.indexOf('droits') : false
    }

    return (<div className="row">
      <div className={classSet(checkClass)}>
        <Checkbox
          type="checkbox"
          className="checkbox"
          name="droit-retractation"
          id="droit-retractation"
          ref="droits"
          disabled={this.state.disabledForm}
          required
          label={getI18n().payment.droits.label}
        />
        <div className="checkbox-label">
          <a href="/pdfs/formulaire-retractation.pdf"
             target="_blank">{getI18n().payment.droits.link}</a>
          <a ref="droitstip" className="my-tool-tip"
             data-original-title={getI18n().payment.droits.tooltip}
             data-placement="top"
             data-toggle="tooltip"><i className="zmdi zmdi-help"/></a>
        </div>
      </div>
    </div>)
  }

  renderCGU () {

    let checkClass = {
      'form-group': true,
      'col-md-12': true,
      'checkbox': true,
      'checkbox-has-error': this.state.error ? ~this.state.error.fields.indexOf('cgu') : false
    }

    return (<div className="row">
      <div className={classSet(checkClass)}>
        <Checkbox
          type="checkbox"
          className="checkbox-conditions-generales"
          ref="cgu"
          name="accept-conditions-generales"
          id="accept-conditions-generales"
          disabled={this.state.disabledForm}
          required
          label={getI18n().payment.cgu.label}
        />
        <div className="checkbox-label"><a
          href="/pdfs/conditions-utilisation.pdf"
          target="_blank">{getI18n().payment.cgu.link}</a>
        </div>
      </div>
    </div>)
  }

  async onSubmit (e) {
    const {
      props: {
        User,
        dispatch
      }
    } = this

    e.preventDefault()

    const {droits, cgu, firstName, lastName, methodForm} = this.refs
    const self = this
    const user = User.get('user')

    let billingInfo = {
      internalPlanUuid: this.state.internalPlanUuid,
      firstName: firstName && firstName.getValue(),
      lastName: lastName && lastName.getValue()
    }

    Q.fcall(()=> {

      if (!user) {
        const promiseLogin = new Promise((resolve)=> {
          dispatch(ModalActionCreators.open({
            target: 'showSignup',
            donePath: `/select-plan/${billingInfo.internalPlanUuid}/checkout`,
            cb: resolve
          }))
        })
        return promiseLogin
      }
      return user
    })
      .then(()=> {
        this.setState({
          error: null
        })

        this.disableForm(true)

        if (!cgu.state.switched || !droits.state.switched) {
          throw new Error({
            message: getI18n().payment.errors.checkbox,
            fields: ['cgu', 'droits']
          })
        }

        return methodForm.submit(billingInfo, this.state.currentPlan)
      })
      .then((subBillingInfo)=> {
        billingInfo = _.merge(billingInfo, subBillingInfo)
        return this.submitSubscription(billingInfo)
      }).catch((err)=> {
      self.error(err)
    })
  }


  async submitSubscription (formData) {
    const {
      props: {
        dispatch,
        router,
        params: {planCode}
      }
    } = this

    const self = this
    let isCash = router.isActive('cash')

    return Q()
      .then(()=> {
        if (formData.billingProviderName === 'netsize') {
          return dispatch(OAuthActionCreators.netsizeCheck({internalPlan: formData}))
        }
        return dispatch(BillingActionCreators.subscribe(formData))
      })
      .then(({res:{body:{subStatus, internalPlan:{internalPlanUuid, currency, amount}}}}) => {
        ReactFB.track({
          event: 'CompleteRegistration', params: {
            'content_name': internalPlanUuid,
            'status': subStatus,
            'currency': currency,
            'value': amount
          }
        })

        self.disableForm(false, 1)
        //On merge les infos en faisant un new call a getProfile
        return dispatch(UserActionCreators.getProfile())
      })
      .then(()=> {
        self.props.history.push(`${isCash ? '/cash' : ''}/select-plan/${planCode}/${isCash ? 'future' : 'success'}`)
      }).catch(({response = {body: {error, code, message}}}) => {
        let globalMessage = getI18n().payment.errors.global

        if (error) {
          globalMessage = message
        }

        if (code) {
          const errorCode = (self && getI18n().coupon.errors[code])
          if (errorCode && errorCode.message) {
            globalMessage = `${errorCode.message} [${code}]`
          }
        }


        self.disableForm(false, 2, globalMessage)
        self.props.history.push(`${isCash ? '/cash' : ''}/select-plan/${planCode}/error`)
      })
  }

  // A simple error handling function to expose errors to the customer
  error (err) {
    let formatError = err
    if (err instanceof Array) {
      formatError = err[0]
    }
    this.disableForm(false)
    this.setState({
      error: {
        message: formatError.message || getI18n().payment.errors.fields,
        fields: formatError.fields || []
      }
    })

    const containerDom = ReactDOM.findDOMNode(this)
    _.forEach(formatError.fields, (errorField)=> {
      let fields = Query.querySelectorAll(containerDom, `[data-billing=${errorField}]`)
      _.forEach(fields, (field)=> {
        DomClass.addClass(field, 'has-error')
      })
    })
  }

  disableForm (disabled, status = 0, message = '') {
    this.setState({
      disabledForm: disabled,
      message: message,
      subscriptionStatus: status,
      loading: disabled
    })
    const containerDom = ReactDOM.findDOMNode(this)
    let fields = Query.querySelectorAll(containerDom, '[data-billing]')
    _.forEach(fields, (field)=> {
      DomClass.removeClass(field, 'has-error')
    })
  }

  renderPaymentMethod (planLabel) {
    return (
      <PaymentMethod ref="methodForm"
                     plan={this.state.currentPlan}
                     planCode={this.state.internalPlanUuid} {...this.props}
                     planLabel={planLabel}/>)
  }

  renderForm () {

    var spinnerClasses = {
      'spinner-payment': true,
      'spinner-loading': this.state.loading
    }

    if (!this.state.currentPlan) {
      return <div />
    }

    const planLabel = `${getI18n().planCodes.title} ${this.state.currentPlan.get('name')} ${this.state.currentPlan.get('description')}`

    return (
      <div className="payment-wrapper">
        <div className="enter-payment-details">{planLabel}</div>
        <div className="payment-form">
          <div className={classSet(spinnerClasses)}>
            <Spinner />
          </div>
          <form ref="form" onSubmit={::this.onSubmit} id="subscription-create"
                data-async>

            {this.state.error ? <section id="error" ref="error">{this.state.error.message}</section> : ''}

            {this.renderUserForm()}

            {this.renderPaymentMethod(planLabel)}

            {this.renderCGU()}
            {this.renderDroits()}
            {this.renderSubmit()}
          </form>

        </div>
      </div>
    )
  }

  render () {
    const {
      props: {
        params: {status}
      }
    } = this

    if (!this.state.hasLib) {
      return (<PaymentError
        title={getI18n().payment.errors.noLib.title}
        message={getI18n().payment.errors.noLib.message}
        link={getI18n().payment.errors.noLib.message}
        linkMessage={getI18n().payment.errors.noLib.linkMessage}
      />)
    }

    switch (status) {
      case 'success':
        return (<PaymentSuccess/>)
        break
      case 'expired':
        return (
          <div className="payment-wrapper">
            <PaymentError title={getI18n().payment.expired.title}
                          message={getI18n().payment.expired.message}
                          link={getI18n().payment.expired.link}
                          linkMessage={getI18n().payment.expired.linkMessage}
                          links={getI18n().payment.expired.links}
            />
            <PaymentImages />
          </div>)
        break
      case 'future':
        return (
          <div className="payment-wrapper">
            <PaymentError title={getI18n().payment.future.title}
                          message={getI18n().payment.future.message}
                          link={getI18n().payment.future.link}
                          linkMessage={getI18n().payment.future.linkMessage}
                          links={getI18n().payment.future.links}
            />
            <CashwayEndPage />
          </div>)
        break
      case 'error':
        return (
          <div className="payment-wrapper">
            <PaymentError
              title={getI18n().payment.errors.abo}
              linkMessage={getI18n().payment.errors.retry}
              message={this.state.message}/>
          </div>)
        break
      default:
        return this.renderForm()
        break
    }
  }
}

PaymentForm.propTypes = {
  history: React.PropTypes.object.isRequired
}

export default  scriptLoader(
  [stripeApi, recurlyApi, gocarlessApi, braintreeApi]
)(withRouter(PaymentForm))
