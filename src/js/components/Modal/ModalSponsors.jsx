import React from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import ModalComponent from './ModalComponent'
import classNames from 'classnames'
import config from '../../../../config'
import { encodeSafeUrl } from '../../lib/utils'
import Immutable from 'immutable'
import * as BillingActionCreators from '../../actions/billing'
import * as FBActionCreators from '../../actions/facebook'
import * as EventActionCreator from '../../actions/event'
import * as ModalActionCreators from '../../actions/modal'
import ReactTooltip from 'react-tooltip'
import TextField from 'material-ui/TextField'
import qs from 'qs'
import copy from 'copy-to-clipboard'

const {couponsCampaignBillingUuid, couponsCampaignType, billingProviderName} = config.sponsors
const {metadata} = config

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

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.attachTooltip()
  }

  componentDidUpdate () {
    this.attachTooltip()
  }

  attachTooltip () {
    ReactTooltip.rebuild()
  }

  getI18n () {
    return 'sponsors'
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


  encodePlan (campaign) {
    const {props:{User, dispatch}} = this
    const user = User.get('user')
    let shareData = null
    if (user && campaign) {
      const name = campaign.get('name')
      const description = campaign.get('description')

      const data = encodeSafeUrl({
        userReferenceUuid: user.get('_id'),
        billingProviderName,
        couponsCampaignBillingUuid
      }, false)

      shareData = Immutable.fromJS({
        title: `Parrainage`,
        description: `${description} ${this.getTitle('shareDesc')}`,
        link: 'coupon',
        query: {
          data
        }
      })
    }

    return shareData
  }

  sharePlan (campaign) {
    const {props:{dispatch}} = this
    const data = this.encodePlan(campaign)
    if (data) {
      dispatch(ModalActionCreators.open({target: 'strategy', data}))
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
                data-tip={this.getTitle(`status/${status}`)}>
      <ReactTooltip place="top" type="dark"
                    effect="solid"/>
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
      onClick: e => ::this.sharePlan(plan)
    }
    return <button className="generate-btn" {...inputProps} >{this.getTitle('share')}</button>
  }

  copyClip (link) {
    const {props:{dispatch}} = this
    copy(link, {})
    dispatch(EventActionCreator.snackMessage({message: `sponsors.copied`}))
  }

  getLink () {

    const {props:{Billing}} = this


    const coupon = Billing.get(`coupons/${couponsCampaignBillingUuid}`)

    if (!coupon) {
      return
    }

    const plan = coupon.get('couponsCampaign').get('internalPlan')
    const data = this.encodePlan(plan)
    const query = data.get('query')

    let shareParams = qs.stringify(query && query.toJS() || {})
    const link = `${metadata.domain}/${data.get('link')}?${shareParams}`

    return (<div>
        <TextField id="urlPast" defaultValue={link}/>
        <button onClick={(e) => ::this.copyClip(link)} className="btn" data-clipboard-target="#urlPast"
                data-tip={this.getTitle('copy')}>
          <i className="zmdi zmdi-copy"/>
          <ReactTooltip place="top" type="dark"
                        effect="solid"/>
        </button>
      </div>
    )
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
                      <a ref="closeEl" className={closeClass} onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        {this.getLink()}
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
