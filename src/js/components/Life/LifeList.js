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

    return pins || (lifeTheme && lifeTheme.get('pins'))
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
    return spotList
  }

  renderInfiniteItem (index, key) {
    const pinsList = this.getPins()
    let data = pinsList.get(index)
    const spotList = this.getSpots()

    if (index % 3) {
      const randIndex = _.random(0, spotList.size)
      data = spotList.get(randIndex)
      return this.renderSpot({data, randIndex, key})
    }

    data = pinsList.get(index)
    return this.renderItem({data, index, key})

  }

  renderItem ({data, key, index, style}) {
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

  renderSpot ({data, key, index, style}) {
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
    if (!pinsList) {
      return
    }

    let spotList = this.getSpots()

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
      {spotList && spotList.map((data, index) =>this.renderSpot({
        data,
        index,
        key: `life-list-spot-${themeId}-${index}`

      })).toJS()}
    </div>)
  }
}

LifeList.propTypes = {
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
  highlightFirst: true,
  virtual: true,
  pins: null,
  spots: null,
  themeId: ''
}

export default LifeList
