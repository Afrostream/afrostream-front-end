import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import classNames from 'classnames'
import shallowEqual from 'react-pure-render/shallowEqual'
import ModalComponent from './ModalComponent'
import { withRouter } from 'react-router'
import FloatPlayer from '../Player/FloatPlayer'
import * as PlayerActionCreators from '../../actions/player'

if (process.env.BROWSER) {
  require('./ModalPlayer.less')
}
@connect(({Player})=>({Player}))
class ModalPlayer extends ModalComponent {

  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.Player, this.props.Player)) {
      const videoData = nextProps.Player.get('/player/data')
      if (!videoData) {
        return this.closeModal()
      }
    }
  }

  componentDidMount () {
    const {props:{dispatch, data}} = this
    dispatch(PlayerActionCreators.loadPlayer({
      data: Immutable.fromJS({
        autoplay: true,
        target: this.refs.container,
        sources: [{
          src: data.get('src'),
          type: data.get('type')
        }]
      })
    }))
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
                      <div ref="container" className="mode">
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
