import React from 'react'
import { connect } from 'react-redux'
import config from '../../../../config'
import classNames from 'classnames'
import ModalComponent from './ModalComponent'
import scriptLoader from '../../lib/script-loader'

const {cashwayApi} = config

if (process.env.BROWSER) {
  require('./ModalCashwayPlan.less')
}

class ModalCashwayPlan extends ModalComponent {

  constructor (props) {
    super(props)
    this.state = {
      location: ''
    }
  }

  componentDidMount () {
    const {
      props: {isScriptLoaded, isScriptLoadSucceed}
    } = this
    if (isScriptLoaded && isScriptLoadSucceed) {
      window.cashwayMapInit()
    }
  }

  componentWillReceiveProps ({isScriptLoaded, isScriptLoadSucceed}) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        window.cashwayMapInit()
      }
    }
  }

  render () {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default geoWall">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className="panel onestep active large">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{this.props.header}</h1>
                      <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        <div className="instructions">
                          {this.props.instructions}
                        </div>
                        <div id="cashway-map-canvas" className="cashway-map-canvas"></div>
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

ModalCashwayPlan.propTypes = {
  header: React.PropTypes.string,
  instructions: React.PropTypes.string,
  action: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  closable: React.PropTypes.bool
}

ModalCashwayPlan.defaultProps = {
  header: 'Trouver un partenaire CASHWAY',
  instructons: 'RDV chez un partenaire CASHWAY'
}

export default scriptLoader(
  cashwayApi
)(ModalCashwayPlan)
