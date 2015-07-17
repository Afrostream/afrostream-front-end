import React from 'react';
import Immutable from 'immutable';
import FooterSection from './FooterSection';

if (process.env.BROWSER) {
  require('./Footer.less');
}

const sections = [
  {
    text: 'A propos de ma putain',
    links: [
      {link: '/contact', text: 'Contactez-nous'},
      {link: '/cgu', text: 'Conditions d’utilisation'},
      {link: '/legals', text: 'Mentions légales'}
    ]
  },
  {
    text: 'Informations',
    links: [
      {link: '/compte', text: 'Contactez-nous'}
    ]
  },
  {
    text: 'Suivez-nous',
    links: [
      {link: 'http://www.facebook.com', text: 'facebook', icon: 'fa fa-facebook', isExternal: true},
      {link: 'http://www.twitter.com', text: 'twitter', icon: 'fa fa-twitter', isExternal: true},
      {link: 'http://www.google.com', text: 'google-plus', icon: 'fa fa-google-plus', isExternal: true},
      {link: 'http://www.pinterest.com', text: 'pinterest', icon: 'fa fa-pinterest-p', isExternal: true}
    ]
  }
];

class Footer extends React.Component {

  //static propTypes = {
  //  links: PropTypes.instanceOf(Immutable.List).isRequired
  //}

  render() {
    //const {
    //props: { links }
    //} = this;

    return (
      <footer className="footer">
        <div className="footer-container container">
          <div className="footer-menu row row-centered">
            {sections.map((section, i) => <FooterSection key={i} {...{section}} />)}
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
