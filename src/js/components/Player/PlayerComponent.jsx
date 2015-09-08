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
    this.playerInit = null;
  }

  static propTypes = {
    videoId: React.PropTypes.string.isRequired,
    movieId: React.PropTypes.string.isRequired,
    episodeId: React.PropTypes.string.isRequired
  };

  componentDidMount() {
    this.initPlayer();
  }

  componentWillReceiveProps() {
    this.initPlayer();
  }

  initPlayer() {
    let self = this;
    if (self.player) {
      return false;
    }
    //initPlayer
    this.generatePlayer()
      .then(function (player) {
        console.log('generatePlayer complete');
        self.player = player;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
  }

  generateDomTag(videoData) {
    const {
      props: {
        }
      } = this;

    return new Promise((resolve) => {
      // initialize the player
      let captions = videoData.get('captions');
      let hasSubtiles = captions ? captions.size : false;
      let wrapper = React.findDOMNode(this.refs.wrapper);
      let video = document.createElement('video');
      video.id = 'afrostream-player';
      video.className = 'player-container video-js vjs-afrostream-skin vjs-big-play-centered';
      video.crossOrigin = true;
      if (hasSubtiles) {
        captions.map((caption, i) => {
          let track = document.createElement('track');
          track.kind = 'captions';
          //track.id = `track-${caption.get('_id')}-${i}`;
          track.key = `track-${caption.get('_id')}-${i}`;
          track.src = caption.get('src');
          track.mode = 'showing';
          let lang = caption.get('lang');
          if (lang) {
            track.srclang = lang.get('lang');
            track.label = lang.get('label')
          }
          video.appendChild(track);
        });
      }
      wrapper.appendChild(video);
      resolve();
    });
  }

  generatePlayer() {
    const {
      props: {
        Video,
        Movie,
        videoId,
        movieId
        }
      } = this;

    let self = this;

    return new Promise((resolve, reject) => {

      const videoData = Video.get(`videos/${videoId}`);

      if (!videoData) return reject('no video data');


      if (self.playerInit) return reject('Player init already called');

      self.playerInit = true;

      self.destroyPlayer().then(() => {
        videojs.options.flash.swf = require('../../../../node_modules/videojs-swf/dist/video-js.swf');
        videojs.options.flash.streamrootswf = 'http://files.streamroot.io/release/1.1/wrappers/videojs/video-js-sr.swf';

        let videoOptions = videoData.toJS();
        let movie = Movie.get(`movies/${movieId}`);
        let posterImgImgix = {};
        if (movie) {
          let poster = movie.get('poster');
          let posterImg = poster ? poster.get('imgix') : '';
          if (posterImg) {
            posterImgImgix.poster = `${posterImg}?crop=faces&fit=clamp&w=1280&h=720&q=70`;
            videoOptions = _.merge(videoOptions, posterImgImgix);
          }
        }

        self.generateDomTag(videoData).then(() => {
          //initialize the player
          var playerData = _.merge(videoOptions, config.player);
          let player = videojs('afrostream-player', playerData);
          player.on('pause', this.setDurationInfo.bind(this));
          player.on('play', this.setDurationInfo.bind(this));
          player.on('ended', this.setDurationInfo.bind(this));
          player.on('loadedmetadata', this.setDurationInfo.bind(this));
          player.on('useractive', this.triggerUserActive.bind(this));
          player.on('userinactive', this.triggerUserActive.bind(this));

          resolve(player);
        }).catch((err) => {
          self.playerInit = false;
          reject(err);
        });
      }).catch((err) => {
        self.playerInit = false;
        reject(err);
      });
    });
  }

  //
  //generatePlayer() {
  //  const {
  //    props: {
  //      Video,
  //      Movie,
  //      videoId,
  //      movieId
  //      }
  //    } = this;
  //
  //  return new Promise((resolve, reject) => {
  //
  //    const videoData = Video.get(`videos/${videoId}`);
  //
  //    if (!videoData) return reject('no video data');
  //
  //
  //    if (this.playerInit) return reject('Player init already called');
  //
  //    this.playerInit = true;
  //
  //    this.destroyPlayer().then(() => {
  //      videojs.options.flash.swf = require('../../../../node_modules/videojs-swf/dist/video-js.swf');
  //      videojs.options.flash.streamrootswf = 'http://files.streamroot.io/release/1.1/wrappers/videojs/video-js-sr.swf';
  //
  //      let videoOptions = videoData.toJS();
  //      let movie = Movie.get(`movies/${movieId}`);
  //      let posterImgImgix = {};
  //      if (movie) {
  //        let poster = movie.get('poster');
  //        let posterImg = poster ? poster.get('imgix') : '';
  //        if (posterImg) {
  //          posterImgImgix.poster = `${posterImg}?crop=faces&fit=clamp&w=1280&h=720&q=70`;
  //          videoOptions = _.merge(videoOptions, posterImgImgix);
  //        }
  //      }
  //
  //      // initialize the player
  //      var playerData = _.merge(videoOptions, config.player);
  //      let player = videojs('afrostream-player', playerData).ready(function () {
  //
  //      });
  //      player.on('pause', this.setDurationInfo.bind(this));
  //      player.on('play', this.setDurationInfo.bind(this));
  //      player.on('ended', this.setDurationInfo.bind(this));
  //      player.on('loadedmetadata', this.setDurationInfo.bind(this));
  //      player.on('useractive', this.triggerUserActive.bind(this));
  //      player.on('userinactive', this.triggerUserActive.bind(this));
  //
  //      resolve(player);
  //
  //    }).catch((err) => {
  //      this.playerInit = false;
  //      reject(err);
  //    });
  //  });
  //}

  setDurationInfo() {

    this.setState({
      duration: this.player ? this.player.duration() : 0
    })
  }

  triggerUserActive() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(EventActionCreators.userActive(this.player ? (this.player.paused() || this.player.userActive()) : true))
  }

  componentWillUnmount() {
    this.destroyPlayer();
  }

  destroyPlayer() {
    const {
      props: {
        dispatch
        }
      } = this;

    return new Promise((resolve) => {
      if (this.player) {
        this.player.one('dispose', () => {
          this.player.off('pause', this.setDurationInfo.bind(this));
          this.player.off('play', this.setDurationInfo.bind(this));
          this.player.off('ended', this.setDurationInfo.bind(this));
          this.player.off('loadedmetadata', this.setDurationInfo.bind(this));
          this.player.off('useractive', this.triggerUserActive.bind(this));
          this.player.off('userinactive', this.triggerUserActive.bind(this));
          this.player = null;
          dispatch(EventActionCreators.userActive(true));
          console.log('destroyed player');
          resolve();
        });
        console.log('destroy player');
        this.player.dispose();
      } else {
        console.log('destroy player impossible');
        // Player not initialized, the promise is resolved immediatly
        resolve();
      }
    });
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
    if (!videoData) {
      return (<Spinner />)
    }
    let captions = videoData.get('captions');
    const movieData = Movie.get(`movies/${movieId}`);
    const videoDuration = this.formatTime(this.state.duration || (movieData ? movieData.get('duration') : 0));
    //let hasSubtiles = captions ? captions.size : false;

    return (
      <div className="player">
        {/*<video crossOrigin id="afrostream-player" ref="wrapped-player"
         className="player-container video-js vjs-afrostream-skin vjs-big-play-centered">
         {hasSubtiles ? captions.map((caption, i) => <track kind="captions"
         key={`track-${caption.get('_id')}-${i}`}
         src={caption.get('src')}
         srclang={caption.get('lang').get('lang')}
         label={caption.get('lang').get('label')}/>) : ''}

         </video>*/}
        <div ref="wrapper"/>
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

export
default
PlayerComponent;
