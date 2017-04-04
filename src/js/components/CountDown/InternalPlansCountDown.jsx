import React from 'react'
import ReactDOM from 'react-dom'
import CountDown from './CountDown'
import ReactImgix from '../Image/ReactImgix'
import { connect } from 'react-redux'
import { Link } from '../Utils'
import * as ModalActionCreators from '../../actions/modal'
import config from '../../../../config'
import SignUpButton from '../User/SignUpButton'
import { I18n } from'../Utils'
import {
  injectIntl
} from 'react-intl'

const {images, countdowns = []} = config

@connect(({User, Geo, Billing}) => ({User, Geo, Billing}))
class InternalPlansCountDown extends I18n {

  openModal (donePath) {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(ModalActionCreators.open({
      target: 'showSignup',
      donePath
    }))
  }


  renderCountDown () {
    let countdownImg
    const internalPlansCountDown = this.getLocaleCountdown()
    if (internalPlansCountDown.imageUrl && this.props.bgImage) {
      const countdownImgUri = `${images.urlPrefix}${internalPlansCountDown.imageUrl.replace(/{lang}/, this.props.intl.locale)}?crop=faces&fit=clip&w=1280&q=${images.quality}&fm=${images.type}&txt=©DR&txtclr=fff&txtsize=10&markalpha=70&txtalign=bottom,right`
      countdownImg = <ReactImgix className={'countdown-img'}
                                 src={countdownImgUri} blur={false} bg={this.props.bgImageMode}/>
    }
    return (
      <CountDown
        infos={internalPlansCountDown.infos}
        eventTime={internalPlansCountDown.countDownDateTo}
        contentPosition={'bottom'}
      >
        {countdownImg && countdownImg}
        {!countdownImg && <div className="afrostream-movie__subscribe">
        </div>}
        {this.props.action && <SignUpButton key="welcome-pgm-signup" className="subscribe-button"
                                            label={this.props.action}/>}
        <div className="mouse"/>
      </CountDown>
    )
  }

  renderProperLink () {

    const {props: {User, Billing}} = this
    const user = User.get('user')
    const internalPlansCountDown = this.getLocaleCountdown()
    const {internalPlanUuid, internalPlanQuery} = internalPlansCountDown
    const countdown = this.renderCountDown()
    const validPlans = Billing.get(`internalPlans/common`)
    const annualPlan = validPlans && validPlans.find((plan) => {
        const planUuid = plan.get('internalPlanUuid')
        return ~planUuid.indexOf(internalPlanUuid)
      })

    const targetConfigPlanUuid = annualPlan && annualPlan.get('internalPlanUuid') || internalPlanUuid

    let targetPlan = '/select-plan' + (targetConfigPlanUuid && `/${targetConfigPlanUuid}/checkout${internalPlanQuery}` || '')

    if (!user) {
      return (
        <div className={`${this.props.className}`}
             onClick={() => ::this.openModal(targetPlan)}>{countdown}</div>
      )
    }
    return (
      <div className={`no-hover ${this.props.className}`}><Link
        to={targetPlan}>{countdown}</Link>
      </div>
    )
  }


  getLocaleCountdown () {
    const {props: {Geo, router}} = this
    const isOnUk = router.isActive('uk')
    if (isOnUk) {
      return false
    }

    const geo = Geo.get('geo')
    return countdowns.find((countdown) => {
      const isCurrentLocale = countdown.countryCode === geo.get('countryCode')
      if (!isCurrentLocale) {
        return false
      }
      const presentTime = new Date().getTime()
      const startTime = new Date(countdown.countDownDateFrom).getTime()
      const endTime = new Date(countdown.countDownDateTo).getTime()
      if (presentTime - startTime >= 0 && presentTime - endTime <= 0) return countdown
      return false
    })
  }

  render () {
    const internalPlansCountDown = this.getLocaleCountdown()
    if (internalPlansCountDown) {
      return this.renderProperLink()
    }
    return this.props.children || <div />
  }
}

InternalPlansCountDown.propTypes = {
  mode: React.PropTypes.string,
  className: React.PropTypes.string,
  bgImage: React.PropTypes.bool,
  bgImageMode: React.PropTypes.bool,
  action: React.PropTypes.string
}
InternalPlansCountDown.defaultProps = {
  mode: 'horizontal',
  bgImage: false,
  bgImageMode: false,
  className: 'countdown',
  action: 'countdown.action'
}


export default injectIntl(InternalPlansCountDown)
