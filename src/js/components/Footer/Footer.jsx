import React from 'react';
import Immutable from 'immutable';
import FooterSection from './FooterSection';

if (process.env.BROWSER) {
  //require('./Footer.less');
  require('../Welcome/WelcomeComponents/WelcomeFooter.less');
}

const sections = [
  {
    text: 'A propos',
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
  render() {
    return (
      <section className="welcome-footer">
        <div className="links">
          <div className="get-help">
            <h4>OBTENIR DE L'AIDE</h4>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="https://afrostream.tv/faq.html">
                  Les réponses à vos questions
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://afrostream.tv/cgu.html">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://afrostream.tv/policy.html">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
          <div className="get-help">
            <h4>AFROSTREAM</h4>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="https://afrostream.tv/blog">
                  Blog
                </a>
              </li>
              <li>
                <a className="footer-link"
                  href="mailto:christina@afrostream.tv?subject=Contact&cc=presse@afrostream.tv">
                  Presse
                </a>
              </li>
              <li>
                <a className="footer-link" href="mailto:investors@afrostream.tv?subject=Contact">
                  Investisseurs
                </a>
              </li>
            </ul>
          </div>
          <div className="get-help">
            <h4>SUIVEZ-NOUS</h4>
              <ul className="footer-links">
                <li>
                  <a className="footer-link" href="https://www.facebook.com/afrostreamtv?fref=ts">
                    Facebook <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="https://twitter.com/intent/user?screen_name=AFROSTREAM">
                    Twitter <i className="fa fa-twitter"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="legal-statements">
            <div className="links">
              <div className="get-help">
                <div className="legal-text">Copyright &copy; Afrostream 2015</div>
              </div>
              <div className="get-help">
                &nbsp;
              </div>
              <div className="get-help">
                <div className="legal-text">
                  <a href="https://afrostream.tv/legals.html">Mentions légales</a>
                </div>
              </div>
            </div>
          </div>
      </section>
    );
  }
}

export default Footer;
