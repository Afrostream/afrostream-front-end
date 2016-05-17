import React from 'react'
import { prepareRoute } from '../../decorators'
import * as VideoActionCreators from '../../actions/video'
import * as MovieActionCreators from '../../actions/movie'
import * as SeasonActionCreators from '../../actions/season'
import * as EventActionCreators from '../../actions/event'
import * as PlayerActionCreators from '../../actions/player'
import * as UserActionCreators from '../../actions/user'
import * as CategoryActionCreators from '../../actions/category'
import * as EpisodeActionCreators from '../../actions/episode'
import PlayerComponent from './PlayerComponent'

@prepareRoute(async ({store, params: {movieId, seasonId, episodeId, videoId}}) => {
  await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(EventActionCreators.showChat(false)),
    store.dispatch(PlayerActionCreators.getConfig()),
    store.dispatch(CategoryActionCreators.getAllSpots())
  ])

  if (movieId && movieId !== 'undefined') {
    await store.dispatch(MovieActionCreators.getMovie(movieId))
  }

  if (seasonId && seasonId !== 'undefined') {
    await store.dispatch(SeasonActionCreators.getSeason(seasonId))
  }

  if (episodeId && episodeId !== 'undefined') {
    await store.dispatch(EpisodeActionCreators.getEpisode(episodeId))
  }

  if (videoId && videoId !== 'undefined') {
    await store.dispatch(VideoActionCreators.getVideo(videoId))
  }

  return await Promise.all([
    store.dispatch(UserActionCreators.getFavorites('movies')),
    store.dispatch(UserActionCreators.getFavorites('episodes'))
  ])
})
class PlayerPage extends React.Component {

  render () {
    const {
      props: {
        params: {videoId, movieId, seasonId, episodeId}
      }
    } = this

    return (
      <div className="row-fluid player-page">
        {videoId && movieId ? <PlayerComponent {...{videoId, movieId, seasonId, episodeId}} {...this.props}/> : ''}
      </div>
    )
  }
}

export default PlayerPage
