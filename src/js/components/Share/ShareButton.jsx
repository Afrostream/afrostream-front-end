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
        dispatch,link,description,title
        }
      } = this;

    dispatch(ModalActionCreators.open('social', true, null, {link, description, title}));
  }

  render() {

    let favoriteClass = {
      'fa': true,
      'fa-share': true
    };

    const inputAttributes = {
      onClick: event => ::this.sharePopup()
    };
    return (<button className="btn share_button" type="button" data-toggle="tooltip"
                    data-placement="top"
                    title="Partager"  {...inputAttributes}>
      <i className={classSet(favoriteClass)}></i>
    </button>)
  }
}

ShareButton.propTypes = {
  link: React.PropTypes.string,
  description: React.PropTypes.string,
  title: React.PropTypes.string
};

ShareButton.defaultProps = {
  link: null,
  description: null,
  title: null
};

export default ShareButton;
