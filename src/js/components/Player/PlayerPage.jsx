import React from 'react';
import { prepareRoute } from '../../decorators';
import * as VideoActionCreators from '../../actions/video';
import PlayerComponent from './PlayerComponent';

@prepareRoute(async function ({ store, params: { movieId, movieSlug, videoId } }) {
  console.log(movieId, movieSlug, videoId);
  return await * [
      store.dispatch(VideoActionCreators.getVideo(videoId))
    ];
}) class PlayerPage extends React.Component {

  render() {
    const {
      props: {
        params: { videoId }
        }
      } = this;

    return (
      <div className="row-fluid">
        {videoId ? <PlayerComponent {...{videoId}}/> : ''}
      </div>
    );
  }
}

export default PlayerPage;
