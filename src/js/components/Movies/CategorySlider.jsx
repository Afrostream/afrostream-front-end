import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { prepareRoute } from '../../decorators'
import * as CategoryActionCreators from '../../actions/category'
import { ArrowStepper } from '../Slider'
import MoviesSlider from './MoviesSlider'
import classSet from 'classnames'
import { AutoSizer, ColumnSizer, Grid } from 'react-virtualized'

@prepareRoute(async function ({store, categoryId}) {
  store.dispatch(CategoryActionCreators.getCategory(categoryId))
})
@connect(({Category}) => ({Category}))
class CategorySlider extends MoviesSlider {

  constructor (props) {
    super(props)
  }

  getColumnWidth ({index}) {
    const {
      props: {
        categoryId,
        Category
      }
    } = this

    const category = Category.get(`categorys/${categoryId}`)
    const dataList = category.get('mergeSpotsWithMovies')
    let data = dataList.get(index)
    return data.size === 1 ? 240 : 160
  }

  renderItem ({columnIndex, rowIndex}) {
    const {
      props: {
        categoryId,
        Category
      }
    } = this

    const category = Category.get(`categorys/${categoryId}`)
    const dataList = category.get('mergeSpotsWithMovies')
    let data = dataList.get(columnIndex)
    if (data instanceof Immutable.Map) {
      return this.renderBlock(data)
    }
    return (
      <div className="block" key={`data-block-${columnIndex}`}>{data.map((item)=> {
        return this.renderBlock(item)
      }).toJS()}</div>
    )
  }

  render () {
    const {
      props: {
        Category,
        categoryId,
        label,
        slug
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
          <AutoSizer className="slider-container" disableHeight>
            {({width}) => (
              <ColumnSizer
                ref="reactList"
                cellSizeAndPositionGetter={::this.getRowHeight}
                columnMaxWidth={240}
                columnMinWidth={160}
                columnCount={dataList.size}
                width={width}>
                {({adjustedWidth, getColumnWidth, registerChild, columnCount}) => (
                  <ArrowStepper columnCount={dataList.size}>
                    {({onScroll, columnCount, scrollLeft}) => (
                      <Grid
                        ref="reactGrid"
                        cellRenderer={::this.renderItem}
                        columnWidth={::this.getColumnWidth}
                        columnCount={columnCount}
                        rowHeight={listClass.spots ? 440 : 220}
                        height={listClass.spots ? 440 : 220}
                        rowCount={1}
                        onScroll={onScroll}
                        scrollLeft={scrollLeft}
                        width={adjustedWidth}
                      />
                    )}
                  </ArrowStepper>
                )}
              </ColumnSizer>
            )}
          </AutoSizer>
          : null}
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
