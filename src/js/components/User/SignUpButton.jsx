import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';

if (process.env.BROWSER) {
  require('./SignUpButton.less');
}

@connect(({}) => ({}))
class SignUpButton extends React.Component {

  render () {
    return (<button className={this.props.className} type=" button" onClick={::this.showLock}
                    dangerouslySetInnerHTML={{__html:  this.props.label}}/>);
  }

  showLock () {
    const {
      props: {
        dispatch
      }
    } = this;

    dispatch(ModalActionCreators.open('showSignup', true, this.props.to));
  }

}

SignUpButton.propTypes = {
  label: React.PropTypes.string,
  className: React.PropTypes.string,
  to: React.PropTypes.string
};

SignUpButton.defaultProps = {
  label: 'DÉMARREZ VOTRE SEMAINE<br />D’ESSAI OFFERTE',
  className: 'subscribe-button',
  to: ''
};

export default SignUpButton;
