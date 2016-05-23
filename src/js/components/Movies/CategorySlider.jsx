import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { prepareRoute } from '../../decorators'
import * as CategoryActionCreators from '../../actions/category'
import Slider from '../Slider/Slider'
import ReactList from 'react-list'
import MoviesSlider from './MoviesSlider'
import classSet from 'classnames'

export const UPDATE_TIME = 400
export const MAX_PROGRESS = 90
export const PROGRESS_INCREASE = 10

@prepareRoute(async function ({store, categoryId}) {
  store.dispatch(CategoryActionCreators.getCategory(categoryId))
})
@connect(({Category}) => ({Category}))
class CategorySlider extends MoviesSlider {

  constructor (props) {
    super(props)
    this.state = {
      percent: 0,
      loading: 0,
      interval: null
    }

    this.boundSimulateProgress = ::this.simulateProgress
  }

  componentDidMount () {
    this.launch()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.categoryId > this.props.categoryId) {
      this.launch()
    }
  }

  launch () {
    let interval = this.state.interval
    const percent = this.state.percent

    if (!interval) {
      interval = setInterval(this.boundSimulateProgress, UPDATE_TIME)
    }

    this.setState({percent, interval})
  }

  simulateProgress () {
    const {
      props: {
        categoryId,
        Category
      }
    } = this

    const category = Category.get(`categorys/${categoryId}`)

    let interval = this.state.interval
    let percent = this.state.percent

    if (category) {
      clearInterval(interval)
      interval = null
      percent = 0
    } else if (percent < MAX_PROGRESS) {
      percent = percent + PROGRESS_INCREASE
    }

    this.setState({percent, interval})
  }

  shouldShow (percent) {
    return (percent > 0) && (percent <= 100)
  }

  buildStyle () {
    const style = {
      width: `${this.state.percent}%`
    }

    return {...style, ...this.props.style}
  }

  renderItem (index) {
    const {
      props: {
        categoryId,
        Category
      }
    } = this

    const category = Category.get(`categorys/${categoryId}`)
    const dataList = category.get('mergeSpotsWithMovies')
    let data = dataList.get(index)
    if (data instanceof Immutable.Map) {
      return this.renderBlock(data);
    }
    return (
      <div className="block" key={`data-block-${index}`}>{data.map((item)=> {
        return this.renderBlock(item)
      }).toJS()}</div>
    );
  }

  render () {
    const {
      props: {
        Category,
        categoryId,
        label,
        slug,
        axis
      }
    } = this
    let listClass = {
      'movies-data-list': true,
      'spots': false
    }

    const style = this.buildStyle()
    const loaderClass = {
      'movies-data-list_loader': true
    }


    let dataList
    const category = Category.get(`categorys/${categoryId}`)

    loaderClass.loader_hidden = category
    if (category) {
      dataList = category.get('mergeSpotsWithMovies')
      loaderClass.loader_hidden = dataList

      //check if list has one spot
      dataList.map((item)=> {
        const findSpot = item.find((movie)=> {
          return movie.get('adSpot')
        })
        if (findSpot) {
          listClass.spots = findSpot
        }
      })
    }


    return (
      <div className={classSet(listClass)}>
        <div style={style} className={classSet(loaderClass)}></div>
        {slug ? <div id={slug} className="movies-list__anchor"/> : ''}
        {label ? <div className="movies-list__selection">{label}</div> : ''}
        {category && dataList ?
          <Slider {...this.props}>
            <div className="slider-container">
              <ReactList
                ref="react-list"
                useTranslate3d={true}
                axis={axis}
                itemRenderer={::this.renderItem}
                length={dataList.size}
                type={axis === 'x' ? 'variable' : 'uniform' }
              />
            </div>
          </Slider> : null}
      </div>
    )
  }
}

CategorySlider.propTypes = {
  categoryId: React.PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
  actions: PropTypes.object,
  loading: PropTypes.number
}

CategorySlider.defaultProps = {
  categoryId: null,
  style: {},
  className: undefined,
  loading: 0
}

export default CategorySlider
