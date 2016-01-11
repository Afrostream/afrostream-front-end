import React from 'react';
import { connect } from 'react-redux';
import ModalGeoWall from './ModalGeoWall';
import ModalLogin from './ModalLogin';

if (process.env.BROWSER) {
  require('./Modal.less');
}

@connect(({ Modal }) => ({Modal}))
class Modal extends React.Component {

  render() {
    const {
      props: {
        Modal
        }
      } = this;

    var target = Modal.get('target');
    switch (target) {
      case 'geoWall':
        return (
          <ModalGeoWall {...this.props}/>
        );
      case 'show':
      case 'showSignin':
      case 'showSignup':
      case 'showReset':
        return (
          <ModalLogin type={target} {...this.props}/>
        );
      default:
        return false;
    }
  }
}

Modal.propTypes = {
  location: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  history: React.PropTypes.object
};

export default Modal;
