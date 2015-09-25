import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
//import Hls from 'hls.js';
//import videojs from 'videojs-afrostream';
import config from '../../../../config';
import * as EventActionCreators from '../../actions/event';
import classSet from 'classnames';
import Spinner from '../Spinner/Spinner';
if (process.env.BROWSER) {
  require('./PlayerComponent.less');
}
if (canUseDOM) {
  var Hls = require('hls.js');
  window.Hls = Hls;
  var videojs = require('videojs-afrostream');
  console.log(Hls.isSupported());
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
        movieId,Movie
        }
      } = this;

    return new Promise((resolve) => {
      // initialize the player
      const movieData = Movie.get(`movies/${movieId}`);
      let captions = videoData.get('captions');
      let hasSubtiles = captions ? captions.size : false;
      let wrapper = React.findDOMNode(this.refs.wrapper);
      let video = document.createElement('video');
      video.id = 'afrostream-player';
      video.className = 'player-container video-js vjs-afrostream-skin vjs-big-play-centered';
      video.crossOrigin = true;
      video.setAttribute('crossorigin', true);

      var trackOptions = {
        metadata: {
          title: movieData.get('title'),
          subtitle: movieData.get('synopsis')
        },
        tracks: []
      };

      if (hasSubtiles) {
        captions.map((caption, i) => {
          let track = document.createElement('track');
          track.kind = 'captions';
          track.src = caption.get('src');
          track.id = `track-${caption.get('_id')}-${i}`;
          let lang = caption.get('lang');
          if (lang) {
            track.srclang = lang.get('lang');
            track.label = lang.get('label')
          }
          if (lang.get('lang') === 'fr') {
            track.default = true;
          }
          trackOptions.tracks.push({
            kind: track.kind,
            src: track.src,
            id: track.id,
            language: track.srclang,
            label: track.label,
            type: 'text/vtt',
            mode: track.default ? 'showing' : ''
          });
          video.appendChild(track);
        });
      }
      wrapper.appendChild(video);
      resolve(trackOptions);
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

        self.generateDomTag(videoData).then((trackOpt) => {
          //initialize the player
          config.player.plugins.chromecast = _.merge(config.player.plugins.chromecast, trackOpt);
          var playerData = _.merge(videoOptions, config.player);

          //si on est sur safari mac on priorise hls plutot que dash
          let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1;
          if (isSafari) {
            playerData.sources = _.remove(playerData.sources, function (k) {
              return k.type !== 'application/dash+xml';
            });
          }
          playerData.sources = _.sortBy(playerData.sources, function (k) {
            return k.type === 'application/dash+xml';
          });

          playerData.flash = {
            swf: require('../../../../node_modules/videojs-afrostream/dist/video-js.swf'),
            streamrootswf: 'http://files.streamroot.io/release/1.1/wrappers/videojs/video-js-sr.swf',
            params: {
              wmode: 'direct'
            }
          };

          playerData.hls = _.clone(playerData.flash);

          let player = videojs('afrostream-player', playerData).ready(function () {
              var allTracks = this.tech.el().textTracks; // get list of tracks
              let trackFr = _.find(allTracks, function (track) {
                return track.language === 'fr';
              });
              if (trackFr) {
                trackFr.mode = 'showing'; // show this track
              }
            }
          );
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
      'video-infos-hidden': hiddenMode
    };

    const videoData = Video.get(`videos/${videoId}`);
    if (!videoData) {
      return (<Spinner />)
    }
    let captions = videoData.get('captions');
    const movieData = Movie.get(`movies/${movieId}`);
    const videoDuration = this.formatTime(this.state.duration || (movieData ? movieData.get('duration') : 0));

    return (
      <div className="player">
        <div ref="wrapper" className="wrapper"/>
        {
          movieData ?
            <div className={classSet(videoInfoClasses)}>
              <div className=" video-infos_label">Vous regardez</div>
              <div className=" video-infos_title">{movieData.get('title')}</div>
              <div className=" video-infos_duration"><label>Durée : </label>{videoDuration}</div>
              <div className=" video-infos_synopsys">{movieData.get('synopsis')}</div>
            </div> : <div />
        }
      </div>
    );
  }
}

export
default
PlayerComponent;
