import React from 'react';
import { prepareRoute } from '../../decorators';
import * as VideoActionCreators from '../../actions/video';
import * as MovieActionCreators from '../../actions/movie';
import * as SeasonActionCreators from '../../actions/season';
import PlayerComponent from './PlayerComponent';

@prepareRoute(async function ({ store, params: { movieId,seasonId, movieSlug, videoId } }) {
  console.log(movieId, movieSlug, videoId);
  return await * [
      store.dispatch(VideoActionCreators.getVideo(videoId)),
      store.dispatch(MovieActionCreators.getMovie(movieId)),
      store.dispatch(SeasonActionCreators.getSeason(seasonId))
    ];
}) class PlayerPage extends React.Component {

  render() {
    const {
      props: {
        params: { videoId,movieId }
        }
      } = this;

    return (
      <div className="row-fluid">
        {videoId ? <PlayerComponent {...{videoId, movieId, seasonId}}/> : ''}
      </div>
    );
  }
}

export default PlayerPage;
