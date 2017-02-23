import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from '../Utils'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { prepareRoute } from '../../decorators'
import * as CategoryActionCreators from '../../actions/category'
import { ArrowStepper } from '../Slider'
import MoviesSlider from './MoviesSlider'
import classSet from 'classnames'
import { AutoSizer, ColumnSizer, Grid } from 'react-virtualized'
import ReactList from 'react-list'
import {
  intlShape,
  injectIntl
} from 'react-intl'


@prepareRoute(async function ({store, categoryId}) {
  store.dispatch(CategoryActionCreators.getCategory(categoryId))
})
@connect(({Category, Event}) => ({Category, Event}))
class CategorySlider extends MoviesSlider {

  constructor (props) {

    super(props)
  }

  getColumnWidth ({index, getWidth}) {
    const {
      props: {
        categoryId,
        Category,
        Event
      }
    } = this

    const category = Category.get(`categorys/${categoryId}`)
    const dataList = category.get('mergeSpotsWithMovies')
    const data = dataList.get(index)
    const isMobile = Event.get('isMobile')
    if (isMobile) {
      return getWidth()
    }
    if (data instanceof Immutable.Map) {
      let isAdSpot = data.get('adSpot')
      return isAdSpot ? 480 : 240
    }
    return data.size === 1 ? 240 : 240
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
      <div className="block" key={`data-block-${columnIndex}`}>{data.map((item) => {
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
        slug,
        virtual
      }
    } = this
    //console.log('render category : ', categoryId)
    let listClass = {
      'movies-data-list': true,
      'spots': false
    }

    let dataList
    let catSlug

    const category = Category.get(`categorys/${categoryId}`)

    if (category) {
      dataList = category.get('mergeSpotsWithMovies')
      catSlug = category.get('slug')

      //check if list has one spot
      dataList.map((item) => {
        if (item instanceof Immutable.Map) {
          return
        }
        const findSpot = item.find((movie) => {
          return movie.get('adSpot')
        })
        if (findSpot) {
          listClass.spots = findSpot
        }
      })
    }

    return (
      <div className={classSet(listClass)}>
        {slug && <div id={slug} className="movies-list__anchor"/>}
        {label && <Link to={`/category/${categoryId}/${catSlug}`} className="movies-list__selection">{label}</Link>}
        {!virtual && <ReactList
          ref="reactList"
          axis={`x`}
          itemRenderer={(index) => ::this.renderItem({columnIndex: index})}
          length={dataList.size}
          type={'uniform'}
          pageSize={Infinity}
        />}
        {virtual && category && dataList ?
          <AutoSizer className="slider-container" disableHeight>
            {({width}) => (
              <ColumnSizer
                ref="reactList"
                cellSizeAndPositionGetter={::this.getRowHeight}
                columnMaxWidth={480}
                columnMinWidth={240}
                columnCount={dataList.size}
                width={width}>
                {({adjustedWidth, getColumnWidth, registerChild, columnCount}) => (
                  <ArrowStepper columnCount={dataList.size}>
                    {({onScroll, columnCount, scrollLeft}) => (
                      <Grid
                        ref={registerChild}
                        cellRenderer={::this.renderItem}
                        columnWidth={({index}) => this.getColumnWidth({index, getWidth: getColumnWidth})}
                        columnCount={columnCount}
                        rowHeight={335}
                        height={335}
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
  categoryId: React.PropTypes.number,
  intl: intlShape.isRequired,
  virtual: React.PropTypes.bool
}

CategorySlider.defaultProps = {
  categoryId: null,
  virtual: true
}

export default injectIntl(CategorySlider)
