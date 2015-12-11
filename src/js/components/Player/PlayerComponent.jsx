import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import videojs from 'afrostream-player';
import config from '../../../../config';
import * as EventActionCreators from '../../actions/event';
import classSet from 'classnames';
import Spinner from '../Spinner/Spinner';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import Raven from 'raven-js'

if (process.env.BROWSER) {
  require('./PlayerComponent.less');
}

if (canUseDOM) {
  var base64 = require('js-base64').Base64;
}

@connect(({ Video,Movie,Episode,Event,User,Player }) => ({
  Video,
  Movie,
  Event,
  User,
  Player
}))
class PlayerComponent extends React.Component {

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
    seasonId: React.PropTypes.string,
    episodeId: React.PropTypes.string
  };

  componentDidMount() {
    this.initPlayer();
  }

  componentDidUpdate() {
    this.initPlayer();
  }

  detectUA() {
    const userAgent = (window.navigator && navigator.userAgent) || "";
    const detect = function (pattern) {
      return function () {
        return (pattern).test(userAgent);
      };
    };

    return {
      getBrowser: function () {
        var data = {};
        var browser = '';
        var version = '';
        var os = '';
        var osVersion = '';
        var parseUserAgent, prepareData, renameOsx, cutSafariVersion;

        parseUserAgent = function () {
          var userAgent = navigator.userAgent.toLowerCase(),
            browserParts = /(ie|firefox|chrome|safari|opera)(?:.*version)?(?:[ \/])?([\w.]+)/.exec(userAgent),
            osParts = /(mac|win|linux|freebsd|mobile|iphone|ipod|ipad|android|blackberry|j2me|webtv)/.exec(userAgent);

          if (!!userAgent.match(/trident\/7\./)) {
            browser = 'ie';
            version = 11;
          } else if (browserParts && browserParts.length > 2) {
            browser = browserParts[1];
            version = browserParts[2];
          }

          if (osParts && osParts.length > 1) {
            os = osParts[1];
          }

          osVersion = navigator.oscpu || navigator.appName;
        };

        prepareData = function () {
          data.browser = browser;
          data.version = parseInt(version, 10) || '';
          data.os = os;
          data.osVersion = osVersion;
        };

        renameOsx = function () {
          if (os === 'mac') {
            os = 'osx';
          }
        };

        cutSafariVersion = function () {
          if (os === 'safari') {
            version = version.substring(0, 1);
          }
        };

        parseUserAgent();

        // exception rules
        renameOsx();
        cutSafariVersion();

        prepareData();

        return data;
      },
      isChrome: function () {
        return detect(/webkit\W.*(chrome|chromium)\W/i)() && !detect(/Edge/)()
      },
      isFirefox: detect(/mozilla.*\Wfirefox\W/i),
      isIE: function () {
        return /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
      },
      isSafari: function () {
        return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && !/iPad|iPhone|iPod|CriOS/.test(navigator.platform);
      },
      isIOS: function () {
        return /iPad|iPhone|iPod|CriOS/.test(navigator.platform);
      },
      isAndroid: detect(/Android/i)
    };
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
      const ua = this.detectUA();
      let excludeSafari = (!ua.isSafari() || (ua.isSafari() && ua.getBrowser().version === 537));
      let captions = !ua.isChrome() && excludeSafari && videoData.get('captions');
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
          track.mode = track.default ? 'showing' : 'hidden';

          trackOptions.tracks.push({
            kind: track.kind,
            src: track.src,
            id: track.id,
            language: track.srclang,
            label: track.label,
            type: 'text/vtt',
            mode: track.default ? 'showing' : 'hidden'
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
        Player,
        User,
        videoId,
        movieId
        }
      } = this;

    let self = this;

    return new Promise((resolve, reject) => {

      const videoData = Video.get(`videos/${videoId}`);
      const apiPlayerConfig = Player.get(`/player/config`);
      if (!apiPlayerConfig) return reject('no player config api data');
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
            posterImgImgix.poster = `${posterImg}?crop=faces&fit=clamp&w=1280&h=720&q=${config.images.quality}&fm=${config.images.type}`;
            videoOptions = _.merge(videoOptions, posterImgImgix);
            videoOptions.live = movie.get('live');
          }
        }

        self.generateDomTag(videoData).then((trackOpt) => {
          //initialize the player
          let apiPlayerConfigJs = {};
          if (apiPlayerConfig) {
            apiPlayerConfigJs = apiPlayerConfig.toJS();
          }
          let playerConfig = _.merge(_.cloneDeep(config.player), _.cloneDeep(apiPlayerConfigJs));
          //merge all configs
          let playerData = _.merge(videoOptions, playerConfig);
          // ==== START hacks config
          let isLive = playerData.hasOwnProperty('live') && playerData.live;
          const ua = self.detectUA();
          let browserVersion = ua.getBrowser();

          if (ua.isIE()) {
            playerData.html5 = {
              nativeCaptions: false,
              nativeTextTracks: false
            };
            playerData.dash = _.merge(playerData.dash, _.clone(playerData.html5));
          }
          //Fix Safari < 6.2 can't play hls
          if (ua.isSafari() && (browserVersion.version < 537 || (isLive && browserVersion.version === 537 ))) {
            playerData.techOrder = _.sortBy(playerData.techOrder, function (k) {
              return k !== 'dashas';
            });
          }
          //on force dash en tech par default pour tous les browsers ;)
          playerData.sources = _.sortBy(playerData.sources, function (k) {
            return k.type !== 'application/dash+xml';
          });
          //Fix android live dash
          if (ua.isAndroid() && isLive) {
            playerData.sources = _.sortBy(playerData.sources, function (k) {
              return k.type === 'application/dash+xml';
            });
            playerData.techOrder = _.sortBy(playerData.techOrder, function (k) {
              return k !== 'html5';
            });
          }

          // ==== END hacks config
          playerData.dashas.swf = require('../../../../node_modules/afrostream-player/dist/dashas.swf');
          playerData.plugins = playerData.plugins || [];
          playerData.plugins.chromecast = _.merge(playerData.plugins.chromecast || {}, trackOpt);

          let user = User.get('user');
          if (user) {
            let userId = user.get('user_id');
            let token = user.get('afro_token');
            let splitUser = typeof userId === 'string' ? userId.split('|') : [userId];
            userId = _.find(splitUser, function (val) {
              return parseInt(val, 10);
            });
            if (playerData.metrics) {
              playerData.metrics.user_id = userId;
            }
            //encode data to pass it into drmtoday
            if (playerData.drm && playerData.dash && playerData.dash.protData) {
              let protUser = base64.encode(JSON.stringify({
                userId: userId,
                sessionId: token,
                merchant: 'afrostream'
              }));

              let protData = {
                "com.widevine.alpha": {
                  "httpRequestHeaders": {
                    "dt-custom-data": protUser
                  }
                },
                "com.microsoft.playready": {
                  "httpRequestHeaders": {
                    "http-header-CustomData": protUser
                  }
                },
                "com.adobe.flashaccess": {
                  "httpRequestHeaders": {
                    "customData": protUser
                  }
                }
              };
              playerData.dashas.protData = playerData.dash.protData = _.merge(playerData.dash.protData, protData);
            }
          }

          let player = videojs('afrostream-player', playerData).ready(function () {
              var allTracks = this.textTracks() || []; // get list of tracks
              _.forEach(allTracks, function (track) {
                let lang = track.language || track.language_;
                track.mode = (lang === 'fr' || lang === 'fra') ? 'showing' : 'hidden'; // show this track
              });
            }
          );
          player.on('loadedmetadata', this.setDurationInfo.bind(this));
          player.on('useractive', this.triggerUserActive.bind(this));
          player.on('userinactive', this.triggerUserActive.bind(this));
          player.on('error', this.triggerError.bind(this));

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

  triggerError(e) {
    if (Raven && Raven.isSetup()) {
      // Send the report.
      Raven.captureException(e, {
        extra: {
          error: this.player.error(),
          cache: this.player.getCache()
        }
      });
    }
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
          this.player.off('loadedmetadata', this.setDurationInfo.bind(this));
          this.player.off('useractive', this.triggerUserActive.bind(this));
          this.player.off('userinactive', this.triggerUserActive.bind(this));
          this.player.off('error', this.triggerError.bind(this));
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
    if (!isFinite(seconds)) {
      return null;
    }
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
    let movieData = Movie.get(`movies/${movieId}`);
    let episodeData = videoData.get('episode');
    let videoDuration = this.formatTime(this.state.duration || (movieData ? movieData.get('duration') : 0));
    //si on a les données de l'episode alors, on remplace les infos affichées
    let infos = episodeData ? _.merge(episodeData.toJS() || {}, movieData.toJS() || {}) : movieData.toJS();
    return (
      <div className="player">
        <div ref="wrapper" className="wrapper"/>
        {
          movieData ?
          <div className={classSet(videoInfoClasses)}>
            <div className=" video-infos_label">Vous regardez</div>
            <div className=" video-infos_title">{infos.title}</div>
            {infos.episodeNumber ? <div className=" video-infos_episode">{`Episode ${infos.episodeNumber}`}</div> :''}
            {videoDuration ? <div className=" video-infos_duration"><label>Durée : </label>{videoDuration}</div> : ''}
            <div className=" video-infos_synopsys">{infos.synopsis}</div>
          </div> : <div />
          }
      </div>
    );
  }
}

export
default
PlayerComponent;
