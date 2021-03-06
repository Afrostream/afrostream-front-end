import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import shallowEqual from 'react-pure-render/shallowEqual'
import classSet from 'classnames'
import config from '../../../../config'
import * as BillingActionCreators from '../../actions/billing'
import * as UserActionCreators from '../../actions/user'
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
import { I18n } from '../Utils'
import ReactTooltip from 'react-tooltip'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import {
  FormattedMessage,
  injectIntl
} from 'react-intl'

const {
  gocarlessApi,
  recurlyApi,
  stripeApi
} = config

if (process.env.BROWSER) {
  require('./PaymentForm.less')
}
if (canUseDOM) {
  var ReactGA = require('react-ga')
}

@connect(({User, Billing, OAuth}) => ({User, Billing, OAuth}))
class PaymentForm extends I18n {

  constructor(props) {
    super(props)
  }

  state = {
    hasLib: true,
    subscriptionStatus: 0,
    loading: false,
    pageHeader: 'payment.header'
  }

  hasPlan() {

    const {
      props: {
        Billing,
        params: {planCode}
      }
    } = this

    let plan = Billing.get(`internalPlans/${planCode}`)

    if (!plan) {
      return false
    }
    return plan
  }

  setupUser() {
    const {
      props: {
        User,
        dispatch
      }
    } = this
    let currentPlan = this.hasPlan()

    if (!currentPlan) {
      return
    }

    let internalPlanUuid = currentPlan.get('internalPlanUuid')
    const user = User.get('user')
    if (!user) {
      dispatch(ModalActionCreators.open({
        target: 'showSignup',
        donePath: `/select-plan/${internalPlanUuid}/checkout`
      }))
    } else {
      dispatch(ModalActionCreators.close())
    }
  }

  setupPlan() {
    let currentPlan = this.hasPlan()
    if (!currentPlan) {
      return
    }

    let internalPlanUuid = currentPlan.get('internalPlanUuid')

    ReactFB.track({
      event: 'InitiateCheckout', params: {
        'content_name': internalPlanUuid,
        'value': currentPlan.get('amount')
      }
    })
  }

  componentDidMount() {
    this.setupUser()
    this.setupPlan()
    this.attachTooltip()
  }

  componentDidUpdate() {
    this.attachTooltip()
    this.setupUser()
  }

  attachTooltip() {
    ReactTooltip.rebuild()
  }

  componentWillReceiveProps(nextProps) {
    const {
      props: {
        Billing,
        params
      }
    } = this

    if (nextProps.isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      this.setState({
        hasLib: nextProps.isScriptLoadSucceed
      })
    }

    if (!shallowEqual(nextProps.Billing, Billing) || !shallowEqual(nextProps.params, params)) {
      this.setupPlan()
    }
  }

  renderUserForm() {

    const {
      props: {
        User
      }
    } = this

    const currentPlan = this.hasPlan()
    const internalPlanUuid = currentPlan && currentPlan.get('internalPlanUuid')

    //if (currentPlan && internalPlanUuid === config.netsize.internalPlanUuid) {
    //  return
    //}

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
                className="last-name"
                data-billing="last_name"
                ref="lastName"
                id="last_name"
                autoComplete="surname"
                name="last-name"
                defaultValue={lastName}
                floatingLabelText={this.getTitle('payment.lastName')}
                required
                disabled={this.state.disabledForm}/>
            </div>
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
                floatingLabelText={this.getTitle('payment.name')}
                required
                disabled={this.state.disabledForm}/>
            </div>
          </div>
        </div>
      </div>)
  }

  renderSubmit() {

    const {
      props: {
        dispatch,
        history
      }
    } = this

    const {methodForm} = this.refs

    const currentPlan = this.hasPlan()

    if (!currentPlan) {
      return
    }

    const internalPlanUuid = currentPlan.get('internalPlanUuid')
    const originPath = this.getPath()
    let buttonLabel = 'planCodes.action'
    if (currentPlan && internalPlanUuid === config.netsize.internalPlanUuid) {
      buttonLabel = 'planCodes.actionMobile'
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
        })).then(() => {
          history.push(`${originPath}/select-plan`)
        })
      }
    }
    return (<div className="row">
        <div className="col-md-12">
          {methodForm && methodForm.method() !== methodForm.WECASHUP && <button
            type="submit"
            form="subscription-create"
            className="button-create-subscription pull-right wecashup_button"
            disabled={this.state.disabledForm}>
            {this.getTitle(buttonLabel)}
          </button>}
          <button
            className="button-cancel-subscription pull-right"
            {...inputChangeAction}>
            {this.getTitle('planCodes.noMobilePlans')}
          </button>
        </div>
      </div>
    )
  }

  renderDroits() {

    let checkClass = {
      'col-md-12': true,
      'checkbox': true,
      'checkbox-has-error': this.state.error ? ~this.state.error.fields.indexOf('droits') : false
    }

    return (<div className="row-fluid">
        <div className={classSet(checkClass)}>
          <Checkbox
            type="checkbox"
            className="checkbox"
            name="droit-retractation"
            id="droit-retractation"
            ref="droits"
            disabled={this.state.disabledForm}
            required
            label={this.getTitle('payment.droits.label')}
          />
          <div className="checkbox-label">
            <a href="/pdfs/formulaire-retractation.pdf"
               target="_blank">
              <FormattedMessage id="payment.droits.link"/>
            </a>
            <a ref="droitstip" className="my-tool-tip"
               data-tip={this.getTitle('payment.droits.tooltip')}>
              <i className="zmdi zmdi-help"/>
              <ReactTooltip place="top" type="dark"
                            effect="solid"/>
            </a>
          </div>
        </div>
      </div>
    )
  }

  renderCGU() {

    let checkClass = {
      'col-md-12': true,
      'checkbox': true,
      'checkbox-has-error': this.state.error ? ~this.state.error.fields.indexOf('cgu') : false
    }

    return (<div className="row-fluid">
      <div className={classSet(checkClass)}>
        <Checkbox
          type="checkbox"
          className="checkbox-conditions-generales"
          ref="cgu"
          name="accept-conditions-generales"
          id="accept-conditions-generales"
          disabled={this.state.disabledForm}
          required
          label={this.getTitle('payment.cgu.label')}
        />
        <div className="checkbox-label">
          <a href="/pdfs/conditions-utilisation.pdf"
             target="_blank">
            <FormattedMessage id="payment.cgu.link"/>
          </a>
        </div>
      </div>
    </div>)
  }

  async onSubmit(e) {
    const {
      props: {
        User,
        Billing,
        dispatch,
        location
      }
    } = this

    e.preventDefault()

    let {query, pathname} = location
    this.disableForm(false)

    const {droits, cgu, firstName, lastName, methodForm, form} = this.refs
    const self = this
    const user = User.get('user')
    const currentPlan = this.hasPlan()
    const internalPlanUuid = currentPlan && currentPlan.get('internalPlanUuid') || this.props.params.internalPlanUuid


    let billingInfo = {
      internalPlanUuid,
      firstName: firstName && firstName.getValue(),
      lastName: lastName && lastName.getValue(),
      subOpts: {
        utm_medium: Billing.get('utm_medium')
      }
    }

    Q.fcall(() => {

      if (!user) {
        const promiseLogin = new Promise((resolve) => {
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
      .then(() => {
        this.setState({
          error: null
        })


        const isFormValid = form && form.checkValidity()
        if (!isFormValid && (form && form.elements)) {
          let errorEl
          _.forEach(form.elements, (element) => {
            const elementValid = element.checkValidity()
            if (!elementValid) {
              //element.setCustomValidity('Invalid')
              //validationMessage
              errorEl = element.labels && element.labels.length && element.labels[0].innerHTML || element.name
            }
            return elementValid
          })
          throw new Error(this.getTitle('payment.errors.fields', {fields: errorEl}))
        }

        if (!cgu.state.switched || !droits.state.switched) {
          throw new Error(this.getTitle('payment.errors.checkbox'))
        }

        const currentPlan = this.hasPlan()

        this.disableForm(true)
        return methodForm.submit(billingInfo, currentPlan)
      })
      .then((subBillingInfo) => {
        billingInfo = _.merge(billingInfo, subBillingInfo)
        return this.submitSubscription(billingInfo)
      }).catch((err) => {
      //Clear the shopping cart of all transactions and items
      ReactGA.plugin.execute('ecommerce', 'clear')
      self.error(err)
    })
  }

  getPath() {
    const {
      props: {
        router,
        routes,
        params: {lang}
      }
    } = this

    let isCash = router.isActive('cash') || _.find(routes, route => ( route.name === 'cash'))
    return `${lang ? '/' + lang : ''}${isCash ? '/cash' : ''}`
  }

  async submitSubscription(formData) {
    const {
      props: {
        dispatch,
        router,
        history,
        params: {planCode}
      }
    } = this

    const self = this
    const {methodForm} = this.refs

    let isCash = router.isActive('cash')
    const originPath = this.getPath()
    const currentPlan = this.hasPlan()
    return Q()
      .then(() => {
        switch (formData.billingProviderName) {
          case PaymentMethod.Methods.NETSIZE:
          case PaymentMethod.Methods.WECASHUP:
            return dispatch(OAuthActionCreators.cookieCheck({
              strategy: formData.billingProviderName,
              internalPlan: formData,
              modalType: formData.billingProviderName === PaymentMethod.Methods.WECASHUP ? 'ajax' : 'popup'
            }))
            break
          default:
            return dispatch(BillingActionCreators.subscribe(formData))
            break
        }
      })
      .then(({res: {body: {subStatus, subscriptionBillingUuid}}}) => {

        const internalPlanUuid = currentPlan.get('internalPlanUuid')
        const planName = currentPlan.get('name')
        const currency = currentPlan.get('currency')
        const amount = Number(currentPlan.get('amountInCents') * 0.01)
        const amountExclTax = Number(currentPlan.get('amountInCentsExclTax') * 0.01)
        const tax = amount - amountExclTax
        const currencyConversions = currentPlan.get('currencyConversions')
        const conversion = currencyConversions.get('EUR')
        const conversionAmount = conversion.get('amount')

        ReactGA.plugin.execute('ecommerce', 'addTransaction', {
          id: subscriptionBillingUuid,
          revenue: conversionAmount,
          currency,
          tax
        })

        ReactGA.plugin.execute('ecommerce', 'addItem', {
          id: internalPlanUuid,
          name: planName,
          price: amount,
          quantity: 1,
          currency
        })

        ReactFB.track({
          event: 'CompleteRegistration', params: {
            'content_name': internalPlanUuid,
            'status': subStatus,
            'currency': currency,
            'value': amount
          }
        })

        self.disableForm(false, 1)

        methodForm.onSuccess()
        //On merge les infos en faisant un new call a getProfile
        return dispatch(UserActionCreators.getProfile())
      })
      .then(() => {

        //Finally send the data to Google Analytics
        ReactGA.plugin.execute('ecommerce', 'send')

        history.push(`${originPath}/select-plan/${planCode}/${isCash ? 'future' : 'success'}`)
      }).catch(({response: {body: {error, code, message}}}) => {
        let globalMessage = this.getTitle('payment.errors.global')

        if (error) {
          globalMessage = error.message || message
        }

        if (code) {
          const errorCode = (self && this.getTitle(`coupon.errors.${code}.message`))
          if (errorCode) {
            globalMessage = `${errorCode} [${code}]`
          }
        }


        methodForm.onError()
        self.disableForm(false, 2, globalMessage)
        //Clear the shopping cart of all transactions and items
        ReactGA.plugin.execute('ecommerce', 'clear')
        history.push(`${originPath}/select-plan/${planCode}/error`)
      })
  }

  // A simple error handling function to expose errors to the customer
  error(err) {

    const {props: {dispatch}} = this

    let formatError = err
    if (err instanceof Array) {
      formatError = err[0]
    }
    this.disableForm(false)
    this.setState({
      error: {
        message: formatError.message || this.getTitle(`coupon.errors.fields`),
        fields: formatError.fields || []
      }
    })

    const containerDom = ReactDOM.findDOMNode(this)
    _.forEach(formatError.fields, (errorField) => {
      let fields = Query.querySelectorAll(containerDom, `[data-billing=${errorField}]`)
      _.forEach(fields, (field) => {
        DomClass.addClass(field, 'has-error')
      })
    })

    //dispatch(EventActionCreators.snackMessage({message: formatError.message, type: 'error'}))
  }

  disableForm(disabled, status = 0, message = '') {
    this.setState({
      disabledForm: disabled,
      message: message,
      subscriptionStatus: status,
      loading: disabled
    })
    const containerDom = ReactDOM.findDOMNode(this)
    let fields = Query.querySelectorAll(containerDom, '[data-billing]')
    _.forEach(fields, (field) => {
      DomClass.removeClass(field, 'has-error')
    })
  }

  renderPaymentMethod(planLabel) {
    const currentPlan = this.hasPlan()
    const internalPlanUuid = currentPlan && currentPlan.get('internalPlanUuid') || this.props.params.internalPlanUuid
    return (
      <PaymentMethod ref="methodForm"
                     form={this.refs.form}
                     plan={currentPlan}
                     planCode={internalPlanUuid} {...this.props}
                     planLabel={planLabel}/>)
  }

  renderForm() {

    var spinnerClasses = {
      'spinner-payment': true,
      'spinner-loading': this.state.loading
    }

    const currentPlan = this.hasPlan()
    if (!currentPlan) {
      return <div />
    }

    const planLabel = `${this.getTitle(`planCodes.title`)} ${currentPlan.get('name')} ${currentPlan.get('description')}`

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

  render() {
    const {
      props: {
        params: {status}
      }
    } = this

    if (!this.state.hasLib) {
      return (<PaymentError
        title={`payment.errors.noLib.title`}
        message={`payment.errors.noLib.message`}
        link={`payment.errors.noLib.message`}
        linkMessage={`payment.errors.noLib.linkMessage`}
      />)
    }

    switch (status) {
      case 'success':
        return (<PaymentSuccess/>)
        break
      case 'expired':
        return (
          <div className="payment-wrapper">
            <PaymentError title={`payment.expired.title`}
                          message={`payment.expired.message`}
                          link={`payment.expired.link`}
                          linkMessage={`payment.expired.linkMessage`}
                          links={`payment.expired.links`}
                          willRedirect
            />
            <PaymentImages />
          </div>)
        break
      case 'future':
        return (
          <div className="payment-wrapper">
            <PaymentError title={`payment.future.title`}
                          message={`payment.future.message`}
                          link={`payment.future.link`}
                          linkMessage={`payment.future.linkMessage`}
                          links={`payment.future.links`}
            />
            <CashwayEndPage />
          </div>)
        break
      case 'error':
        return (
          <div className="payment-wrapper">
            <PaymentError
              title={`payment.errors.abo`}
              linkMessage={`payment.errors.retry`}
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
  [
    stripeApi,
    recurlyApi,
    gocarlessApi
  ]
)(withRouter(injectIntl(PaymentForm)))
