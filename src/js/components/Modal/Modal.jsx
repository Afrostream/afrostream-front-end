import React from 'react';
import { connect } from 'react-redux';
import ModalGeoWall from './ModalGeoWall';
import ModalOAuth from './ModalOAuth';

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
          <ModalGeoWall dispatch={this.props.dispatch}/>
        );
      case 'login':
        return (
          <ModalOAuth {...this.props}/>
        );
      default:
        return false;
    }
  }
}

export default Modal;
