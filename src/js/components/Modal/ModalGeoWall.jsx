import React from 'react';
import * as ModalActionCreators from '../../actions/modal';
import * as WaitingUsersActionCreators from '../../actions/waitingUsers';
import ModalComponent from './ModalComponent';

if (process.env.BROWSER) {
  require('./ModalGeoWall.less');
}

class ModalGeoWall extends ModalComponent {

  handleSubmit(e) {
    e.stopPropagation();
    e.preventDefault();
    const email = this.refs.email.getDOMNode().value;
    this.props.dispatch(WaitingUsersActionCreators.create(email));
    this.props.dispatch(ModalActionCreators.close());
  }

  render() {
    return (
      <div className="modalDialog geoWall">
        <div>
          <a onClick={::this.handleClose} title="Close" className="close">X</a>
          <p className="center bold">Coming Soon</p>
          <p className="formText">We are not yet available in your country.</p>
          <p className="formText">
            Enter your details below and be the first to get notified when we launch there :
          </p>
          <form onSubmit={::this.handleSubmit}>
            <input type="text" name="email" ref="email" placeholder="example@address.com"/>
            <button type="submit" className="btn btn-ok btn-default pull-right">Notify me</button>
          </form>
        </div>
      </div>
    );
  }
}

export default ModalGeoWall;
