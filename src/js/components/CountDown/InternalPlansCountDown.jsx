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

const {images, internalPlansCountDown} = config

@connect(({User, Billing}) => ({User, Billing}))
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
    if (internalPlansCountDown.imageUrl) {
      const countdownImgUri = `${images.urlPrefix}${internalPlansCountDown.imageUrl.replace(/{lang}/, this.props.intl.locale)}?crop=faces&fit=clip&w=1280&q=${images.quality}&fm=${images.type}&txt=©DR&txtclr=fff&txtsize=10&markalpha=70&txtalign=bottom,right`
      countdownImg = <ReactImgix src={countdownImgUri} blur={false}/>
    }
    return (
      <CountDown
        eventTime={internalPlansCountDown.countDownDateTo}
        contentPosition={'bottom'}
      >
        {countdownImg}
        <div className="afrostream-movie__subscribe">
          <div className="afrostream-statement">
            <div className="discount-statement">
              <div className="price bolder">3,99
                <span className="currency">€</span><span
                  className="mini">/{this.getTitle('home.countdown.month')}</span>
              </div>
              {this.getTitle('home.countdown.instead')}
              <div className="off">6,99<span className="currency">€</span><span
                className="mini">/{this.getTitle('home.countdown.month')}</span></div>
            </div>
          </div>
        </div>
        {this.props.action && <SignUpButton key="welcome-pgm-signup" className="subscribe-button"
                                            label={this.props.action}/>}
        <div className="mouse"/>
      </CountDown>
    )
  }

  renderProperLink () {

    const {props:{User, Billing}} =this
    const user = User.get('user')
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

  render () {
    const presentTime = new Date().getTime()
    const startTime = new Date(internalPlansCountDown.countDownDateFrom).getTime()
    const endTime = new Date(internalPlansCountDown.countDownDateTo).getTime()
    if (presentTime - startTime >= 0 && presentTime - endTime <= 0) return this.renderProperLink()
    return this.props.children || <div />
  }
}

InternalPlansCountDown.propTypes = {
  className: React.PropTypes.string,
  action: React.PropTypes.string
}
InternalPlansCountDown.defaultProps = {
  className: 'countdown',
  action: 'countdown.action'
}


export default injectIntl(InternalPlansCountDown)
