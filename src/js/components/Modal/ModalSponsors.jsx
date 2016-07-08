import React from 'react'
import ModalComponent from './ModalComponent'
import classNames from 'classnames'
import { getI18n } from '../../../../config/i18n'

if (process.env.BROWSER) {
  require('./ModalSponsors.less')
}

class ModalSponsors extends ModalComponent {

  state = {expanded: false}

  handleOpen () {
    this.setState({
      expanded: true
    })
  }

  handleClose () {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  getSponsorsComponent () {

    const classBtn = {
      'showmail': this.state.expanded
    }
    const classEmail = {
      'email-field': true,
      'active': this.state.expanded
    }
    return <div className="wrapper">
      <div className="middle">
        <form>
          <input type="email" required name="email" className={classNames(classEmail)} id="email-field"
                 placeholder={`${this.state.expanded ? 'son email' : 'Inviter un ami' }`}
                 onClick={::this.handleOpen}/>
          <button type="submit" value="Subscribe" name="subscribe" id="subscribe-button"
                  className={classNames(classBtn)}>OK
          </button>
        </form>
      </div>
    </div>
  }

  render () {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default sponsors">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{getI18n().sponsors.title}</h1>
                      <a ref="closeEl" className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        {this.getSponsorsComponent()}
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

ModalSponsors.propTypes = {
  data: React.PropTypes.object
}

ModalSponsors.defaultProps = {
  data: null
}

export default ModalSponsors
