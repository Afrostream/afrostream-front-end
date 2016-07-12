import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import config from '../../../../config'
import ModalSponsors from '../Modal/ModalSponsors'
import { formatPrice, isBoolean } from '../../lib/utils'
const {couponsCampaignBillingUuid} = config.sponsors
import { getI18n } from '../../../../config/i18n'

if (process.env.BROWSER) {
  require('./SponsorsPage.less')
}

@connect(({Billing}) => ({Billing}))
class SponsorsPage extends React.Component {

  state = {
    isMobile: false,
    size: {
      height: 250,
      width: 400
    }
  }

  getRows () {

    const {props:{Billing}} = this
    const coupon = Billing.get(`coupons/${couponsCampaignBillingUuid}`)
    if (!coupon) {
      return
    }

    let cols = [
      'name',
      'internalMobile',
      'internalUnlimited',
      'internalEngagment',
      'internalVip',
      'internalActionLabel'
    ]

    const {
      props: {
        params
      }
    } = this

    const getI18nionnary = getI18n(params.lang)
    const plan = coupon.get('couponsCampaign').get('internalPlan')

    return _.map(cols, (label)=> {
      let objVal = plan.get(label)

      if (objVal === undefined) {
        objVal = plan.get('internalPlanOpts').get(label)
      }

      if (objVal === undefined) {
        objVal = true
      }

      let value = ''
      switch (label) {
        case 'price':
          value = `${formatPrice(plan.get('amountInCents'), plan.get('currency'), true)}/${plan.get('periodLength')}${getI18nionnary.account.billing.periods[plan.get('periodUnit')]}`
          break
        case 'internalMaxScreens':
          value =
            <span>{`${parseInt(objVal)} ${getI18nionnary.planCodes.infos[label].replace('{s}', parseInt(objVal) > 1 ? 's' : '')}`}</span>
          break
        default :
          let isBool = (objVal === 'true' || objVal === 'false' || typeof objVal === 'boolean' ) && typeof isBoolean(objVal) === 'boolean'
          if (isBool) {
            if (isBoolean(objVal)) {
              value = <span>{ getI18nionnary.planCodes.infos[label] || ''}</span>
            }
          }
          else {
            value = objVal
          }
          break
      }

      if (!value) {
        return ''
      }

      return (
        <div key={`row-plan-${label}`} className="tick">
          {value}
        </div>
      )

    })
  }

  renderCoupon () {
    let imageStyle = {backgroundImage: `url(${'https://afrostream.imgix.net/production/thumb/2016/04/7215a76d06542cd8ea1a-soeurs%20e.jpg'/*config.metadata.shareImage*/}?crop=faces&fit=clip&w=${this.state.size.width}&q=${config.images.quality}&fm=${config.images.type}&rect=0,190,1500,1000)`}
    return <div>
      <h1>Offrez ce coupon à vos amis</h1>
      <section className="card" style={imageStyle}>
        <div className="info">
          {this.getRows()}
          <span className="rating"/>
        </div>
      </section>
    </div>
  }

  render () {
    return (
      <div className="row-fluid brand-bg">
        <div className="container brand-bg sponsors-page">
          {this.renderCoupon()}
          <ModalSponsors {...this.props} modal={false} closable={false}/>
        </div>
      </div>
    )
  }
}

export default SponsorsPage
