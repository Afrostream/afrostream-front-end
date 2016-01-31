import React from 'react';
import { prepareRoute } from '../../decorators';
import * as VideoActionCreators from '../../actions/video';
import * as MovieActionCreators from '../../actions/movie';
import * as SeasonActionCreators from '../../actions/season';
import * as EventActionCreators from '../../actions/event';
import * as PlayerActionCreators from '../../actions/player';
import * as UserActionCreators from '../../actions/user';
import PlayerComponent from './PlayerComponent';

@prepareRoute(async function ({ store, params: { movieId,movieSlug,seasonId,seasonSlug,episodeId,episodeSlug, videoId } }) {
  await * [
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(PlayerActionCreators.getConfig()),
    store.dispatch(MovieActionCreators.getMovie(movieId)),
    store.dispatch(MovieActionCreators.getSeason(movieId)),
    store.dispatch(VideoActionCreators.getVideo(videoId))
  ];
  return await * [
    store.dispatch(UserActionCreators.getFavorites('movies')),
    store.dispatch(UserActionCreators.getFavorites('episodes')),
  ];
})
class PlayerPage extends React.Component {

  render() {
    const {
      props: {
        params: { videoId,movieId,seasonId,episodeId }
        }
      } = this;

    return (
      <div className="row-fluid player-page">
        {videoId && movieId ? <PlayerComponent {...{videoId, movieId, seasonId, episodeId}}/> : ''}
      </div>
    );
  }
}

export default PlayerPage;
