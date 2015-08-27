import React from 'react';
import { connect } from 'react-redux';
import videojs from 'videojs-contrib-hls';
import config from '../../../../config';
if (process.env.BROWSER) {
  require('./PlayerComponent.less');
}

@connect(({ Video }) => ({Video})) class PlayerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.player = null;
  }

  static propTypes = {
    videoId: React.PropTypes.string.isRequired
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
    var playerData = videoData.toJS();
    console.log(config.streamRoot);
    var data = {
      autoplay: true, "controls": true,
      "width": "100%",
      "height": "100%",
      "sr_options": {
        "ID_CLIENT": config.streamRoot.clientId,
        "TRACKER_URL": config.streamRoot.trackerUrl
      },
      "techOrder": ["streamroot", "srflash", "hls", "html5", "flash"],
      "sources": [
        {
          "src": "http://localhost:3002/api/assets/33b94949-28f7-4b3c-a047-7a564c0636ab/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiIyYzNiNWEzOC05Nzg3LTRhNzktOTBhZS0wMDYzNGNjYmUzYTQiLCJpYXQiOjE0NDA1MTU3NzksImV4cCI6MTQ0MDUxNjA3OX0.FDQnd-7fAZAspZ5e4Fu74lCNEHMgeZ2957PWxgyrCKY/5d7ed154616192ab.mpd",
          "type": "video/dash"
        },
        {
          "src": "http://origin.afrostream.tv/vod/LesLascars_S2EP14/f04f2bc0b0f0dee2.ism/master.m3u8",
          "type": "application/x-mpegURL"
        }
      ]
    };
    //data.sources = [{
    //  src: 'http://origin.afrostream.tv/vod/LesLascars_S2EP14/f04f2bc0b0f0dee2.ism/f04f2bc0b0f0dee2.mpd',
    //  type: 'application/dash+xml'
    //}]
    data.sources = playerData.sources;
    //data.sources[1].type = 'video/dash'
    console.log(data.sources);
    this.player = videojs('afrostream-player', data, function () {
      console.log('ready')
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }

  render() {
    return (
      <div className="player">
        <video id="afrostream-player"
               className="player-container video-js vjs-default-skin vjs-afrostream-skin vjs-big-play-centered"/>
      </div>
    );
  }
}

export default PlayerComponent;
