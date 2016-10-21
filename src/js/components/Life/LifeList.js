import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import * as EventActionCreators from '../../actions/event'
import classSet from 'classnames'
import Immutable from 'immutable'
import LifePin from './LifePin'
import ReactList from 'react-list'

if (process.env.BROWSER) {
  require('./LifeList.less')
}
//@prepareRoute(async function ({store, params:{themeId}}) {
//  return await Promise.all([
//    store.dispatch(EventActionCreators.pinHeader(true)),
//    store.dispatch(LifeActionCreators.fetchThemes(themeId))
//  ])
//})
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

    const lifeTheme = Life.get(`life/themes/${themeId}`
    )

    return pins || (lifeTheme && lifeTheme.get('pins'))
  }

  renderInfiniteItem (index, key) {
    const pinsList = this.getPins()
    const data = pinsList.get(index)
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
  highlightFirst: PropTypes.bool,
  virtual: PropTypes.bool,
  pins: PropTypes.instanceOf(Immutable.List),
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
  themeId: ''
}

export default LifeList
