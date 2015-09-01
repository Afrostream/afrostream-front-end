import React from 'react';
import { connect } from 'react-redux';
import videojs from 'videojs-afrostream';
import config from '../../../../config';
import * as EventActionCreators from '../../actions/event';
import classSet from 'classnames';
import Spinner from '../Spinner/Spinner';
if (process.env.BROWSER) {
  require('./PlayerComponent.less');
}

@connect(({ Video,Movie,Episode,Event }) => ({
  Video,
  Movie,
  Event
})) class PlayerComponent extends React.Component {

  state = {
    duration: 0
  };

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
  componentWillReceiveProps() {
    this.initPlayer();
  }

  //componentDidUpdate() {
  //  this.initPlayer();
  //}

  //componentDidUpdate() {
  //  this.initPlayer();
  //}

  initPlayer() {
    const {
      props: {
        Video,
        videoId,
        dispatch
        }
      } = this;

    if (this.player) {
      return false;
    }

    const videoData = Video.get(`videos/${videoId}`);

    if (!videoData) return false;

    videojs.options.flash.swf = require('../../../../node_modules/videojs-swf/dist/video-js.swf');
    videojs.options.flash.streamrootswf = 'http://files.streamroot.io/release/1.1/wrappers/videojs/video-js-sr.swf';
    // initialize the player
    var playerData = _.merge(videoData.toJS(), config.player);
    this.player = videojs('afrostream-player', playerData).ready(function () {
      this.setState({
        duration: this.player.duration()
      })
    }.bind(this));
    this.player.on('useractive', this.triggerUserActive.bind(this));
    this.player.on('userinactive', this.triggerUserActive.bind(this));
    dispatch(EventActionCreators.userActive(true));
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
    const {
      props: {
        dispatch
        }
      } = this;
    if (this.player) {
      this.player.off('useractive', this.triggerUserActive.bind(this));
      this.player.off('userinactive', this.triggerUserActive.bind(this));
      this.player.dispose();
      this.player = null;
      dispatch(EventActionCreators.userActive(false))
    }
  }

  formatTime(seconds) {
    var h = Math.floor(((seconds / 86400) % 1) * 24),
      m = Math.floor(((seconds / 3600) % 1) * 60),
      s = Math.round(((seconds / 60) % 1) * 60) + 's', time;

    time = s;
    if (m) {
      time = m + 'm ' + time;
    }
    if (h) {
      time = h + 'h ' + time;
    }
    return ' ' + time;
  }

  render() {
    const {
      props: {
        Video,
        Movie,
        videoId,
        movieId,
        Event
        }
      } = this;

    const hiddenMode = !Event.get('userActive');
    let videoInfoClasses = {
      'video-infos': true,
      'hidden-sm': true,
      'hidden-ms': true,
      'video-infos-hidden': hiddenMode
    };

    const videoData = Video.get(`videos/${videoId}`);
    let hasSubtiles = false;
    if (!videoData) {
      return (<Spinner />)
    }
    let captions = videoData.get('captions');
    const movieData = Movie.get(`movies/${movieId}`);
    const videoDuration = this.formatTime(this.state.duration || (movieData ? movieData.get('duration') : 0));
    hasSubtiles = captions ? captions.size : false;
    return (
      <div className="player">
        <video crossorigin="anonymous" id="afrostream-player"
               className="player-container video-js vjs-afrostream-skin vjs-big-play-centered">
          {hasSubtiles ? captions.map((caption, i) => <track kind="captions" crossorigin="anonymous"
                                                             key={`track-${caption.get('_id')}-${i}`}
                                                             src={caption.get('src')}
                                                             srclang={caption.get('lang').get('lang')}
                                                             label={caption.get('lang').get('label')}/>) : ''}

        </video>
        {movieData ?
          <div className={classSet(videoInfoClasses)}>
            <div className="video-infos_label">Vous regardez</div>
            <div className="video-infos_title">{movieData.get('title')}</div>
            <div className="video-infos_duration"><label>Durée : </label>{videoDuration}</div>
            {movieData.get('type') === 'serie' ?
              (<div className="video-infos_synopsys">{movieData.get('synopsis')}</div>)
              : <div />
            }
          </div> : <div />
        }
      </div>
    );
  }
}

export default PlayerComponent;
