import React from 'react';
import { prepareRoute } from '../../decorators';
import * as VideoActionCreators from '../../actions/video';
import * as MovieActionCreators from '../../actions/movie';
import * as SeasonActionCreators from '../../actions/season';
import * as EventActionCreators from '../../actions/event';

import PlayerComponent from './PlayerComponent';

@prepareRoute(async function ({ store, params: { movieId,movieSlug,seasonId,seasonSlug,episodeId,episodeSlug, videoId } }) {
  console.log(movieId, movieSlug, seasonId, seasonSlug, episodeId, episodeSlug, videoId);
  return await * [
      store.dispatch(EventActionCreators.pinHeader(false)),
      store.dispatch(VideoActionCreators.getVideo(videoId)),
      store.dispatch(MovieActionCreators.getMovie(movieId))
    ];
}) class PlayerPage extends React.Component {

  render() {
    const {
      props: {
        params: { videoId,movieId,seasonId }
        }
      } = this;

    return (
      <div className="row-fluid">
        {videoId && movieId ? <PlayerComponent {...{videoId, movieId, seasonId}}/> : ''}
      </div>
    );
  }
}

export default PlayerPage;
