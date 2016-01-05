import React from 'react';
import { prepareRoute,analytics } from '../../decorators';
import * as VideoActionCreators from '../../actions/video';
import * as MovieActionCreators from '../../actions/movie';
import * as SeasonActionCreators from '../../actions/season';
import * as EventActionCreators from '../../actions/event';
import * as PlayerActionCreators from '../../actions/player';

import PlayerComponent from './PlayerComponent';

@prepareRoute(async function ({ store, location, params: { movieId,movieSlug,seasonId,seasonSlug,episodeId,episodeSlug, videoId } }) {
  console.log(movieId, movieSlug, seasonId, seasonSlug, episodeId, episodeSlug, videoId);
  return await * [
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(PlayerActionCreators.getConfig()),
    store.dispatch(MovieActionCreators.getMovie(movieId, location)),
    store.dispatch(MovieActionCreators.getSeason(movieId)),
    store.dispatch(VideoActionCreators.getVideo(videoId, location))
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
      <div className="row-fluid">
        {videoId && movieId ? <PlayerComponent {...{videoId, movieId, seasonId, episodeId}}/> : ''}
      </div>
    );
  }
}

export default PlayerPage;
