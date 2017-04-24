import React from 'react'
import * as ModalActionCreators from '../../actions/modal'
import classNames from 'classnames'
import { I18n } from '../Utils'

class ModalComponent extends I18n {

  constructor(props, context) {
    super(props, context)
  }

  static contextTypes = {
    location: React.PropTypes.object,
    history: React.PropTypes.object
  }

  componentWillUnmount() {
    if (!this.props.closable) {
      this.closeModal()
    }
  }

  closeModal() {
    if (this.props.dispatch) {
      this.props.dispatch(ModalActionCreators.close())
    }
  }

  getI18n() {
    return 'modal'
  }

  handleClose(e) {
    e.stopPropagation()
    e.preventDefault()
    this.closeModal()
  }

  renderContent() {
    return this.props.description && <h2>{this.getTitle(this.props.description)}</h2>
  }

  renderTitle() {
    return this.props.title && <h1>{this.getTitle(this.props.title)}</h1>
  }

  renderFooter() {
    return this.props.footer
  }

  render() {

    const {props: {children, closable, className}} = this
    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !closable
    })

    let panelClass = {
      'panel onestep active': true,
    }

    panelClass[className] = true

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className={classNames(panelClass)}>
                    {/*HEADER*/}
                    <div className="header top-header">
                      {this.renderTitle()}
                      <a className={closeClass} onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        {this.renderContent()}
                        {this.renderFooter()}
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

ModalComponent.propTypes = {
  dispatch: React.PropTypes.func,
  closable: React.PropTypes.bool,
  modal: React.PropTypes.bool,
  footer: React.PropTypes.object,
  title: React.PropTypes.string,
  className: React.PropTypes.string,
  cb: React.PropTypes.func
}

ModalComponent.defaultProps = {
  footer: null,
  closable: true,
  modal: true,
  className: ''
}

export default ModalComponent
