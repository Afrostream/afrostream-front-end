import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import * as CategoryActionCreators from '../../actions/category'
import Spinner from '../Spinner/Spinner'
import Slider from '../Slider/Slider'
import ReactList from 'react-list'
import MoviesSlider from './MoviesSlider'
import classSet from 'classnames'

@connect(({Category}) => ({Category}))
class CategorySlider extends MoviesSlider {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    let {
      props: {categoryId, dispatch}
    } = this
    dispatch(CategoryActionCreators.getCategory(categoryId))
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
          </Slider> : <Spinner />}
      </div>
    )
  }
}

CategorySlider.propTypes = {
  categoryId: React.PropTypes.number
}

CategorySlider.defaultProps = {
  categoryId: null
}

export default CategorySlider
