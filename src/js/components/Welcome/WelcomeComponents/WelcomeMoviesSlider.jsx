import React, { PropTypes } from 'react'
import Slider from 'react-slick'
import config from '../../../../../config'
import { withRouter } from 'react-router'
import _ from 'lodash'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { connect } from 'react-redux'
import ReactImgix from '../../Image/ReactImgix'

const {metadata, images} = config

@connect(({Event}) => ({Event}))
class WelcomeMoviesSlider extends React.Component {

  constructor (props) {
    super(props)
  }

  renderSliderItem (imageUrl, index, isMobile) {
    let posterImg = `${images.urlPrefix}${imageUrl}?crop=faces&fit=clip&w=${isMobile ? 400 : 1280}&q=${images.quality}&fm=${images.type}`
    return (
      <section>
        <div className="welcome-slider-item" key={`life-element-slider-${index}`}><ReactImgix
          className="welcome-slider_img"
          src={posterImg} bg={true}/></div>
      </section>)
  }

  render () {

    const {props:{Event}} =this
    const settings = {
      autoplay: this.props.autoplay,
      dots: this.props.dots,
      infinite: this.props.infinite,
      autoplaySpeed: this.props.autoplaySpeed,
      speed: this.props.speed,
      adaptiveHeight: true,
      vertical: false,
      arrows: false,
      dotsClass: 'pager'
    }

    const isMobile = Event.get('isMobile')
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
  speed: React.PropTypes.number
}

WelcomeMoviesSlider.defaultProps = {
  dots: true,
  autoplay: true,
  infinite: true,
  speed: 10000,
  autoplaySpeed: 1000
}

export default withRouter(WelcomeMoviesSlider)
