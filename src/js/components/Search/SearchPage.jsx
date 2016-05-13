import React, { PropTypes }  from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import { search, dict } from '../../../../config'
import { Link } from 'react-router'
import _ from 'lodash'
import * as SearchActionCreators from '../../actions/search'
import * as UserActionCreators from '../../actions/user'
import Spinner from '../Spinner/Spinner'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import shallowEqual from 'react-pure-render/shallowEqual'
import MoviesSlider from '../Movies/MoviesSlider'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./SearchPage.less')
}

@prepareRoute(async function ({store}) {
  return store.dispatch(UserActionCreators.getFavorites('movies'))
})

@connect(({Search}) => ({Search}))
class SearchPage extends React.Component {

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

    dispatch(SearchActionCreators.fetchMovies(search))
  }

  renderMovies (movies, fetching) {
    if (!movies || !movies.size) {
      return fetching ? '' : dict().search['noData']
    }

    return <MoviesSlider key={`search-movie`} dataList={movies} axis="y"/>

  }

  renderActors (movies) {
    if (!movies || !movies.size) {
      return ''
    }

    let moviesJs = movies.toJS()
    let flatActors = _.flatten(_.map(moviesJs, (movie) => {
      return movie.actors
    }))
    let uniqActors = _.uniq(_.map(flatActors, (actor) => {
      return `${actor.firstName} ${actor.lastName}`
    }))

    let actors = _.take(_.map(uniqActors, ((actor, i) =><Link key={`search-actor-${i}`} to="recherche"
                                                              query={{search:actor}}
                                                              className="actors">{`${actor}`}</Link>)), 10)
    return (
      <div>
        {actors}
      </div>
    )
  }

  render () {
    const {
      props: {Search}
    } = this

    const moviesFetched = Search.get(`search`)
    const moviesFetching = Search.get(`fetching`)

    let hits
    let movies
    let actors
    if (moviesFetched) {
      hits = moviesFetched.get('hits')
      movies = this.renderMovies(hits, moviesFetching)
      actors = this.renderActors(hits)
    }

    return (
      <ReactCSSTransitionGroup transitionName="search" className="row-fluid search-page" transitionEnterTimeout={300}
                               transitionLeaveTimeout={300} component="div">
        <div className="search-result">
          {moviesFetching ? <div className="spinner-search"><Spinner /></div> : ''}
          {actors}
          {movies}
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

SearchPage.propTypes = {
  location: React.PropTypes.object.isRequired
}

export default withRouter(SearchPage)
