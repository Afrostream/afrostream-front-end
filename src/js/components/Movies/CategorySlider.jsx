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

    let dataList
    const category = Category.get(`categorys/${categoryId}`)

    if (category) {
      dataList = category.get('mergeSpotsWithMovies')

      //check if list has one spot
      dataList.map((item)=> {
        if (item instanceof Immutable.Map) {
          return
        }
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
