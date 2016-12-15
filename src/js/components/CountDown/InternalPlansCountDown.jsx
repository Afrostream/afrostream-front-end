import React from 'react'
import ReactDOM from 'react-dom'
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

@connect(({User, Billing}) => ({User, Billing}))
class InternalPlansCountDown extends React.Component {

  drawSnow () {
    const {snowCVX} = this.refs

    if (!snowCVX) {
      return
    }
    const ctx = snowCVX.getContext('2d')
    const container = ReactDOM.findDOMNode(this)

    this.snowW = ctx.width = container.clientWidth
    this.snowH = ctx.height = container.clientHeight

    let snow, arr = []
    let num = 500, tsc = 1, sp = 1
    let sc = 0.8, t = 0, mv = 20, min = 1, f = null

    const initSnow = () => {
      window.requestAnimationFrame(initSnow)
      ctx.clearRect(0, 0, this.snowW, this.snowH)
      ctx.fillRect(0, 0, this.snowW, this.snowH)
      ctx.fill()
      for (let i = 0; i < arr.length; ++i) {
        f = arr[i]
        f.t += .05
        f.t = f.t >= Math.PI * 2 ? 0 : f.t
        f.y += f.sp
        f.x += Math.sin(f.t * tsc) * (f.sz * .3)
        if (f.y > this.snowH + 100) f.y = -10 - Math.random() * mv
        if (f.x > this.snowW + mv) f.x = -mv
        if (f.x < -mv) f.x = this.snowW + mv
        try {
          f.draw()
        } catch (e) {
          console.log('Draw snow err')
        }
      }
    }

    let Flake = function () {
      this.x = 0
      this.g = 0
      this.y = 0
      this.sz = 0

      this.draw = function () {
        this.g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.sz)
        this.g.addColorStop(0, 'hsla(255,255%,255%,0.6)')
        this.g.addColorStop(1, 'hsla(255,255%,255%,0)')
        ctx.moveTo(this.x, this.y)
        ctx.fillStyle = this.g
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2, true)
        ctx.fill()
      }
    }

    for (let i = 0; i < num; ++i) {
      snow = new Flake()
      snow.y = Math.random() * (this.snowH + 50)
      snow.x = Math.random() * this.snowW
      snow.t = Math.random() * (Math.PI * 2)
      snow.sz = (100 / (10 + (Math.random() * 100))) * sc
      snow.sp = (Math.pow(snow.sz * .8, 2) * .15) * sp
      snow.sp = snow.sp < min ? min : snow.sp
      arr.push(snow)
    }

    initSnow()

    /*________________________________________*/
    window.addEventListener('resize', ::this.resizeSnow)
  }

  resizeSnow () {
    const {snowCVX} = this.refs

    if (!snowCVX) {
      return
    }
    const ctx = snowCVX.getContext('2d')
    const container = ReactDOM.findDOMNode(this)

    this.snowW = ctx.width = container.clientWidth
    this.snowH = ctx.height = container.clientHeight
  }

  componentDidMount () {
    this.drawSnow()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', ::this.resizeSnow)
  }

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
    const countdownImg = `${images.urlPrefix}${internalPlansCountDown.imageUrl.replace(/{lang}/, this.props.intl.locale)}?crop=faces&fit=clip&w=1280&q=${images.quality}&fm=${images.type}&txt=©DR&txtclr=fff&txtsize=10&markalpha=70&txtalign=bottom,right`
    return (
      <CountDown
        eventTime={internalPlansCountDown.countDownDateTo}
      >
        <ReactImgix src={countdownImg}/>
        {this.props.action && <SignUpButton key="welcome-pgm-signup" className="subscribe-button"
                                            label={this.props.action}/>}
        <canvas ref="snowCVX"/>
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
  className: '',
  action: 'countdown.action'
}


export default injectIntl(InternalPlansCountDown)
