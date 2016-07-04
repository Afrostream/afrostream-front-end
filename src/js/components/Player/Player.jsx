import React from 'react'
import ReactDOM from'react-dom'
import cx from 'classnames'
import { forEach, debounce, defaults } from 'lodash'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

const DEFAULT_HEIGHT = 800
const DEFAULT_WIDTH = 600
const DEFAULT_ASPECT_RATIO = (9 / 16)
const DEFAULT_ADJUSTED_SIZE = 0
const DEFAULT_RESIZEdebounce_TIME = 500
const DEFAULT_VIDEO_OPTIONS = {
  preload: 'auto',
  autoplay: true,
  controls: true,
  controlBar: {},
  aspectRatio: '16:9',
  techOrder: ['youtube', 'html5']
}

class Player extends React.Component {


  componentDidMount () {
    this.mountVideoPlayer()
  }

  componentWillReceiveProps (nextProps) {
    let isEndless = this.props.endlessMode
    let willBeEndless = nextProps.endlessMode

    if (isEndless !== willBeEndless) {
      if (willBeEndless) {
        this.addEndlessMode()
      } else {
        this.removeEndlessMode()
      }
    }

    let isResizable = this.props.resize
    let willBeResizeable = nextProps.resize

    if (isResizable !== willBeResizeable) {
      if (willBeResizeable) {
        this.addResizeEventListener()
      } else {
        this.removeResizeEventListener()
      }
    }

    let currentSrc = this.props.src
    let newSrc = nextProps.src

    if (currentSrc !== newSrc) {
      this.setVideoPlayerSrc(newSrc)
    } else if (isEndless === willBeEndless) {
      this.restartVideo()
    }
  }

  shouldComponentUpdate () {
    return false
  }

  componentWillUnmount () {
    this.unmountVideoPlayer()
  }

  getVideoPlayer () {
    return this._player
  }

  getVideoPlayerEl () {
    return ReactDOM.findDOMNode(this.refs.videoPlayer)
  }

  getVideoPlayerOptions () {
    return defaults({}, this.props.options, {
      height: this.props.resize ? 'auto' : (this.props.height || DEFAULT_HEIGHT),
      width: this.props.resize ? 'auto' : (this.props.width || DEFAULT_WIDTH)
    }, DEFAULT_VIDEO_OPTIONS)
  }

  getVideoResizeOptions () {
    return defaults({}, this.props.resizeOptions, {
      aspectRatio: DEFAULT_ASPECT_RATIO,
      shortWindowVideoHeightAdjustment: DEFAULT_ADJUSTED_SIZE,
      defaultVideoWidthAdjustment: DEFAULT_ADJUSTED_SIZE,
      debounceTime: DEFAULT_RESIZEdebounce_TIME
    })
  }

  getResizedVideoPlayerMeasurements () {
    let resizeOptions = this.getVideoResizeOptions()
    let aspectRatio = resizeOptions.aspectRatio
    let defaultVideoWidthAdjustment = resizeOptions.defaultVideoWidthAdjustment

    let winHeight = this._windowHeight()

    let baseWidth = this._videoElementWidth()

    let vidWidth = baseWidth - defaultVideoWidthAdjustment
    let vidHeight = vidWidth * aspectRatio

    if (winHeight < vidHeight) {
      let shortWindowVideoHeightAdjustment = resizeOptions.shortWindowVideoHeightAdjustment
      vidHeight = winHeight - shortWindowVideoHeightAdjustment
    }

    return {
      width: vidWidth,
      height: vidHeight
    }
  }

  setVideoPlayerSrc (src) {
    this._player.src(src)
  }

  mountVideoPlayer () {
    let src = this.props.src
    let options = this.getVideoPlayerOptions()

    this._player = videojs(this.getVideoPlayerEl(), options)

    let player = this._player

    player.ready(::this.handleVideoPlayerReady)

    forEach(this.props.eventListeners, function (val, key) {
      player.on(key, val)
    })

    player.src(src)

    if (this.props.endlessMode) {
      this.addEndlessMode()
    }
  }

  unmountVideoPlayer () {
    this.removeResizeEventListener()
    this._player.dispose()
  }

  addEndlessMode () {
    let player = this._player

    player.on('ended', this.handleNextVideo)

    if (player.ended()) {
      this.handleNextVideo()
    }
  }

  addResizeEventListener () {
    let debounceTime = this.getVideoResizeOptions().debounceTime

    this._handleVideoPlayerResize = debounce(this.handleVideoPlayerResize, debounceTime)
    window.addEventListener('resize', this._handleVideoPlayerResize)
  }

  removeEndlessMode () {
    let player = this._player

    player.off('ended', this.handleNextVideo)
  }

  removeResizeEventListener () {
    window.removeEventListener('resize', this._handleVideoPlayerResize)
  }

  pauseVideo () {
    this._player.pause()
  }

  playVideo () {
    this._player.play()
  }

  restartVideo () {
    //this._player.currentTime(0).play()
  }

  togglePauseVideo () {
    if (this._player.paused()) {
      this.playVideo()
    } else {
      this.pauseVideo()
    }
  }

  handleVideoPlayerReady () {

    if (this.props.resize) {
      this.handleVideoPlayerResize()
      this.addResizeEventListener()
    }

    this.props.onReady()
  }

  handleVideoPlayerResize () {
    let player = this._player
    let videoMeasurements = this.getResizedVideoPlayerMeasurements()

    player.dimensions(videoMeasurements.width, videoMeasurements.height)
  }

  handleNextVideo () {
    this.props.onNextVideo()
  }

  renderDefaultWarning () {
    return (
      <p className="videojs-no-js"> To view this video please enable JavaScript, and consider upgrading to a web browser
        that <a href="http://videojs.com/html5-video-support/"
                target="_blank"> supports HTML5 video
        </a>
      </p>
    )
  }

  _windowHeight () {
    return window.innerHeight
  }

  _videoElementWidth () {
    return this.getVideoPlayerEl().parentElement.parentElement.offsetWidth
  }

  render () {
    let videoPlayerClasses = cx({
      'video-js': true,
      'vjs-afrostream-skin': this.props.videojsDefaultSkin,
      'vjs-big-play-centered': this.props.videojsBigPlayCentered
    })

    return (<video ref="videoPlayer"
                   className={videoPlayerClasses}> {this.props.children || this.renderDefaultWarning()}
    </video>)
  }
}


Player.propTypes = {
  src: React.PropTypes.oneOfType(
    [
      React.PropTypes.string,
      React.PropTypes.array,
      React.PropTypes.object
    ]
  ),
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  endlessMode: React.PropTypes.bool,
  options: React.PropTypes.object,
  onReady: React.PropTypes.func,
  eventListeners: React.PropTypes.object,
  resize: React.PropTypes.bool,
  resizeOptions: React.PropTypes.shape({
    aspectRatio: React.PropTypes.number,
    shortWindowVideoHeightAdjustment: React.PropTypes.number,
    defaultVideoWidthAdjustment: React.PropTypes.number,
    debounceTime: React.PropTypes.number,
    videojsDefaultSkin: React.PropTypes.bool,
    videojsBigPlayCentered: React.PropTypes.bool,
    children: React.PropTypes.element,
    dispose: React.PropTypes.bool,
    onNextVideo: React.PropTypes.func
  })
}

Player.defaultProps = {
  endlessMode: false,
  options: DEFAULT_VIDEO_OPTIONS,
  onReady: function () {
  },
  eventListeners: {},
  resize: false,
  resizeOptions: {},
  videojsDefaultSkin: true,
  videojsBigPlayCentered: true,
  onNextVideo: function () {
  }
}

export default  Player
