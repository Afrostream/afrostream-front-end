import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { ArrowStepper } from '../Slider/'
import Thumb from '../Movies/Thumb'
import { AutoSizer, ColumnSizer, Grid } from 'react-virtualized'

if (process.env.BROWSER) {
  require('./MoviesSlider.less')
}

class MoviesSlider extends React.Component {

  static propTypes = {
    dataList: PropTypes.instanceOf(Immutable.List),
    selectedId: React.PropTypes.string,
    label: React.PropTypes.string,
    slug: React.PropTypes.string,
    axis: React.PropTypes.string,
    className: React.PropTypes.string
  }

  static defaultProps = {
    selectedId: null,
    label: '',
    slug: '',
    axis: 'x',
    className: 'movies-data-list'
  }

  renderBlock (data) {
    let isAdSpot = data.get('adSpot')
    let dataId = data.get('_id')
    let params = {}
    if (isAdSpot) {

      params = {
        thumbW: 240,
        thumbH: 465,
        type: 'spot',
        fit: 'min',
        crop: 'face'
      }
    }

    return (
      <Thumb
        preload={true}
        id={dataId}
        key={`data-thumb-${dataId}`}
        {...params} {...this.props} {...{data, dataId}}  />
    )
  }

  getRowHeight ({index}) {
    const {
      props: {
        dataList
      }
    } = this

    let data = dataList.get(index)
    if (data instanceof Immutable.Map) {
      return 240
    }
    return 465
  }

  renderItem ({columnIndex, rowIndex}) {
    const {
      props: {
        dataList
      }
    } = this

    let data = dataList.get(columnIndex)
    if (data instanceof Immutable.Map) {
      return this.renderBlock(data)
    }
    return (
      <div className="block" key={`data-block-${columnIndex}`}>{data.map((item)=> {
        return this.renderBlock(item)
      })}</div>
    )
  }

  render () {
    const {
      props: {
        dataList,
        selectedId,
        label,
        slug
      }
    } = this

    if (!dataList || !dataList.size) {
      return (<div/>)
    }

    let index = null

    //Si on a un episode ou movie dans les params url, on scroll to this point
    if (selectedId) {
      index = dataList.findIndex((obj) => {
        return obj.get('_id') == selectedId
      })
    }

    return (
      <div className={this.props.className}>
        {slug ? <div id={slug} className="movies-list__anchor"/> : ''}
        {label ? <div className="movies-list__selection">{label}</div> : ''}
        <AutoSizer className="slider-container" disableHeight>
          {({width}) => (
            <ColumnSizer
              ref="react-list"
              columnMaxWidth={210}
              columnMinWidth={210}
              columnCount={dataList.size}
              width={width}>
              {({adjustedWidth, getColumnWidth, registerChild}) => (
                <ArrowStepper columnCount={dataList.size}>
                  {({onScroll, columnCount, scrollLeft}) => (
                    <Grid
                      ref={registerChild}
                      cellRenderer={::this.renderItem}
                      columnWidth={getColumnWidth}
                      columnCount={columnCount}
                      rowHeight={200}
                      height={200}
                      rowCount={1}
                      onScroll={onScroll}
                      scrollLeft={scrollLeft}
                      width={adjustedWidth}
                      scrollToColumn={index}
                    />
                  )}
                </ArrowStepper>
              )}
            </ColumnSizer>
          )}
        </AutoSizer>
      </div>
    )
  }
}

export default MoviesSlider
