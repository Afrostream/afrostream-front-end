import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import config from '../../../../config'
import ModalSponsors from '../Modal/ModalSponsors'
import { formatPrice, isBoolean } from '../../lib/utils'
const {couponsCampaignBillingUuid} = config.sponsors
import { I18n } from '../Utils'
import {
  intlShape,
  injectIntl
} from 'react-intl'
import PaymentImages from '../Payment/PaymentImages'

if (process.env.BROWSER) {
  require('./SponsorsPage.less')
}

@connect(({Billing, User}) => ({Billing, User}))
class SponsorsPage extends I18n {

  state = {
    isMobile: false,
    size: {
      height: 250,
      width: 400
    }
  }

  renderCoupon () {

    const {props: {Billing, intl}} = this
    let {locale} = intl
    const coupon = Billing.get(`coupons/${couponsCampaignBillingUuid}`)
    if (!coupon) {
      return
    }

    const plan = coupon.get('couponsCampaign').get('internalPlan')
    if (!plan) {
      return
    }

    const thumb = plan.get('thumb')
    if (!thumb) {
      return
    }

    const path = thumb.get('path')
    if (!path) {
      return
    }
    let planName = plan.get('name')
    const details = plan.get('details')
    const translations = details && details.get('translations')
    if (translations) {
      const tsName = translations.get('name')
      planName = tsName && tsName.get(locale.toUpperCase()) || plan.get('name')
    }


    return <div>
      <section className="card">
        <img src={`/images/logo.png`} alt="afrostream-logo" className="logo"/>
        <div className="info">{planName}</div>
        <PaymentImages limit={4}/>
      </section>
    </div>
  }

  getI18n () {
    return 'sponsors'
  }

  render () {

    const {
      props: {User}
    } = this

    const user = User.get('user')
    const planCode = user && user.get('planCode')

    return (
      <div className="row-fluid brand-splitted">
        <div className="bg-splitted"/>
        <div className="container-fluid brand-splitted sponsors-page">
          {!planCode && <span>{this.getTitle('activeAccount')}</span>}
          {planCode && this.renderCoupon()}
          {planCode && <ModalSponsors {...this.props} modal={false} closable={false}/>}
        </div>
      </div>
    )
  }
}

SponsorsPage.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(SponsorsPage)
