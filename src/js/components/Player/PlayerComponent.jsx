import React from 'react';
import { connect } from 'react-redux';
import videojs from 'videojs-afrostream';
import config from '../../../../config';
import * as EventActionCreators from '../../actions/event';
import classSet from 'classnames';

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
  //componentWillReceiveProps() {
  //  this.initPlayer();
  //}

  //componentDidUpdate() {
  //  this.initPlayer();
  //}

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
    this.player = videojs('afrostream-player', playerData).ready(function () {
      this.setState({
        duration: this.player.duration()
      })
    }.bind(this));
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
      this.player.off('useractive', this.triggerUserActive.bind(this));
      this.player.off('userinactive', this.triggerUserActive.bind(this));
      this.player.dispose();
      this.player = null;
      dispatch(EventActionCreators.userActive(false))
    }
  }

  formatTime(seconds) {
    let s = Math.floor(seconds % 60);
    let m = Math.floor(seconds / 60 % 60);
    let h = Math.floor(seconds / 3600);
    const gm = Math.floor(3600 / 60 % 60);
    const gh = Math.floor(3600 / 3600);

    // handle invalid times
    if (isNaN(seconds) || seconds === Infinity) {
      // '-' is false for all relational operators (e.g. <, >=) so this setting
      // will add the minimum number of fields specified by the guide
      h = m = s = '-';
    }

    // Check if we need to show hours
    h = (h > 0 || gh > 0) ? h + ':' : '';

    // If hours are showing, we may need to add a leading zero.
    // Always show at least one digit of minutes.
    m = (((h || gm >= 10) && m < 10) ? '0' + m : m) + ':';

    // Check if leading zero is need for seconds
    s = (s < 10) ? '0' + s : s;

    return h + m + s;
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
      'video-infos-hidden': hiddenMode
    };

    const videoData = Video.get(`videos/${videoId}`);
    const captions = videoData ? videoData.get('captions') : null;
    const movieData = Movie.get(`movies/${movieId}`);
    const videoDuration = this.formatTime(this.state.duration || movieData.get('duration'));
    return (
      <div className="player">
        {movieData ?
          <div className={classSet(videoInfoClasses)}>
            <div className="video-infos_label">Vous regardez</div>
            <div className="video-infos_title">{movieData.get('title')}</div>
            <div className="video-infos_duration">{videoDuration}</div>
            {movieData.get('type') === 'serie' ?
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
