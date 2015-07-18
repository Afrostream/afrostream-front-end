import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';

class FooterLinkItem extends React.Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    link: PropTypes.object.isRequired
  };


  render() {
    const {
      props: { link, index },
      } = this;

    const menuClass = 'footer-menu-link ' + (this.props.index > 0 ? ' link-border' : '');

    return (
      <div className={menuClass}>
        {this.renderLink()}
      </div>
    );
  }

  renderIcon() {
    if (this.props.link.icon) {
      return (<i className={this.props.link.icon + ' fa-2x'}></i>)
    } else {
      return (<span>{this.props.link.text}</span>)
    }
  }

  renderLink() {

    if (this.props.link.isExternal)
      return (
        <a href={this.props.link.link} target="_blank">
          {this.renderIcon()}
        </a>
      )
    else
      return (

        <Link to={this.props.link.link}>
          {this.renderIcon()}
        </Link>
      )
  }
}

export default FooterLinkItem;
