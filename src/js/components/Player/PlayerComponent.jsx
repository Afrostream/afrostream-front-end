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

    const {
      props: {
        Asset,
        asset
        }
      } = this;

    const tokenAsset = Asset.get(`asset/${asset}`);
    videojs.options.flash.swf = require('../../../../node_modules/videojs-swf/dist/video-js.swf');
    // initialize the player
    this.player = videojs('video', tokenAsset.toJS());
    console.log(this.player, tokenAsset.toJS());
  }

  componentWillUnmount() {
    this.player.dispose();
    this.player = null;
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
