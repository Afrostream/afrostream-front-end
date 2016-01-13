import React from 'react';
import * as ModalActionCreators from '../../actions/modal';
import * as WaitingUsersActionCreators from '../../actions/waitingUsers';
import ModalComponent from './ModalComponent';
import classNames from 'classnames';

class ModalGeoWall extends ModalComponent {

  handleSubmit(e) {
    e.stopPropagation();
    e.preventDefault();
    const email = this.refs.email.getDOMNode().value;
    this.props.dispatch(WaitingUsersActionCreators.create(email));
    this.props.dispatch(ModalActionCreators.close());
  }

  render() {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': this.props.closable
    });

    return (
      <div id="lock" className="lock theme-default geoWall">
        <div className="signin">
          <div className="popup">
            <div className="overlay active">
              <div className="centrix">
                <div id="onestep" className="panel onestep active">
                  {/*HEADER*/}
                  <div className="header top-header ">
                    <div className="bg-gradient"></div>
                    <h1>Coming Soon</h1>
                    <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                  </div>
                  <div className="mode-container">
                    <div className="mode">
                      <form onSubmit={::this.handleSubmit}>
                        <div className="instructions">
                          Enter your details below and be the first to get notified when we launch there :
                        </div>
                        <div className="emailPassword">
                          <div className="inputs">
                            <div className="email">
                              <label htmlFor="easy_email" className="sad-placeholder">
                                Email
                              </label>
                              <div className="input-box">
                                <i className="icon-budicon-5"></i>
                                <input name="email" ref="email" id="easy_email" type="email"
                                       placeholder="example@address.com"
                                       title="email"/>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="primary next">Notify me</button>
                      </form>
                    </div>
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

export default ModalGeoWall;
