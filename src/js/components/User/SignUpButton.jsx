import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';

if (process.env.BROWSER) {
  require('./SignUpButton.less');
}

@connect(({}) => ({}))
class SignUpButton extends React.Component {

  render() {
    return (<button className="subscribe-button" type=" button" onClick={::this.showLock}
                    dangerouslySetInnerHTML={{__html:  this.props.label}}/>);
  }

  showLock() {
    const {
      props: {
        dispatch
      }
    } = this;

    dispatch(ModalActionCreators.open('showSignup'));
  }

}

SignUpButton.propTypes = {
  label: React.PropTypes.string
};

SignUpButton.defaultProps = {
  label: 'DÉMARREZ VOTRE SEMAINE<br />D’ESSAI OFFERTE'
};

export default SignUpButton;
