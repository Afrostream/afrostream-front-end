import React from 'react';
import ModalGeoWall from './ModalGeoWall';
import * as WaitingUsersActionCreators from '../../actions/waitingUsers';
import classNames from 'classnames';

class ModalNewsletter extends ModalGeoWall {

  state = {
    sended: false,
    email: ''
  };

  handleClose (e) {
    const {
      context : {history}
    } = this;

    history.pushState(null, '/');
    super.handleClose(e);
  }

  initState () {
    this.setState({
      sended: false,
      email: ''
    });
  }

  handleSubmit (e) {
    e.stopPropagation();
    e.preventDefault();
    const email = this.refs.email.value;
    this.props.dispatch(WaitingUsersActionCreators.create(email)).then(()=> {
      this.setState({
        sended: true,
        email: email
      });
      setTimeout(::this.initState, 10000);
    });
  }

  render () {
    if (!this.state.sended) {
      return super.render();
    }

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    });

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default geoWall">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{this.props.header}</h1>
                      <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        <div className="instructions">
                          Merci, vous êtes désormais inscrit à nos newsletters
                        </div>
                      </div>
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

export default ModalNewsletter;
