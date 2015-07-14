import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import FooterLinkItem from './FooterLinkItem';

class FooterSection extends React.Component {

  static propTypes = {
    section: PropTypes.object.isRequired
  }

  render() {
    const {
      props: { section }
      } = this;

    return (
      <div className="footer-section pure-u-1 pure-u-md-1-3">
        <div className="footer-section-label">{section.text}</div>
        <ul className="footer-links">
          {section.links.map((link, i) => <FooterLinkItem key={i} index={i} {...{link}} />)}
        </ul>
      </div>
    );
  }
}

export default FooterSection;
