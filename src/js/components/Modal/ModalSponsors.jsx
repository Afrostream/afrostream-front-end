import React from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import ModalComponent from './ModalComponent'
import classNames from 'classnames'
import config from '../../../../config'
import { getI18n } from '../../../../config/i18n'
import Autosuggest from 'react-autosuggest'
import * as BillingActionCreators from '../../actions/billing'
import * as FBActionCreators from '../../actions/facebook'

const {couponsCampaignBillingUuid, maxSponsors} = config.sponsors

if (process.env.BROWSER) {
  require('./ModalSponsors.less')
}

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(BillingActionCreators.getCouponCampaigns({
      billingProviderName: 'afr',
      couponsCampaignBillingUuid
    })),
    store.dispatch(BillingActionCreators.getSponsorsList({
      billingProviderName: 'afr',
      couponsCampaignBillingUuid
    })),
    store.dispatch(FBActionCreators.getInvitableFriends())
  ])
})
@connect(({Billing, User, Facebook}) => ({Billing, User, Facebook}))
class ModalSponsors extends ModalComponent {

  state = {
    email: '',
    expanded: false,
    errors: {},
    success: false,
    loading: false,
    suggestions: []
  }

  componentDidMount () {
    this.attachTooltip()
  }

  componentDidUpdate () {
    this.attachTooltip()
  }

  attachTooltip () {
    $('.check').tooltip()
  }

  getTitle (key = 'title') {
    const {
      props: {
        params
      }
    } = this

    return getI18n(params.lang)['sponsors'][key] || ''
  }

  isValid () {
    let valid = _.filter(this.state.errors, (value) => {
      return value
    })
    return !valid.length
  }

  handleInputChange (evt) {
    let formData = this.state
    if (!evt.target) {
      return
    }
    let name = evt.target.getAttribute('name')
    let value = evt.target.value
    formData[name] = value
    this.setState(formData, () => {
      this.validate(name)
    })
  }

  getSuggestions (value) {

    const {props:{Facebook}} = this

    const friends = Facebook.get('invitableFriends')

    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    const finalValues = friends.filter(friend =>
      friend.get('name').toLowerCase().slice(0, inputLength) === inputValue
    )

    return finalValues.toArray()
  }

  getSuggestionValue (suggestion) { // when suggestion selected, this function tells
    return suggestion.get('name')               // what should be the value of the input
  }

  renderSuggestion (suggestion) {
    return (
      <span>{suggestion.get('name')}</span>
    )
  }

  onSuggestionsUpdateRequested ({value}) {
    this.setState({
      suggestions: this.getSuggestions(value || '')
    })
  }


  validate (targetName) {
    let errors = this.state.errors
    errors[targetName] = null
    let valueForm = this.state[targetName]
    let isValid = true
    let valitationType = targetName
    let regex = null
    switch (targetName) {
      case 'email':
        regex = /^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        isValid = 'email' && regex.test(valueForm)
        break
    }

    if (!isValid) {
      const i18nValidMess = this.getTitle('validation')
      let label = targetName
      let errMess = i18nValidMess[valitationType]
      errors[targetName] = label + ' ' + errMess
    }
    this.setState({
      errors: errors
    })
  }

  renderValidationMessages (target) {
    let errorMessage = this.state.errors[target]
    if (!errorMessage) return ''
    return (<div className="help-block">{ errorMessage }</div>)
  }

  handleOpen () {
    this.setState({
      expanded: true
    })
  }

  handleClose () {
    const expanded = this.state.expanded
    if (expanded) {
      this.setState({
        email: ''
      })
    }
    this.setState({
      expanded: !expanded
    })
  }

  handleSubmit (event) {
    event.preventDefault()
    const {
      props: {dispatch}
    } = this


    const formData = this.state
    this.setState(formData, () => {
      this.validate('email')
    })

    if (!this.isValid()) {
      return
    }

    this.setState({
      loading: true,
      error: ''
    })

    let postData = {
      billingProviderName: 'afr',
      couponsCampaignBillingUuid,
      couponsOpts: {
        recipientEmail: this.state.email
      }
    }

    dispatch(BillingActionCreators.createCoupon(postData)).then(::this.onSuccess).catch(::this.onError)
  }

  onSuccess () {
    const {
      dispatch
    } = this.props

    this.setState({
      success: true,
      loading: false
    })

    dispatch(BillingActionCreators.getSponsorsList({
      billingProviderName: 'afr',
      couponsCampaignBillingUuid
    }))

    this.handleClose()
  }

  onError (err) {
    let errMess = err.message
    if (err.response) {
      if (err.response.body) {
        errMess = err.response.body.message
      } else if (err.response.text) {
        errMess = err.response.text
      }
    }

    this.setState({
      loading: false,
      error: this.getTitle(errMess.toString()) || errMess.toString() || this.getTitle('error')
    })

    this.handleClose()
  }

  getSponsorsList () {

    const {props:{Billing}} = this
    const sponsorsData = Billing.get('sponsorsList')
    const sponsorsList = sponsorsData && sponsorsData.get('coupons')
    if (!sponsorsList) {
      return
    }
    return <div className="sponsors-list">
      {sponsorsList.map((coupon, key) => (
        <div className="sponsor row-fluid"
             key={`sponsor-info-${key}`}>
          <div className="col-md-8 text-left">
            {coupon.get('code')}
          </div>
          <div className="col-md-4">
            <div className="check pull-right"
                 data-container=".panel"
                 title={`${this.getTitle(coupon.get('status'))}`}>
              <i className="zmdi zmdi-check"/>
            </div>
          </div>
        </div>))
      }
    </div>
  }

  getSponsorsComponent () {

    const {props:{Billing}} = this
    const {suggestions} = this.state



    const sponsorsData = Billing.get('sponsorsList')
    const sponsorsList = sponsorsData && sponsorsData.get('coupons')
    if (sponsorsList && sponsorsList.size >= maxSponsors) {
      return <div className="instructions">{this.getTitle('max')}</div>
    }

    const coupon = Billing.get(`coupons/${couponsCampaignBillingUuid}`)
    let description = ''
    if (coupon && coupon.get('couponsCampaign')) {
      description = coupon.get('couponsCampaign').get('description')
    }
    const classBtn = {
      'showmail': this.state.expanded
    }
    const classEmail = {
      'email-field': true,
      'active': this.state.expanded
    }

    const inputProps = {
      value: this.state.email,
      ref: 'email',
      name: 'email',
      type: 'email',
      className: classNames(classEmail),
      id: 'email-field',
      required: true,
      placeholder: `${this.state.expanded ? this.getTitle('emailField') : this.getTitle('placeHolder') }`,
      onChange: ::this.handleInputChange,
      onClick: ::this.handleOpen
    }


    return <div className="wrapper">
      <div className="middle">
        <div className="instructions">{this.getTitle('headerText').replace('{couponInfos}', description)}</div>
        {this.renderValidationMessages('email')}
        <form onSubmit={::this.handleSubmit} disabled={this.state.loading}>
          {<input {...inputProps}/> }
          {/* <Autosuggest suggestions={suggestions}
           onSuggestionsUpdateRequested={::this.onSuggestionsUpdateRequested}
           getSuggestionValue={::this.getSuggestionValue}
           renderSuggestion={::this.renderSuggestion}
           {...{inputProps}}/>
           */}
          <button type="submit" value="Subscribe" name="subscribe" id="subscribe-button"
                  className={classNames(classBtn)}>OK
          </button>
        </form>
      </div>
    </div>
  }

  render () {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default sponsors">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{this.getTitle('title')}</h1>
                      <a ref="closeEl" className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        {this.getSponsorsComponent()}
                        {this.getSponsorsList()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ModalSponsors.propTypes = {
  data: React.PropTypes.object
}

ModalSponsors.defaultProps = {
  data: null
}

export default ModalSponsors
