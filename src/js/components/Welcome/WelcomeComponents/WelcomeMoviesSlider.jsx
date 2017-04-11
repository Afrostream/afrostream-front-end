import React, { PropTypes } from 'react'
import Slider from 'react-slick'
import MobileDetect from 'mobile-detect'
import config from '../../../../../config'
import { withRouter } from 'react-router'
import _ from 'lodash'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { connect } from 'react-redux'
import ReactImgix from '../../Image/ReactImgix'
import * as ModalActionCreators from '../../../actions/modal'

const {metadata, images} = config

@connect(({Event, User}) => ({Event, User}))
class WelcomeMoviesSlider extends React.Component {

  state = {
    agent: null
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const userAgent = (window.navigator && navigator.userAgent) || ''
    let agent = new MobileDetect(userAgent)
    this.setState({
      agent
    })
  }

  renderSliderItem (imageUrl, index, isMobile) {
    let posterImg = `${images.urlPrefix}${imageUrl}?crop=faces&fit=clip&w=${isMobile ? 400 : 1280}&q=${images.quality}&fm=${images.type}`
    return (
      <section onClick={::this.showLock} key={`slider-home-${index}`}>
        <div className="content welcome-slider-item" key={`life-element-slider-${index}`}><ReactImgix
          className="welcome-slider_img"
          src={posterImg} bg={true} blur={false}/></div>
      </section>)
  }

  showLock () {
    const {
      props: {
        User,
        dispatch,
        router
      }
    } = this

    const user = User.get('user')
    if (user) {
      return router.push(this.props.to)
    }

    dispatch(ModalActionCreators.open({
      target: 'showSignup',
      donePath: this.props.to
    }))
  }

  render () {

    const {props: {Event, router}} = this

    const isOnUk = router.isActive('uk')

    if (isOnUk) {
      return <div />
    }

    const settings = {
      autoplay: this.props.autoplay,
      dots: this.props.dots,
      infinite: this.props.infinite,
      autoplaySpeed: this.props.autoplaySpeed,
      speed: this.props.speed,
      pauseOnHover: false,
      adaptiveHeight: false,
      vertical: false,
      arrows: false,
      dotsClass: 'pager'
    }

    const isMobile = Event.get('isMobile') && !(this.state.agent && this.state.agent.tablet())
    const carouselItems = metadata.carousel[isMobile ? 'mobile' : 'desktop']

    return (
      <div className="welcome-slider">
        {canUseDOM && <Slider {...settings}>
          {carouselItems && _.map(carouselItems, (slide, index) => this.renderSliderItem(slide, index, isMobile))}
        </Slider>}
        {!canUseDOM && carouselItems && this.renderSliderItem(_.find(carouselItems, 1), 1)}
      </div>
    )
  }
}

WelcomeMoviesSlider.propTypes = {
  history: React.PropTypes.object,
  dots: React.PropTypes.bool,
  autoplay: React.PropTypes.bool,
  infinite: React.PropTypes.bool,
  speed: React.PropTypes.number,
  to: React.PropTypes.string
}

WelcomeMoviesSlider.defaultProps = {
  to: '/',
  dots: true,
  autoplay: true,
  infinite: true,
  speed: 1000,
  autoplaySpeed: 6000
}

export default withRouter(WelcomeMoviesSlider)
