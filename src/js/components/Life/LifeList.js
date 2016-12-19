import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classSet from 'classnames'
import Immutable from 'immutable'
import Spinner from '../Spinner/Spinner'
import LifePin from './LifePin'
import LifeSpot from './LifeSpot'
import * as LifeActionCreators from '../../actions/life'
import _ from 'lodash'
import ReactList from 'react-list'

if (process.env.BROWSER) {
  require('./LifeList.less')
}
@connect(({Life, User}) => ({Life, User}))
class LifeList extends Component {

  constructor (props) {
    super(props)
    this.pending = []
    this.isLoading = false
  }

  getPins () {
    const {
      props: {
        Life,
        themeId,
        pins
      }
    } = this

    //const lifeTheme = Life.get(`life/pins/${themeId}`)
    //
    //const pinsList = pins || (lifeTheme && lifeTheme.get('pins')) || Immutable.fromJS([])
    //const spotList = this.getSpots()

    //const listSize = (pinsList.size + Math.min(Math.round(pinsList.size / this.props.moduloSpots), spotList.size))
    let mergedList = pins
    //pinsList.forEach((spot, index) => {
    //  const spotIndex = this.canInsertSpot(spotList, index)
    //  if (spotIndex) {
    //    const spot = spotList.get(spotIndex - 1)
    //    mergedList = mergedList.insert(index, spot)
    //  }
    //})
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

    let spotList = spots

    //let spotList = spots || (lifeTheme && lifeTheme.get('spots'))

    if (spotList) {
      spotList = spotList.filter((spot) => {
        return spot.get('type') === 'banner'
      })
    }

    return spotList || Immutable.fromJS([])
  }

  canInsertSpot (spotList, index) {
    const firstPage = Number(index <= this.props.moduloSpots)
    const listIndex = index + 1
    const spotIndex = Math.round(listIndex / this.props.moduloSpots)
    const hasMaxSpots = (spotIndex > spotList.size)

    return spotList && !((listIndex + firstPage) % this.props.moduloSpots) && !hasMaxSpots && spotIndex
  }

  renderInfiniteItem (index, key) {
    const pinsList = this.getPins()
    const data = pinsList.get(index)

    if (!data) {
      this.fetchPins(index)
      return <div className="brick" {...{key}} />
    }

    const typeItem = data.get('type')
    switch (typeItem) {
      case 'spot':
      case 'banner':
        return this.renderSpot({data, index, key})
        break
    }
    return this.renderItem({data, index, key})

  }

  renderItem ({data, key, index}) {
    const {
      props: {
        highlightFirst
      }
    } = this

    let sizes = [
      900,
      350
    ]

    const imageWidth = highlightFirst ? sizes[Math.min(index, 1)] : sizes[1]
    const showBubble = !index
    return (
      <LifePin {...{data, imageWidth, showBubble, key, index}} {...this.props} />
    )
  }

  renderSpot ({data, key}) {
    return (
      <LifeSpot {...{data, key}} {...this.props} />
    )
  }

  fetchPins (index) {
    const {
      props: {
        dispatch,
        themeId
      }
    } = this

    if (this.isLoading) return
    this.isLoading = true
    return dispatch(LifeActionCreators.fetchPins({themeId, offset: index}))
      .then(() => {
        this.isLoading = false
      })
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
      'flat': !virtual,
      'virtual': virtual
    }

    return (<div className={classSet(classList)}>
      {!virtual && pinsList.map((data, index) => this.renderItem({
        data,
        index,
        key: `life-list-theme-${themeId}-${index}`

      })).toJS()}
      {virtual && <ReactList
        ref="react-pins-list"
        axis="y"
        itemRenderer={::this.renderInfiniteItem}
        items={pinsList}
        length={pinsList.size + 1}
        type={'simple'}
      />}
    </div>)
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
  moduloSpots: 6,
  highlightFirst: true,
  virtual: true,
  pins: null,
  spots: null,
  themeId: ''
}

export default LifeList
