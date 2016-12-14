import React from 'react'
import CountDown from './CountDown'
import ReactImgix from '../Image/ReactImgix'
import { connect } from 'react-redux'
import { Link } from '../Utils'
import * as ModalActionCreators from '../../actions/modal'
import config from '../../../../config'
import SignUpButton from '../User/SignUpButton'
import {
  injectIntl
} from 'react-intl'

const {images, internalPlansCountDown} = config

@connect(({User}) => ({User}))
class InternalPlansCountDown extends React.Component {

  openModal (uuid, query) {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(ModalActionCreators.open({
      target: 'showSignup',
      donePath: `/select-plan/${uuid}/checkout${query}`
    }))
  }

  renderCountDown () {
    const countdownImg = `${images.urlPrefix}${internalPlansCountDown.imageUrl.replace(/{lang}/, this.props.intl.locale)}?crop=faces&fit=clip&w=1280&q=${images.quality}&fm=${images.type}&txt=©DR&txtclr=fff&txtsize=10&markalpha=70&txtalign=bottom,right`
    return (
      <CountDown
        eventTime={internalPlansCountDown.countDownDateTo}
      >
        <ReactImgix src={countdownImg}/>
        {this.props.action && <SignUpButton key="welcome-pgm-signup" className="subscribe-button"
                                            label={this.props.action}/>}
      </CountDown>
    )
  }

  renderProperLink () {
    const user = this.props.User.get('user')
    const {internalPlanUuid, internalPlanQuery} = internalPlansCountDown
    const countdown = this.renderCountDown()
    if (!user) {
      return (
        <div onClick={() => ::this.openModal(internalPlanUuid, internalPlanQuery)}>{countdown}</div>
      )
    }
    return (
      <div className="no-hover"><Link
        to={`/select-plan/${internalPlanUuid}/checkout${internalPlanQuery}`}>{countdown}</Link></div>
    )
  }

  render () {

    const presentTime = new Date().getTime()
    const startTime = new Date(internalPlansCountDown.countDownDateFrom).getTime()

    if (presentTime - startTime >= 0) return this.renderProperLink()
    return null
  }
}

InternalPlansCountDown.propTypes = {
  action: React.PropTypes.string
}
InternalPlansCountDown.defaultProps = {
  action: 'countdown.action'
}


export default injectIntl(InternalPlansCountDown)
