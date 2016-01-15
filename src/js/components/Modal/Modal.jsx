import React from 'react';
import { connect } from 'react-redux';
import ModalGeoWall from './ModalGeoWall';
import ModalLogin from './ModalLogin';

if (process.env.BROWSER) {
  require('./Modal.less');
}

@connect(({ Modal }) => ({Modal}))
class Modal extends React.Component {

  static contextTypes = {
    location: React.PropTypes.object,
    history: React.PropTypes.object
  };

  render() {
    const {
      props: {
        Modal
        }
      } = this;

    const target = Modal.get('target');
    const closable = Modal.get('closable');

    switch (target) {
      case 'geoWall':
        return (
          <ModalGeoWall closable={closable} {...this.props}/>
        );
      case 'show':
      case 'showSignin':
      case 'showSignup':
      case 'showReset':
      case 'showGift':
        return (
          <ModalLogin type={target} closable={closable} {...this.props}/>
        );
      default:
        return false;
    }
  }
}

Modal.propTypes = {
  dispatch: React.PropTypes.func
};

export default Modal;
