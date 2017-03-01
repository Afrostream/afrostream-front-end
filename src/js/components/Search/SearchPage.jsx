import React, { PropTypes }  from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import config from '../../../../config'
import { Link, I18n } from '../Utils'
import * as SearchActionCreators from '../../actions/search'
import * as UserActionCreators from '../../actions/user'
import Spinner from '../Spinner/Spinner'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import shallowEqual from 'react-pure-render/shallowEqual'
import MoviesSlider from '../Movies/MoviesSlider'
import ReactImgix from '../Image/ReactImgix'
import LifeList from '../Life/LifeList'
import { withRouter } from 'react-router'
import { extractImg } from '../../lib/utils'

import {
  intlShape,
  injectIntl
} from 'react-intl'


const {search} = config

if (process.env.BROWSER) {
  require('./SearchPage.less')
}

@prepareRoute(async function ({store}) {
  return store.dispatch(UserActionCreators.getFavorites('movies'))
})

@connect(({Search, User}) => ({Search, User}))
class SearchPage extends I18n {

  constructor (props, context) {
    super(props, context)
  }

  componentDidMount () {
    this.search()
  }

  componentWillReceiveProps (nextProps) {
    const {
      props: {location},
    } = this

    if (!shallowEqual(nextProps.location, location)) {
      this.search(nextProps.location.query.search)
    }
  }

  search (value) {
    const {
      props: {dispatch, location}
    } = this

    let search = value || location.query.search

    if (!search || search.length < 3) {
      return
    }

    dispatch(SearchActionCreators.fetchAll(search))
  }

  renderMovies (movies) {

    if (!movies || !movies.size) {
      return
    }

    return (<div key={`search-movie`} className="col-md-6">
      <MoviesSlider {...this.props} favorite={false} dataList={movies} axis="y"/>
    </div>)

  }

  renderActors (actors) {
    if (!actors || !actors.size) {
      return
    }

    return (
      <div key={`search-actors`} className="col-md-2">
        {actors.map((actor, i) => {

          const imageUrl = extractImg({data: actor, key: 'picture', width: 200})
          const actorName = `${actor.get('firstName')} ${actor.get('lastName')}`
          return ( <Link key={`search-actor-${i}`} to="recherche"
                         query={{search: actorName}}
                         className="actors">
            {imageUrl &&
            <div className="image-actor"><ReactImgix className="avatar-card__background_image" src={`${imageUrl}`}
                                                     bg={true}
                                                     onError={this.onError} alt="user-avatar"/></div>}
            <div className="actor-name">{actorName}</div>
          </Link>)
        })
        }
      </div>
    )
  }

  renderPins (pins, full) {
    if (!pins || !pins.size) {
      return
    }

    return (
      <div key={`search-pins`} className={`col-md-${full && 10 || 4}`}>
        <LifeList highlightFirst={false} over={false} {...this.props} {...{pins}}/>
      </div>
    )
  }

  renderRows () {
    const {
      props: {Search, User}
    } = this

    const searchFetched = Search.get(`search`)
    const user = User.get(`user`)
    let authorized
    let planCode
    let canShowMovies = false
    if (user) {
      authorized = user.get('authorized') && user.get('planCode')
      planCode = user.get('planCode')
      const subscriptionsStatus = user.get('subscriptionsStatus')
      if (subscriptionsStatus) {
        const subscriptions = subscriptionsStatus.get('subscriptions')
        canShowMovies = Boolean(subscriptions && subscriptions.filter((a) => a.get('isActive') === 'yes').size)
      }
    }


    if (!searchFetched) {
      return
    }

    const searchRows = searchFetched && searchFetched.get('rows')

    if (!searchRows || !searchRows.size) {
      return this.state.fetching ? '' : this.getTitle('search.noData')
    }

    return searchRows && searchRows.map((search) => {
        switch (search.get('index')) {
          case process.env.NODE_ENV + '_Movie':
            return canShowMovies && this.renderMovies(search.get('hits'))
            break
          case process.env.NODE_ENV + 'LifePin':
            return this.renderPins(search.get('hits'), !canShowMovies)
            break
          case process.env.NODE_ENV + 'Actor':
            return this.renderActors(search.get('hits'))
            break
        }
      })
  }

  render () {
    const {
      props: {Search}
    } = this

    const fetching = Search.get(`fetching`)

    return (
      <ReactCSSTransitionGroup transitionName="search" className="row-fluid search-page" transitionEnterTimeout={300}
                               transitionLeaveTimeout={300} component="div">
        <div className="search-result row">
          {fetching && <div className="spinner-search"><Spinner /></div>}
          {this.renderRows()}
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

SearchPage.propTypes = {
  location: React.PropTypes.object.isRequired,
  intl: intlShape.isRequired
}

export default withRouter(injectIntl(SearchPage))
