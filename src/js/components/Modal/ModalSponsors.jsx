import React from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import ModalComponent from './ModalComponent'
import classNames from 'classnames'
import config from '../../../../config'
import { getI18n } from '../../../../config/i18n'
import { encodeSafeUrl } from '../../lib/utils'
import Immutable from 'immutable'
import * as BillingActionCreators from '../../actions/billing'
import * as FBActionCreators from '../../actions/facebook'
import * as ModalActionCreators from '../../actions/modal'

const {couponsCampaignBillingUuid, couponsCampaignType, billingProviderName} = config.sponsors

if (process.env.BROWSER) {
  require('./ModalSponsors.less')
}

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(BillingActionCreators.getCouponCampaigns({
      billingProviderName,
      couponsCampaignBillingUuid
    })),
    store.dispatch(BillingActionCreators.getSponsorsList({
      billingProviderName,
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
      billingProviderName,
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
      billingProviderName,
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


  sharePlan (campaign) {
    const {props:{User, dispatch}} = this
    const user = User.get('user')
    if (user && campaign) {
      const name = campaign.get('name')
      const description = campaign.get('description')
      const data = encodeSafeUrl({
        userReferenceUuid: user.get('_id'),
        billingProviderName,
        couponsCampaignBillingUuid
      },false)

      let shareData = Immutable.fromJS({
        title: `Parrainage`,
        description: `${description} ${this.getTitle('shareDesc')}`,
        link: 'coupon',
        query: {
          data
        }
      })

      dispatch(ModalActionCreators.open({target: 'strategy', data: shareData}))
    }
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
            <div className="col-md-4 text-left">
              {coupon.get('code')}
            </div>
            <div className="col-md-4">
              {couponOpts.get('recipientEmail')}
            </div>
            <div className="col-md-4">
              {this.renderCheck(status)}
            </div>
          </div>
        })

      }
    </div>
  }

  getSponsorsComponent () {

    const {props:{Billing}} = this

    const coupon = Billing.get(`coupons/${couponsCampaignBillingUuid}`)

    if (!coupon) {
      return
    }

    const plan = coupon.get('couponsCampaign').get('internalPlan')

    const inputProps = {
      onClick: e =>::this.sharePlan(plan)
    }
    return <button className="generate-btn" {...inputProps} >{this.getTitle('share')}</button>
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
                      <h1>{`${this.getTitle('title')} ${sponsorsList && '(' + sponsorsList.size + ')' }` }</h1>
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
