import React from 'react'
import * as ModalActionCreators from '../../actions/modal'
import classNames from 'classnames'

class ModalComponent extends React.Component {

  static contextTypes = {
    location: React.PropTypes.object,
    history: React.PropTypes.object
  }

  componentWillUnmount () {
    if (!this.props.closable) {
      this.closeModal()
    }
  }

  closeModal () {
    if (this.props.dispatch) {
      this.props.dispatch(ModalActionCreators.close())
    }
  }

  handleClose (e) {
    e.stopPropagation()
    e.preventDefault()
    this.closeModal()
  }


  render () {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': this.props.closable
    })

    let panelClass = {
      'panel onestep active': true,
    }

    panelClass[this.props.className] = true

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className={classNames(panelClass)}>
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      {this.props.children}
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

ModalComponent.propTypes = {
  dispatch: React.PropTypes.func,
  closable: React.PropTypes.bool,
  modal: React.PropTypes.bool,
  className: React.PropTypes.string

}

ModalComponent.defaultProps = {
  closable: true,
  modal: true,
  className: ''
}

export default ModalComponent
