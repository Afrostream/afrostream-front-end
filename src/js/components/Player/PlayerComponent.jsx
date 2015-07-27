import React from 'react';
import { connect } from 'redux/react';
import * as SlidesActionCreators from '../../actions/slides';
import videojs from 'videojs-contrib-hls';

if (process.env.BROWSER) {
  require('./PlayerComponent.less');
}


@connect(({ Asset }) => ({Asset})) class PlayerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.player = null;
  }

  static propTypes = {
    asset: React.PropTypes.string.isRequired
  };

  componentDidMount() {
    this.initPlayer();
  }

  componentWillReceiveProps() {
    this.initPlayer();
  }

  initPlayer() {
    const {
      props: {
        Asset,
        asset
        }
      } = this;

    const tokenAsset = Asset.get(`asset/${asset}`);
    console.log(tokenAsset);
    if (!tokenAsset) return false;

    videojs.options.flash.swf = require('../../../../node_modules/videojs-swf/dist/video-js.swf');
    videojs.options.flash.streamrootswf = 'http://files.streamroot.io/release/1.1/wrappers/videojs/video-js-sr.swf';
    // initialize the player
    this.player = videojs('video', tokenAsset.toJS());
    console.log(this.player, tokenAsset.toJS());
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
        <video id="video"
               className="player-container video-js vjs-default-skin vjs-afrostream-skin vjs-big-play-centered"/>
      </div>
    );
  }

  toggleSlide() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(SlidesActionCreators.toggleSlide(this.props.index));
  }
}

export default PlayerComponent;
