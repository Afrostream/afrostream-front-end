import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import Spinner from '../Spinner/Spinner'
import Slider from 'react-slick'
import { withRouter } from 'react-router'
import MovieInfo from '../Movies/MovieInfo'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

if (process.env.BROWSER) {
  require('./SlideShow.less')
}
@connect(({Category, Movie}) => ({Category, Movie}))
class SlideShow extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      props: {
        Category,
        Movie,
        maxLength,
        params:{
          movieId
        }
      }
    } = this

    const categoryId = Category.get(`categoryId`)
    let category

    if (categoryId) {
      category = Category.get(`categorys/${categoryId}/spots`)
    }

    if (movieId) {
      category = Immutable.List.of(Movie.get(`movies/${movieId}`))
    }

    if (!category) {
      return <div />
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
            load={true}
            showBtn={true}
            { ...{data}}
            {...this.props}
          /></div>)}
        </Slider>}
        {!canUseDOM && category && category.size && <div><MovieInfo
          active={true}
          load={true}
          showBtn={true}
          {...this.props}
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
  movieInfo: React.PropTypes.bool,
  speed: React.PropTypes.number,
  maxLength: PropTypes.number
}

SlideShow.defaultProps = {
  dots: true,
  autoplay: false,
  infinite: false,
  movieInfo: true,
  speed: 5000,
  maxLength: 200
}
export default withRouter(SlideShow)
