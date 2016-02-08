import React from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./ShareButton.less');
}

@connect(({ Modal }) => ({Modal}))
class ShareButton extends React.Component {

  constructor(props) {
    super(props);
  }

  sharePopup() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(ModalActionCreators.open('social'));
  }

  render() {

    let favoriteClass = {
      'fa': true,
      'fa-share-alt': true
    };

    const inputAttributes = {
      onClick: event => ::this.sharePopup()
    };

    return (<div className="btn share_button" role="button"  {...inputAttributes}>
      <i className={classSet(favoriteClass)}></i>
    </div>)
  }
}

export default ShareButton;
