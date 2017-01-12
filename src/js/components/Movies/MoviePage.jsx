import React from 'react'
import { prepareRoute } from '../../decorators'
import * as MovieActionCreators from '../../actions/movie'
import * as EventActionCreators from '../../actions/event'
import * as UserActionCreators from '../../actions/user'
import MovieInfo from './MovieInfo'
import SeasonList from '../Seasons/SeasonList'

@prepareRoute(async function ({store, params: {movieId, seasonId, episodeId}}) {
  await Promise.all([
    store.dispatch(EventActionCreators.userActive(true))
  ])

  if (movieId && movieId !== 'undefined') {
    await Promise.all([
      store.dispatch(MovieActionCreators.getMovie(movieId)),
      store.dispatch(MovieActionCreators.getSeason(movieId))
    ])
  }

  return await Promise.all([
    store.dispatch(UserActionCreators.getFavorites('movies')),
    store.dispatch(UserActionCreators.getFavorites('episodes'))
  ])
})
class MoviePage extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      props: {
        params: {movieId},
        children
      }
    } = this

    const dataId = movieId

    if (children) {
      return children
    }
    return (
      <div className="row-fluid">
        {movieId ? <MovieInfo maxLength={550} active={true} load={true} showBtn={false} {...{dataId}}/> : ''}
        {movieId ? <SeasonList {...this.props}/> : ''}
      </div>
    )
  }
}

export default MoviePage
