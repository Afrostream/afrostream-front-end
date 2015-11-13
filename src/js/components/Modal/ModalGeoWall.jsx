import React from 'react';
import * as ModalActionCreators from '../../actions/modal';
import * as WaitingUsersActionCreators from '../../actions/waitingUsers';

if (process.env.BROWSER) {
  require('./ModalGeoWall.less');
}

class ModalGeoWall extends React.Component {
  handleClose(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.dispatch(ModalActionCreators.close())
  }

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
          <p className="center bold">Sorry !<br/>
            Afrostream is not available in your country yet</p>
          <p className="formText">
            Enter your email to stay informed :
          </p>
          <p>
            <form onSubmit={::this.handleSubmit}>
              <input type="text" name="email" ref="email" placeholder="Email"/>
              <button type="submit" className="btn btn-ok btn-default pull-right">OK</button>
            </form>
          </p>
        </div>
      </div>
    );
  }
}

export default ModalGeoWall;
