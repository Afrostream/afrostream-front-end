import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import SlidesContainer from './Slides'
import Pagination from './Pagination'
import Spinner from '../Spinner/Spinner'
import Slider from 'react-slick'
import * as SlidesActionCreators from '../../actions/slides'
import * as CategoryActionCreators from '../../actions/category'
import config from '../../../../config'
import { withRouter } from 'react-router'
import MovieInfo from '../Movies/MovieInfo'

if (process.env.BROWSER) {
  require('./SlideShow.less')
}
//@prepareRoute(async function ({store}) {
//  return await Promise.all([
//    store.dispatch(CategoryActionCreators.getSpots())
//  ])
//})
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
    if (!categoryId) {
      return (<Spinner />)
    }
    const category = Category.get(`categorys/${categoryId}/spots`)
    if (!category || !category.size) {
      return (<Spinner />)
    }

    const settings = {
      autoplay: this.props.autoplay,
      dots: this.props.dots,
      infinite: this.props.infinite,
      autoplaySpeed: this.props.autoplaySpeed,
      speed: 500,
      vertical: false,
      arrows: false,
      dotsClass: 'pager'
    }

    return (
      <div className="slide-show" ref="slC">
        <Slider {...settings}>
          {category.map((data) => <div key={`slide-${data.get('_id')}`}><MovieInfo
            active={true}
            maxLength={200}
            load={true}
            showBtn={true}
            { ...{data}}/></div>)}
        </Slider>
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
