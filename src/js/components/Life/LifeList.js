import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classSet from 'classnames'
import Immutable from 'immutable'
import LifePin from './LifePin'
import _ from 'lodash'
import ReactList from 'react-list'
import { extractImg } from '../../lib/utils'
import { Link } from '../Utils'

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

    const pinsList = pins || (lifeTheme && lifeTheme.get('pins')) || Immutable.fromJs([])
    const spotList = this.getSpots()

    //const listSize = (pinsList.size + Math.min(Math.round(pinsList.size / this.props.moduloSpots), spotList.size))
    let mergedList = pinsList
    pinsList.forEach((spot, index)=> {
      const canInsertSpot = this.canInsertSpot(spotList, index)
      if (canInsertSpot) {
        const randIndex = _.random(0, spotList.size - 1)
        const spot = spotList.get(randIndex)
        mergedList = mergedList.insert(index, spot);
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
      spotList = spotList.filter((spot)=> {
        return spot.get('type') === 'banner'
      })
    }
    return spotList || Immutable.fromJs([])
  }

  canInsertSpot (spotList, index) {
    const firstPage = Number(index <= this.props.moduloSpots)
    const listIndex = index + 1
    const hasMaxSpots = ((listIndex / this.props.moduloSpots) >= spotList.size)
    return spotList && !((listIndex + firstPage) % this.props.moduloSpots) && !hasMaxSpots
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
      <LifePin {...{data, imageWidth, showBubble, key}} {...this.props} />
    )
  }

  renderSpot ({data, key}) {
    const imageUrl = extractImg({data, key: 'image'})
    return (
      <Link {...{key}} to={data.get('targetUrl')}>
        <img className="life-spot spot-banner" src={imageUrl}/>
      </Link>
    )
  }

  render () {
    const {
      props: {
        virtual,
        themeId
      }
    } = this
    const pinsList = this.getPins()

    const classList = {
      'life-list': true,
      'flat': !virtual,
      'virtual': virtual
    }

    return (<div className={classSet(classList)}>
      {!virtual && pinsList.map((data, index) =>this.renderItem({
        data,
        index,
        key: `life-list-theme-${themeId}-${index}`

      })).toJS()}
      {virtual && <ReactList
        ref="react-pins-list"
        axis="y"
        itemRenderer={::this.renderInfiniteItem}
        length={pinsList.size}
        type={'simple'}
      />}
    </div>)
  }
}

LifeList.propTypes = {
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
  moduloSpots: 6,
  highlightFirst: true,
  virtual: true,
  pins: null,
  spots: null,
  themeId: ''
}

export default LifeList
