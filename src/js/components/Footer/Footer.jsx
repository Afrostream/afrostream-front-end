import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classSet from 'classnames'
import { withRouter } from 'react-router'
import { getI18n } from '../../../../config/i18n'
import _ from 'lodash'
import config from '../../../../config'

if (process.env.BROWSER) {
  require('./Footer.less')
}
@connect()
class Footer extends React.Component {

  constructor (props) {
    super(props)
    this.year = new Date().getFullYear()
  }

  render () {

    const {
      props: {
        params,
        router,
        routes
      }
    } = this

    let {lang} = params

    let labels = getI18n(lang).footer
    let switchLang = lang === 'en' ? 'fr' : 'us'
    let switchLangRoute = lang === 'en' ? 'fr' : 'en'
    let hasPlayer = router.isActive('player') || _.find(routes, route => ( route.name === 'player'))

    let footerClasses = {
      'footer': true,
      'footer-hidden': hasPlayer
    }

    return (
      <footer className={classSet(footerClasses)}>
        <div className="links row-fluid">
          <div className={`get-help col-xs-12 col-md-2`}>
            <h4>{labels.support.title}</h4>
            <ul className="footer-links">
              <li>
                <Link className="footer-link" to="/faq">
                  {labels.support.faq}
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/cgu">
                  {labels.support.cgu}
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/policy">
                  {labels.support.policy}
                </Link>
              </li>
              <li>
                <a className="footer-link" href="mailto:support@afrostream.tv">
                  {labels.support.help}
                </a>
              </li>
              <li>
                <a className="footer-link" href={`/${switchLangRoute}`}>
                  <span className={`flag-icon flag-icon-${switchLang}`}></span>
                </a>
              </li>
            </ul>
          </div>
          <div className="get-help col-xs-12 col-md-4 padding-left-paiement">
            <h4>{labels.recharge.title}</h4>
            <ul className="footer-links">
              <li>
                <Link className="footer-link" to="/cash">
                  {labels.recharge.cashway}<img src="/images/payment/cashway-inline-white.png" width="60"
                                                className="img-responsive"/>
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/coupon">
                  {labels.recharge.coupon}
                </Link>
              </li>
            </ul>
          </div>
          <div className="get-help col-xs-12 col-md-2">
            <h4>{labels.pro.title}</h4>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="https://afrostream.tv/blog">
                  {labels.pro.blog}
                </a>
              </li>
              <li>
                <a className="footer-link"
                   href="mailto:presse@afrostream.tv?subject=Contact">
                  {labels.pro.press}
                </a>
              </li>
              <li>
                <a className="footer-link" href="mailto:investors@afrostream.tv?subject=Contact">
                  {labels.pro.investissor}
                </a>
              </li>
              <li>
                <Link className="footer-link" to="/company/press">
                  {labels.pro.mediaKit}
                </Link>
              </li>
            </ul>
          </div>
          <div className="get-help col-xs-12 col-md-2">
            <h4> {labels.apps.title}</h4>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="https://itunes.apple.com/fr/app/afrostream/id1066377914?mt=8"
                   target="_blank">
                  {labels.apps.ios} <i className="zmdi zmdi-apple"></i>
                </a>
              </li>
              <li>
                <a className="footer-link"
                   href="https://play.google.com/store/apps/details?id=tv.afrostream.app&hl=fr"
                   target="_blank">
                  {labels.apps.android} <i className="zmdi zmdi-android"></i>
                </a>
              </li>
              <li>
                <a className="footer-link"
                   href="https://boutique.orange.fr/tv/pass-video"
                   target="_blank">
                  Orange <i className="zmdi zmdi-orange"></i>
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://www.services.bouyguestelecom.fr/television/svod_afrostream"
                   target="_blank">
                  Bouygues <i className="zmdi zmdi-bouygues"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="get-help col-xs-12 col-md-2">
            <h4>{labels.social.title}</h4>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="https://www.facebook.com/afrostreamtv?fref=ts">
                  {labels.social.facebook} <i className="zmdi zmdi-facebook"></i>
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://twitter.com/intent/user?screen_name=AFROSTREAM">
                  {labels.social.twitter} <i className="zmdi zmdi-twitter"></i>
                </a>
              </li>
              <li>
                <Link className="footer-link" to="/newsletter">
                  {labels.social.newsletter}
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/company/jobs">
                  {labels.pro.jobs}
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/submit-content">
                  {labels.pro.submit}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="legal-statements">
          <div className="links row">
            <div className="get-help col-md-6">
              Copyright &copy; Afrostream Inc. {this.year}
            </div>
            <div className="get-help col-md-6">
              <Link to="/legals"> {labels.legals}</Link>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

Footer.propTypes = {
  history: PropTypes.object
}

export default withRouter(Footer)
