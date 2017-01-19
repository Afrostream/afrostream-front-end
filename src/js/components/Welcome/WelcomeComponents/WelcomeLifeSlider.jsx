import React, { PropTypes } from 'react'
import Slider from 'react-slick'
import config from '../../../../../config'
import { withRouter } from 'react-router'
import WelcomeLife from './WelcomeLife'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

const {life, images} = config

class WelcomeLifeSlider extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {

    const settings = {
      autoplay: this.props.autoplay,
      dots: this.props.dots,
      infinite: this.props.infinite,
      autoplaySpeed: this.props.autoplaySpeed,
      speed: 500,
      adaptiveHeight: true,
      vertical: false,
      arrows: false,
      dotsClass: 'pager'
    }

    return (
      <div className="slide-show" ref="slC">
        {canUseDOM && <Slider {...settings}>
          <div>
            <WelcomeLife {...this.props}
                         title="life.welcome.label"
                         action="life.welcome.action"
                         imageUrl={life.welcome}/>
          </div>
          <div>
            <WelcomeLife {...this.props}
                         title="life.welcomeMobile.label"
                         action="life.welcomeMobile.action"
                         imageUrl={life.welcomeMobile}/>
          </div>
        </Slider>}
        {!canUseDOM && <div>
          <WelcomeLife {...this.props}
                       title="life.welcome.label"
                       action="life.welcome.action"
                       imageUrl={life.welcome}/>
        </div>}
      </div>
    )
  }
}

WelcomeLifeSlider.propTypes = {
  history: React.PropTypes.object,
  dots: React.PropTypes.bool,
  autoplay: React.PropTypes.bool,
  infinite: React.PropTypes.bool,
  speed: React.PropTypes.number
}

WelcomeLifeSlider.defaultProps = {
  dots: true,
  autoplay: false,
  infinite: false,
  speed: 5000
}

export default withRouter(WelcomeLifeSlider)
