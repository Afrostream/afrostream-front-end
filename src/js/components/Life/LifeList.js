import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classSet from 'classnames'
import Immutable from 'immutable'
import LifePin from './LifePin'
import LifeSpot from './LifeSpot'
import * as LifeActionCreators from '../../actions/life'
import _ from 'lodash'
import ReactList from 'react-list'
import {
  InfiniteLoader,
  AutoSizer,
  VirtualScroll,
  Grid,
  List,
  CellMeasurer,
  WindowScroller
} from 'react-virtualized'

if (process.env.BROWSER) {
  require('./LifeList.less')
}
@connect(({Life, User}) => ({Life, User}))
class LifeList extends Component {

  constructor (props) {
    super(props)
  }

  getPins () {
    const {
      props: {
        Life,
        themeId,
        pins
      }
    } = this

    const lifeTheme = Life.get(`life/themes/${themeId}`)

    const pinsList = pins || (lifeTheme && lifeTheme.get('pins')) || Immutable.fromJS([])
    const spotList = this.getSpots()

    //const listSize = (pinsList.size + Math.min(Math.round(pinsList.size / this.props.moduloSpots), spotList.size))
    let mergedList = pinsList
    pinsList.forEach((spot, index) => {
      const spotIndex = this.canInsertSpot(spotList, index)
      if (spotIndex) {
        const spot = spotList.get(spotIndex - 1)
        mergedList = mergedList.insert(index, spot)
      }
    })
    return mergedList
  }

  getSpots () {
    const {
      props: {
        Life,
        themeId,
        spots
      }
    } = this

    const lifeTheme = Life.get(`life/themes/${themeId}`)

    let spotList = spots || (lifeTheme && lifeTheme.get('spots'))

    if (spotList) {
      spotList = spotList.filter((spot) => {
        return spot.get('type') === 'banner'
      })
    }
    return spotList || Immutable.fromJS([])
  }

  canInsertSpot (spotList, index) {
    const listIndex = index + 1
    const spotIndex = Math.round(listIndex / this.props.moduloSpots)
    const hasMaxSpots = (spotIndex > spotList.size)

    return spotList && !((listIndex) % this.props.moduloSpots) && !hasMaxSpots && spotIndex
  }

  renderInfiniteItem (index, key) {
    const pinsList = this.getPins()
    const data = pinsList.get(index)
    const typeItem = data.get('type')
    switch (typeItem) {
      case 'spot':
      case 'banner':
        return this.renderSpot({data, index, key})
        break
    }
    return this.renderItem({data, index, key})

  }

  getRowHeight ({index}) {
    const pinsList = this.getPins()
    const block = pinsList.get(index)
    let firstEl
    if (block instanceof Immutable.Map) {
      firstEl = block
    }
    else {
      firstEl = block && block.get(0)
    }
    const typeItem = firstEl && firstEl.get('type')

    let heightEl = 500
    switch (typeItem) {
      case 'spot':
      case 'banner':
        heightEl = 300
        break
      default:
        break
    }
    return heightEl
  }

  renderCell ({columnIndex, key, rowIndex, style}) {
    return this.renderItem({index: rowIndex, key})
  }

  renderBlock (data, index, key) {
    const {
      props: {
        highlightFirst
      }
    } = this

    let sizes = [
      900,
      350
    ]

    if (!data || !data.size) {
      return <div className="brick" {...{key}}/>
    }
    //const index = columnIndex
    const imageWidth = highlightFirst ? sizes[Math.min(index, 1)] : sizes[1]
    const showBubble = !index
    const typeItem = data.get('type')

    switch (typeItem) {
      case 'spot':
      case 'banner':
        return <LifeSpot {...{data, key}} {...this.props} />
        break
      default:
        return <LifePin {...{data, imageWidth, showBubble, key, index}} {...this.props} />
        break
    }
  }

  renderItem ({index, key}) {

    const pinsList = this.getPins()
    const data = pinsList && pinsList.get(index)
    if (data instanceof Immutable.Map) {
      return this.renderBlock(data, index, key)
    }
    return (
      <div className="block" {...{key}} >{data.map((item, k) => {
        return this.renderBlock(item, index, k)
      })}</div>
    )
  }


  renderSpot ({data, key}) {
    return (
      <LifeSpot {...{data, key}} {...this.props} />
    )
  }


  isRowLoaded ({index}) {
    const pinsList = this.getPins()
    const isLoaded = pinsList && !!pinsList.get(index)
    console.log('isRowLoaded : ', index, isLoaded)
    return isLoaded
  }

  loadMoreRows ({startIndex, stopIndex}) {

    const {
      props: {
        dispatch,
        themeId
      }
    } = this

    return dispatch(LifeActionCreators.fetchPins({startIndex: startIndex, stopIndex}))
  }

  render () {
    const {
      props: {
        virtual,
        themeId,
        highlightFirst
      }
    } = this

    const pinsList = this.getPins()

    const classList = {
      'life-list': true,
      'hightlight-first': highlightFirst,
      //'flat': !virtual,
      //'virtual': virtual
    }

    if (!pinsList) {
      return <div />
    }

    return (
      <div className={classSet(classList)}>
        <WindowScroller>
          {({height, isScrolling, scrollTop}) => (
            <InfiniteLoader
              isRowLoaded={::this.isRowLoaded}
              loadMoreRows={::this.loadMoreRows}
              rowCount={300000}>
              {({onRowsRendered, registerChild}) => (
                <AutoSizer disableHeight>
                  {({width}) => (
                    /*<CellMeasurer
                     cellRenderer={::this.renderCell}
                     columnCount={1}
                     rowCount={pinsList.size}
                     width={width}
                     >
                     {({getRowHeight, getColumnWidth}) => (
                     <Grid
                     cellRenderer={::this.renderCell}
                     columnWidth={getColumnWidth}
                     columnCount={1}
                     overscanColumnCount={0}
                     overscanRowCount={0}
                     rowCount={pinsList.size}
                     rowHeight={getRowHeight}
                     autoHeight
                     height={height}
                     width={width}
                     />*/
                    <List
                      ref={registerChild}
                      onRowsRendered={onRowsRendered}
                      rowRenderer={::this.renderItem}
                      rowCount={pinsList.size}
                      rowHeight={500}
                      height={height}
                      autoHeight
                      width={width}
                    />
                    /*)}
                     </CellMeasurer>*/
                  )}
                </AutoSizer>
              )}
            </InfiniteLoader>
          )}
        </WindowScroller>
      </div>
    )
  }
}

LifeList.propTypes = {
  isCurrentUser: PropTypes.bool,
  moduloSpots: PropTypes.number,
  highlightFirst: PropTypes.bool,
  virtual: PropTypes.bool,
  pins: PropTypes.instanceOf(Immutable.List),
  spots: PropTypes.instanceOf(Immutable.List),
  themeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}


LifeList.defaultProps = {
  isCurrentUser: false,
  moduloSpots: 3,
  highlightFirst: true,
  virtual: true,
  pins: null,
  spots: null,
  themeId: ''
}

export default LifeList
