import React from 'react'
import Immutable from 'immutable'
import shallowEqual from 'react-pure-render/shallowEqual'
import { prepareRoute, prepareStatic } from '../../../decorators'
import { connect } from 'react-redux'
import classSet from 'classnames'
import Thumb from '../../../components/Movies/Thumb'
import * as CategoryActionCreators from '../../../actions/category'
import _ from 'lodash'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

if (process.env.BROWSER) {
  require('./Spots.less')
}

@prepareRoute(async function ({store}) {
  return store.dispatch(CategoryActionCreators.getAllSpots())
})
@prepareStatic('components/categorys/spots')
@connect(({Category}) => ({Category}))
class Spots extends React.Component {

  state = {
    spotsList: null
  }

  constructor (props) {
    super(props)
    this.updateSpotInterval_ = 0
    this.spotsList_ = null
    this.uniqSpots_ = null
  }

  spotsList (list) {
    this.spotsList_ = list
    clearInterval(this.updateSpotInterval_)
    this.updateSpot()
    if (canUseDOM) {
      this.updateSpotInterval_ = setInterval(::this.updateSpot, 500)
    }
  }

  updateSpot () {
    const diffList = _.difference(this.uniqSpots_, this.spotsList_)
    if (diffList.length) {
      const randomIndex = Math.floor(Math.random() * this.spotsList_.length)
      const movieRandItem = _.sample(diffList)
      this.spotsList_.splice(randomIndex, 1, movieRandItem)
    }
    else {
      clearInterval(this.updateSpotInterval_)
    }
    this.setState({
      spotsList: Immutable.fromJS(this.spotsList_)
    })
  }

  componentWillReceiveProps (nextProps) {
    const {
      props: {
        Category
      }
    } = this

    if (!shallowEqual(Category.get('categorys/spots'), nextProps.Category.get('categorys/spots'))) {

      const categories = nextProps.Category.get('categorys/spots')

      if (!categories) {
        return
      }

      let recoList = []
      categories.map((categorie) => {
        let catMovies = categorie.get('adSpots')
        if (catMovies) {
          recoList = _.concat(recoList, catMovies.toJS())
        }
      })

      this.uniqSpots_ = _.uniqBy(recoList, '_id')
      //get only 8 mea
      if (this.uniqSpots_.length < this.props.limit) {
        return
      }
      this.spotsList(_.sampleSize(this.uniqSpots_, this.props.limit))
    }

  }

  renderMovie (data, index) {
    let dataId = data.get('_id')

    const middleItem = index === Math.floor(this.props.limit * 0.5)
    const multiplicate = (1 + Number(Boolean(middleItem)))

    let params = {
      thumbW: 240 * multiplicate,
      thumbH: 340 * multiplicate
    }

    return (
      <ReactCSSTransitionGroup transitionName="thumbs"
                               className="spot-thumb"
                               transitionEnter={true}
                               transitionLeave={true}
                               key={`data-thumb-${dataId}-${index}`}
                               transitionEnterTimeout={300}
                               transitionLeaveTimeout={300} component="div">
        <Thumb
          favorite={false}
          share={false}
          preload={false}
          id={dataId}
          {...params}
          {...this.props}
          {...{data, dataId}}  />
      </ReactCSSTransitionGroup>)
  }

  /**
   * render two rows of thumbnails for the payment pages
   */
  render () {

    if (!this.state.spotsList) {
      return (<div />)
    }

    const listClass = {
      'movies-data-list': true,
      'spots': true
    }


    return (
      <div className="container-fluid no-padding spots-list">
        <div className={classSet(listClass)}>
          {this.state.spotsList.map((movie, i) => this.renderMovie(movie, i)).toJS()}
        </div>
      </div>
    )

  }
}

Spots.propsTypes = {
  limit: React.PropTypes.number
}

Spots.defaultProps = {
  limit: 13
}

export default Spots
