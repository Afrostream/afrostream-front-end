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
    const captions = videoData.get('captions');

    videojs.options.flash.swf = require('../../../../node_modules/videojs-swf/dist/video-js.swf');
    videojs.options.flash.streamrootswf = 'http://files.streamroot.io/release/1.1/wrappers/videojs/video-js-sr.swf';
    // initialize the player
    var playerData = _.merge(videoData.toJS(), config.player);
    this.player = videojs('afrostream-player', playerData, function () {
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
    const {
      props: {
        Video,
        videoId
        }
      } = this;
    const videoData = Video.get(`videos/${videoId}`);
    const captions = videoData ? videoData.get('captions') : null;
    return (
      <div className="player">
        <video id="afrostream-player"
               className="player-container video-js vjs-default-skin vjs-afrostream-skin vjs-big-play-centered">
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
