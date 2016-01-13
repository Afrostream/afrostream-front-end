import React from 'react';
import * as ModalActionCreators from '../../actions/modal';
import classNames from 'classnames';
import $ from 'jquery';

class ModalComponent extends React.Component {

  componentWillUnmount() {
    this.closeModal();
  }

  closeModal() {
    this.props.dispatch(ModalActionCreators.close());
  }

  handleClose(e) {
    e.stopPropagation();
    e.preventDefault();
    this.closeModal()
  }


  render() {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': this.props.closable
    });

    return (
      <div id="a0-lock" className="a0-lock a0-theme-default">
        <div className="a0-signin">
          <div className="a0-popup">
            <div className="a0-overlay a0-active">
              <div className="a0-centrix">
                <div id="a0-onestep" className="a0-panel a0-onestep a0-active">
                  {/*HEADER*/}
                  <div className="a0-header a0-top-header ">
                    <div className="a0-bg-gradient"></div>
                    <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                  </div>
                  <div className="a0-mode-container">
                    {this.props.chidren}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ModalComponent.propTypes = {
  location: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  history: React.PropTypes.object,
  closable: React.PropTypes.bool
};

ModalComponent.defaultProps = {
  closable: true
};

export default ModalComponent;
