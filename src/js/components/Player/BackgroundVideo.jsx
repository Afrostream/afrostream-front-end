import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class BackgroundVideo extends Component {
  static propTypes = {
    videos: React.PropTypes.arrayOf(PropTypes.shape({
      src: PropTypes.string,
      type: PropTypes.string,
    })),
    children: PropTypes.node,
    preload: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    isMobile: PropTypes.bool,
    muted: PropTypes.bool,
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    className: PropTypes.string,
    overlayClassName: PropTypes.string,
    videoId: PropTypes.string,
    overlay: PropTypes.bool,
    poster: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    videos: [],
    preload: 'auto',
    isMobile: false,
    muted: true,
    loop: true,
    autoPlay: true,
    className: '',
    overlayClassName: '',
    videoId: `video-${Date.now()}`,
    overlay: true,
  }

  componentWillUnmount () {
    const videoElement = document.getElementById(this.props.videoId)

    if (videoElement) {
      videoElement.pause()
      videoElement.src = ''
      videoElement.load()
    }
  }

  render () {
    const videos = this.props.videos.map((video, index) =>
      <source key={index} src={video.src} type={video.type}/>)

    const videoProps = {
      muted: this.props.muted,
      preload: this.props.preload,
      loop: this.props.loop,
      autoPlay: this.props.autoPlay,
      poster: this.props.poster,
    }

    const videoClassNames = classNames({
      'video-container': true,
      [this.props.className]: !!(this.props.className),
    })

    const videoOverlayClassNames = classNames({
      'video-overlay': true,
      [this.props.overlayClassName]: !!(this.props.overlayClassName),
    })

    const overlayElement = (this.props.overlay) ? <div className={videoOverlayClassNames}/> : null

    return (
      <div className={videoClassNames} onClick={this.props.onClick}
           style={{backgroundImage: `url(${this.props.poster})`}}>
        {!this.props.isMobile && <video id={this.props.videoId}
                                        className="video-background"
                                        {...videoProps}
        >
          {videos}
        </video>}
        {overlayElement}
        <div className="video-content">{this.props.children}</div>
      </div>
    )
  }
}

export default BackgroundVideo
