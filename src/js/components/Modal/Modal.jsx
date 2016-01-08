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
      case 'login':
        return (
          <ModalLogin {...this.props}/>
        );
      default:
        return false;
    }
  }
}

export default Modal;
