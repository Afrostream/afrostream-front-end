import React from 'react';
import { connect } from 'react-redux';
import videojs from 'videojs-afrostream';
import config from '../../../../config';
import * as EventActionCreators from '../../actions/event';
if (process.env.BROWSER) {
  require('./PlayerComponent.less');
}

@connect(({ Video,Movie,Episode,Event }) => ({
  Video,
  Movie,
  Event
})) class PlayerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.player = null;
  }

  static propTypes = {
    videoId: React.PropTypes.string.isRequired,
    movieId: React.PropTypes.string.isRequired,
    episodeId: React.PropTypes.string.isRequired
  };

  componentDidMount() {
    this.initPlayer();
  }

  //
  //componentWillReceiveProps() {
  //  this.initPlayer();
  //}

  componentDidUpdate() {
    this.initPlayer();
  }

  initPlayer() {
    const {
      props: {
        Video,
        videoId
        }
      } = this;

    const videoData = Video.get(`videos/${videoId}`);

    if (!videoData) return false;

    videojs.options.flash.swf = require('../../../../node_modules/videojs-swf/dist/video-js.swf');
    videojs.options.flash.streamrootswf = 'http://files.streamroot.io/release/1.1/wrappers/videojs/video-js-sr.swf';
    // initialize the player
    var playerData = _.merge(videoData.toJS(), config.player);
    this.player = videojs('afrostream-player', playerData);
    this.player.on('useractive', this.triggerUserActive.bind(this));
    this.player.on('userinactive', this.triggerUserActive.bind(this));
  }

  triggerUserActive() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(EventActionCreators.userActive(this.player.userActive()))
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }

  render() {
    const {
      props: {
        Video,
        Movie,
        videoId,
        movieId,
        episodeId
        }
      } = this;
    const videoData = Video.get(`videos/${videoId}`);
    const captions = videoData ? videoData.get('captions') : null;
    const movieData = Movie.get(`movies/${movieId}`);
    return (
      <div className="player">
        {movieData ?
          <div className="video-infos">
            <div className="video-infos_label">Vous regardez</div>
            <div className="video-infos_title">{movieData.get('title')}</div>
            <div className="video-infos_duration">{movieData.get('duration')}</div>
            {movieData.get('type') === 'serie' ?
              (<div className="video-infos_synopsys">{movieData.get('synopsis')}</div>)
              (<div className="video-infos_synopsys">{movieData.get('synopsis')}</div>)
              : <div />
            }
          </div> : <div />
        }
        <video id="afrostream-player"
               className="player-container video-js vjs-afrostream-skin vjs-big-play-centered">
          {captions ? captions.map((caption, i) => <track kind="captions"
                                                          key={`track-${caption.get('_id')}-${i}`}
                                                          src={caption.get('src')}
                                                          srclang={caption.get('lang').get('lang')}
                                                          label={caption.get('lang').get('label')}/>) : ''}

        </video>
      </div>
    );
  }
}

export default PlayerComponent;
