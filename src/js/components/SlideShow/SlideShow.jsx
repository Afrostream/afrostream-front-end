import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import Spinner from '../Spinner/Spinner'
import Slider from 'react-slick'
import { withRouter } from 'react-router'
import MovieInfo from '../Movies/MovieInfo'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import * as ModalActionCreators from '../../actions/modal'

if (process.env.BROWSER) {
  require('./SlideShow.less')
}
@connect(({Category, Movie, User}) => ({Category, Movie, User}))
class SlideShow extends React.Component {

  constructor (props) {
    super(props)
  }

  showLock () {
    const {
      props: {
        dispatch,
        User
      }
    } = this

    const user = User.get('user')
    if (!user) {
      dispatch(ModalActionCreators.open({
        target: 'showSignup'
      }))
    }
  }

  render () {
    const {
      props: {
        Category,
        Movie,
        movieId
      }
    } = this

    const carrousel = Category.get(`categorys/carrousel`)
    const categoryId = Category.get(`categoryId`)
    const category = carrousel && carrousel.size && carrousel.first()
    let spots = category && category.get(`adSpots`)
    if (movieId) {
      spots = Immutable.List.of(Movie.get(`movies/${movieId}`))
    }

    if (!spots) {
      return <div />
    }

    const settings = {
      autoplay: this.props.autoplay,
      dots: this.props.dots,
      infinite: this.props.infinite && spots.size > 1,
      autoplaySpeed: this.props.autoplaySpeed,
      speed: 500,
      adaptiveHeight: true,
      vertical: false,
      arrows: false,
      dotsClass: 'pager'
    }

    return (
      <div className="slide-show" ref="slC">
        {!spots && <Spinner />}
        {canUseDOM && spots.size > 1 &&
        <Slider {...settings}>
          {spots.map((data) => <div key={`slide-${data.get('_id')}`} onClick={::this.showLock}><MovieInfo
            active={true}
            load={true}
            showBtn={true}
            dataId={data.get('_id')}
            { ...{data}}
            {...this.props}
          /></div>)}
        </Slider>}
        {(!canUseDOM || (spots.size === 1)) && <MovieInfo
          active={true}
          load={true}
          showBtn={true}
          {...this.props}
          dataId={spots && spots.first().get('_id')}
          data={spots && spots.first()}/>}
      </div>
    )
  }
}

SlideShow.propTypes = {
  history: React.PropTypes.object,
  gradient: React.PropTypes.bool,
  dots: React.PropTypes.bool,
  showTrailer: React.PropTypes.bool,
  autoplay: React.PropTypes.bool,
  infinite: React.PropTypes.bool,
  movieInfo: React.PropTypes.bool,
  speed: React.PropTypes.number,
  maxLength: PropTypes.number
}

SlideShow.defaultProps = {
  dots: true,
  showTrailer: false,
  gradient: false,
  autoplay: false,
  infinite: false,
  movieInfo: true,
  speed: 5000,
  maxLength: 200
}

export default withRouter(SlideShow)
