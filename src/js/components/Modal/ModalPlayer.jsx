import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import ModalComponent from './ModalComponent'
import { withRouter } from 'react-router'
import Player from '../Player/Player'

if (process.env.BROWSER) {
  require('./ModalPlayer.less')
}

class ModalPlayer extends ModalComponent {

  constructor (props) {
    super(props)
  }

  render () {
    const {props:{data}} = this

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default player">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    <div className="mode-container">
                      <div className="mode">
                        <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                        <Player src={data}
                                options={{autoplay: true, controls: false}}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ModalPlayer.propTypes = {
  data: React.PropTypes.object
}

ModalPlayer.defaultProps = {
  data: null
}

export default withRouter(ModalPlayer)
