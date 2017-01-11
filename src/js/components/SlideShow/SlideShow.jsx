import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner/Spinner'
import Slider from 'react-slick'
import { withRouter } from 'react-router'
import MovieInfo from '../Movies/MovieInfo'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

if (process.env.BROWSER) {
  require('./SlideShow.less')
}
@connect(({Category, Slides}) => ({Category, Slides}))
class SlideShow extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      props: {
        Category
      }
    } = this

    const categoryId = Category.get(`categoryId`)
    let category
    if (categoryId) {
      category = Category.get(`categorys/${categoryId}/spots`)
    }

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
        {!category && <Spinner />}
        {canUseDOM && category &&
        <Slider {...settings}>
          {category.map((data) => <div key={`slide-${data.get('_id')}`}><MovieInfo
            active={true}
            maxLength={200}
            load={true}
            showBtn={true}
            { ...{data}}/></div>)}
        </Slider>}
        {!canUseDOM && category && category.size && <div><MovieInfo
          active={true}
          maxLength={200}
          load={true}
          showBtn={true}
          data={category.first()}/></div>}
      </div>
    )
  }
}

SlideShow.propTypes = {
  history: React.PropTypes.object,
  dots: React.PropTypes.bool,
  autoplay: React.PropTypes.bool,
  infinite: React.PropTypes.bool,
  speed: React.PropTypes.number
}

SlideShow.defaultProps = {
  dots: true,
  autoplay: false,
  infinite: false,
  speed: 5000
}
export default withRouter(SlideShow)
