import React from 'react';
import { Link } from 'react-router';
if (process.env.BROWSER) {
  require('./Footer.less');
}

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.year = new Date().getFullYear();
  }

  render() {
    return (
      <footer className="footer">
        <div className="links">
          <div className="get-help">
            <h4>OBTENIR DE L'AIDE</h4>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="mailto:support@afrostream.tv">
                  Support
                </a>
              </li>
              <li>
                <Link className="footer-link" to="/faq">
                  Les réponses à vos questions
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/cgu">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/policy">
                  Politique de confidentialité
                </Link>
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
          <div className="get-help">
            <h4>APPLICATIONS MOBILE</h4>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="https://itunes.apple.com/fr/app/afrostream/id1066377914?mt=8"
                   target="_blank">
                  IOS <i className="fa fa-apple"></i>
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://play.google.com/store/apps/details?id=tv.afrostream.app&hl=fr"
                   target="_blank">
                  Android <i className="fa fa-android"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="legal-statements">
          <div className="links">
            <div className="get-help">
              <div className="legal-text">Copyright &copy; Afrostream {this.year}</div>
            </div>
            <div className="get-help">
              &nbsp;
            </div>
            <div className="get-help">
              <div className="legal-text">
                <Link to="/legals">Mentions légales</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
