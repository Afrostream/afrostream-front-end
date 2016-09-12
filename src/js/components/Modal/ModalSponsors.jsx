import React from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import ModalComponent from './ModalComponent'
import classNames from 'classnames'
import config from '../../../../config'
import { getI18n } from '../../../../config/i18n'
import Immutable from 'immutable'
import * as BillingActionCreators from '../../actions/billing'
import * as FBActionCreators from '../../actions/facebook'
import * as ModalActionCreators from '../../actions/modal'

const {couponsCampaignBillingUuid, couponsCampaignType, maxSponsors} = config.sponsors

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
      couponsCampaignType
    })),
    store.dispatch(FBActionCreators.getInvitableFriends())
  ])
})
@connect(({Billing, User, Facebook}) => ({Billing, User, Facebook}))
class ModalSponsors extends ModalComponent {

  state = {
    errors: {},
    success: false,
    loading: false
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

  generateCoupon (event) {
    event.preventDefault()
    const {
      props: {dispatch}
    } = this

    this.setState({
      loading: true,
      error: ''
    })

    let postData = {
      billingProviderName: 'afr',
      couponsCampaignBillingUuid
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
      couponsCampaignType
    }))

  }

  onError (err) {
    let errMess = err.message
    if (err.response) {
      if (err.response.body) {
        errMess = err.response.body.message || err.response.body.error
      } else if (err.response.text) {
        errMess = err.response.text
      }
    }

    const errorMessage = this.getTitle('errors')
    this.setState({
      loading: false,
      error: errorMessage && errorMessage[errMess.toString()] || errMess.toString() || errorMessage.error
    })

  }

  shareCoupon (coupon) {
    const {props:{dispatch}} = this
    if (coupon && coupon.get('internalPlan')) {
      const plan = coupon.get('internalPlan')
      const description = plan.get('description')

      let shareData = Immutable.fromJS({
        title: `Coupon cadeau "${coupon.get('code')}"`,
        description: `Salut, soit le premier à profiter de ce goupon gratuit sur afrostream et profite de ${description}`,
        link: 'parrainage',
        query: {
          coupon: coupon.get('code')
        }
      })
      dispatch(ModalActionCreators.open({target: 'strategy', data: shareData}))
    }
  }

  renderShareButton (coupon) {

    const inputProps = {
      onClick: e =>::this.shareCoupon(coupon)
    }

    return <button className="btn" {...inputProps} >{this.getTitle('share')}</button>

  }

  renderCheck (status) {

    const classCheck = {
      'check': true,
      'pull-right': true,
      'active': status === 'redeemed'
    }

    return <div className={classNames(classCheck)}
                data-container=".panel"
                title={`${this.getTitle('status')[status]}`}>
      <i className="zmdi zmdi-check"/></div>
  }

  getSponsorsList () {

    const {props:{Billing}} = this
    const sponsorsData = Billing.get('sponsorsList')
    const sponsorsList = sponsorsData && sponsorsData.get('coupons')
    if (!sponsorsList) {
      return
    }
    return <div className="sponsors-list">
      {sponsorsList.map(
        (coupon, key) => {
          const couponOpts = coupon.get('couponOpts')
          const status = coupon.get('status')
          if (!couponOpts) {
            return
          }


          return <div className="sponsor row-fluid"
                      key={`sponsor-info-${key}`}>
            <div className="col-md-8 text-left">
              {coupon.get('code')}
              {couponOpts.get('recipientEmail')}
            </div>
            <div className="col-md-4">
              {status && (status === 'waiting' && this.renderShareButton(coupon))}
              {status && (status !== 'waiting' && this.renderCheck(status))}
            </div>
          </div>
        })

      }
    </div>
  }

  getSponsorsComponent () {

    const {props:{Billing, User}} = this
    const user = User.get('user')
    let canSponsorshipSubscription = false
    if (user) {
      const subscriptionsStatus = user.get('subscriptionsStatus')
      if (subscriptionsStatus) {
        const subscriptions = subscriptionsStatus.get('subscriptions')
        canSponsorshipSubscription = Boolean(subscriptions && subscriptions.filter((a) => a.get('isActive') === 'yes' && a.get('inTrial') === 'no').size)
      }
    }
    //no sponsorship availlable
    if (!canSponsorshipSubscription) {
      return
    }

    const sponsorsData = Billing.get('sponsorsList')
    const sponsorsList = sponsorsData && sponsorsData.get('coupons')

    if (sponsorsList && sponsorsList.size >= maxSponsors) {
      return <div className="instructions">{this.getTitle('max')}</div>
    }

    const coupon = Billing.get(`coupons/${couponsCampaignBillingUuid}`)
    let description = ''
    if (coupon && coupon.get('couponsCampaign')) {
      const plan = coupon.get('couponsCampaign').get('internalPlan')
      description = plan.get('description')
    }


    return (<button className="generate-btn" onClick={::this.generateCoupon}>{this.getTitle('new')}
      <i className="zmdi zmdi-plus"></i>
    </button>)
  }

  render () {

    const {props:{Billing}} = this
    const sponsorsData = Billing.get('sponsorsList')
    const sponsorsList = sponsorsData && sponsorsData.get('coupons') || Immutable.fromJS([])

    let popupClass = classNames({
      'popup': this.props.modal
    })

    let overlayClass = classNames({
      'overlay': this.props.modal,
      'widget': !this.props.modal,
      'active': true
    })

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    return (
      <div className="lock-container container brand-bg-none">
        <div id="lock" className="lock theme-default sponsors">
          <div className="sponsors">
            <div className={popupClass}>
              <div className={overlayClass}>
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{`${this.getTitle('title')} ${sponsorsList && '(' + sponsorsList.size + '/' + maxSponsors + ')' }` }</h1>
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

ModalSponsors
  .propTypes = {
  data: React.PropTypes.object
}

ModalSponsors
  .defaultProps = {
  data: null
}

export
default
ModalSponsors
