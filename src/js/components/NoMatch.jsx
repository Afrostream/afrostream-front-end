import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import config from '../../../config'
if (process.env.BROWSER) {
  require('./NoMatch.less')
}
class NoMatch extends React.Component {

  constructor (props) {
    super(props)
  }

  state = {
    isMobile: false,
    size: {
      height: 1920,
      width: 815
    }
  }

  render () {

    let posterImg = this.props.poster ? this.props.poster.get('path') : ''
    let imageStyles = posterImg ? {backgroundImage: `url(${config.images.urlPrefix}${posterImg}?crop=faces&fit=${this.state.isMobile ? 'min' : 'clip'}&w=${this.state.size.width}&q=${config.images.quality}&fm=${config.images.type})`} : {}

    return (
      <div className="row-fluid">
        <div className="no-match">
          <div ref="slBackground" className="movie-background" style={imageStyles}/>
          <div className="label-center">
            {this.props.label}
          </div>
        </div>
      </div>
    )
  }
}

NoMatch.propTypes = {
  label: PropTypes.string,
  poster: PropTypes.instanceOf(Immutable.Map)
}

NoMatch.defaultProps = {
  label: 'Page non trouvée',
  poster: null
}


export default NoMatch
