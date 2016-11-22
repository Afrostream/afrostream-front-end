import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classSet from 'classnames'
import { withRouter } from 'react-router'
import { getI18n } from '../../../../config/i18n'
import _ from 'lodash'
import config from '../../../../config'
import { updateIntl } from 'react-intl-redux'
import {
  FormattedMessage,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./Footer.less')
}
@connect()
class Footer extends React.Component {

  constructor (props) {
    super(props)
    this.year = new Date().getFullYear()
  }

  switchLang (e, locale) {
    const {
      props: {
        dispatch
      }
    } = this
    e.preventDefault()
    const messages = _.flattenJson(getI18n(locale))

    dispatch(updateIntl({
      locale,
      messages
    }))
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
            <FormattedMessage tagName="h4"
                              id={ 'footer.support.title' }/>
            <ul className="footer-links">
              <li>
                <Link className="footer-link" to="/faq">
                  <FormattedMessage
                    id={ 'footer.support.faq' }
                  />
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/cgu">
                  <FormattedMessage
                    id={ 'footer.support.cgu' }
                  />
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/policy">
                  <FormattedMessage
                    id={ 'footer.support.policy' }
                  />
                </Link>
              </li>
              <li>
                <a className="footer-link" href="mailto:support@afrostream.tv">
                  <FormattedMessage
                    id={ 'footer.support.help' }
                  />
                </a>
              </li>
              <li>
                <a className="footer-link" href={`/${switchLangRoute}`}
                   onClick={e=>::this.switchLang(e, switchLangRoute)}>
                  <span className={`flag-icon flag-icon-${switchLang}`}></span>
                </a>
              </li>
            </ul>
          </div>
          <div className="get-help col-xs-12 col-md-4 padding-left-paiement hidden-xs">
            <FormattedMessage tagName="h4"
                              id={ 'footer.recharge.title' }/>
            <ul className="footer-links">
              <li>
                <Link className="footer-link" to="/cash">
                  <FormattedMessage
                    id={ 'footer.recharge.cashway' }
                  />
                  <img src="/images/payment/cashway-inline-white.png" width="60"
                       className="img-responsive"/>
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/store-locator">
                  <FormattedMessage
                    id={ 'footer.recharge.stores' }
                  />
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/coupon">
                  <FormattedMessage
                    id={ 'footer.recharge.coupon' }
                  />
                </Link>
              </li>
            </ul>
          </div>
          <div className="get-help col-xs-12 col-md-2 hidden-xs">
            <FormattedMessage tagName="h4"
                              id={ 'footer.pro.title' }/>

            <ul className="footer-links">
              <li>
                <Link className="footer-link" to="/company/jobs">
                  <FormattedMessage id={ 'footer.pro.jobs' }/>
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/submit-content">
                  <FormattedMessage id={ 'footer.pro.submit' }/>
                </Link>
              </li>
              <li>
                <a className="footer-link"
                   href="mailto:presse@afrostream.tv?subject=Contact">
                  <FormattedMessage id={ 'footer.pro.press' }/>
                </a>
              </li>
              <li>
                <Link className="footer-link" to="/company/press">
                  <FormattedMessage id={ 'footer.pro.mediaKit' }/>
                </Link>
              </li>
            </ul>
          </div>
          <div className="get-help col-xs-12 col-md-2 hidden-xs">
            <FormattedMessage tagName="h4"
                              id={ 'footer.apps.title' }/>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="https://itunes.apple.com/fr/app/afrostream/id1066377914?mt=8"
                   target="_blank">
                  <FormattedMessage id={ 'footer.apps.ios' }/><i className="zmdi zmdi-apple"/>
                </a>
              </li>
              <li>
                <a className="footer-link"
                   href="https://play.google.com/store/apps/details?id=tv.afrostream.app&hl=fr"
                   target="_blank">
                  <FormattedMessage id={ 'footer.apps.android' }/><i className="zmdi zmdi-android"/>
                </a>
              </li>
              <li>
                <a className="footer-link"
                   href="https://boutique.orange.fr/tv/pass-video"
                   target="_blank">
                  Orange <i className="zmdi zmdi-orange"/>
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://www.services.bouyguestelecom.fr/television/svod_afrostream"
                   target="_blank">
                  Bouygues <i className="zmdi zmdi-bouygues"/>
                </a>
              </li>
            </ul>
          </div>
          <div className="get-help col-xs-12 col-md-2 hidden-xs">
            <FormattedMessage tagName="h4"
                              id={ 'footer.social.title' }/>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="https://www.facebook.com/afrostreamtv?fref=ts">
                  <FormattedMessage id={ 'footer.social.facebook' }/><i className="zmdi zmdi-facebook"/>
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://twitter.com/intent/user?screen_name=AFROSTREAM">
                  <FormattedMessage id={ 'footer.social.twitter' }/><i className="zmdi zmdi-twitter"/>
                </a>
              </li>
              <li>
                <Link className="footer-link" to="/newsletter">
                  <FormattedMessage id={ 'footer.social.newsletter' }/>
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
              <Link to="/legals"><FormattedMessage id={ 'footer.legals' }/></Link>
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
