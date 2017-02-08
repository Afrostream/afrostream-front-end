import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { ArrowStepper } from '../Slider'
import Thumb from '../Movies/Thumb'
import ReactList from 'react-list'
import { AutoSizer, ColumnSizer, VirtualScroll, Grid, Collection } from 'react-virtualized'
import { I18n } from '../Utils'
import { Link } from 'react-router'

if (process.env.BROWSER) {
  require('./MoviesSlider.less')
}

class MoviesSlider extends I18n {

  constructor (props, context) {
    super(props, context)
  }

  static propTypes = {
    dataList: PropTypes.instanceOf(Immutable.List),
    columnMaxWidth: React.PropTypes.number,
    columnMinWidth: React.PropTypes.number,
    preload: React.PropTypes.bool,
    virtual: React.PropTypes.bool,
    favorite: React.PropTypes.bool,
    share: React.PropTypes.bool,
    selectedId: React.PropTypes.string,
    label: React.PropTypes.string,
    slug: React.PropTypes.string,
    axis: React.PropTypes.string,
    className: React.PropTypes.string,
    rowHeight: React.PropTypes.number
  }

  static defaultProps = {
    selectedId: null,
    columnMaxWidth: 240,
    columnMinWidth: 210,
    label: '',
    slug: '',
    axis: 'x',
    className: 'movies-data-list',
    rowHeight: 200,
    virtual: false,
    preload: true,
    share: false,
    favorite: true
  }

  getType (data) {

    let resultType = data.get('type')

    switch (resultType) {
      case 'image':
      case 'event':
      case 'audio':
      case 'rich':
      case 'video':
      case 'website':
      case 'article':
        resultType = 'pin'
        break
      default:
        break
    }

    return resultType
  }

  renderBlock (data) {
    let isPin = this.getType(data) === 'pin'
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

    if (isPin) {
      params = {
        thumbW: 620,
        thumbH: 250,
        type: 'pin',
        fit: 'min',
        crop: 'face'
      }
    }

    return (
      <Thumb
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

  renderIndex (index) {
    return this.renderItem({columnIndex: index})
  }

  renderCell ({index}) {
    return this.renderItem({columnIndex: index})
  }

  renderItem ({columnIndex}) {
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
      <div className="block" key={`data-block-${columnIndex}`}>{data.map((item) => {
        return this.renderBlock(item)
      })}</div>
    )
  }

  render () {
    const {
      props: {
        virtual,
        dataList,
        selectedId,
        label,
        slug,
        axis,
        rowHeight
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

    if (!virtual) {
      return (
        <div className={this.props.className}>
          {slug ? <div id={slug} className="movies-list__anchor"/> : ''}
          {label ? <div className="movies-list__selection">{this.getTitle(label)}</div> : ''}
          <div className="slider-container">
            <ReactList
              ref="react-list"
              initialIndex={index}
              axis={this.props.axis}
              itemRenderer={::this.renderIndex}
              length={dataList.size}
              type={'uniform'}
              pageSize={Infinity}
            />
          </div>
        </div>
      )
    }
    return (
      <div className={this.props.className}>
        {slug && <div id={slug} className="movies-list__anchor"/> }
        {slug && <Link to={`/${slug}`} className="movies-list__selection">{this.getTitle(label)}</Link>}
        {!slug && label && <div className="movies-list__selection">{this.getTitle(label)}</div> }

        <AutoSizer className="slider-container" disableHeight>
          {({width}) => (
            <ColumnSizer
              ref="react-list"
              {...this.props}
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
                      rowHeight={rowHeight}
                      height={rowHeight}
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
