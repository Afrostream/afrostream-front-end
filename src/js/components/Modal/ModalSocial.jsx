import React from 'react'
import ModalComponent from './ModalComponent'
import classNames from 'classnames'
import config from '../../../../config'
import { getI18n } from '../../../../config/i18n'
import _ from 'lodash'
import { detectUA } from '../Player/PlayerUtils'
import { shorten } from '../../lib/bitly'
import qs from 'qs'
import window from 'global/window'

const {social, bitly, metadata} = config

if (process.env.BROWSER) {
  require('./ModalSocial.less')
}

class ModalSocial extends ModalComponent {

  async sharePopup (network) {
    const {
      props: {
        data
      }
    } = this

    let query = data && data.get('query')
    //add share tracking
    let shareParams = qs.stringify(_.merge({
      utm: 'share'
    }, query && query.toJS() || {}))

    let title = this.getMeta('og:title')
    let description = this.getMeta('og:description') || ''
    let url = `${this.getMeta('og:url')}?${shareParams}`
    let popupOpener
    let updatedParams

    if (data) {
      if (data.get('title')) {
        title = data.get('title')
      }
      if (data.get('description')) {
        description = data.get('description')
      }
      if (data.get('link')) {
        url = `${metadata.domain}/${data.get('link')}?${shareParams}`
      }
    }
    let self = this
    shorten({longUrl: url}).then((shortenData)=> {
      if (!shortenData || shortenData.status_code === 500) {
        throw new Error(shortenData.status_txt)
      }
      url = shortenData.data.url
      updatedParams = self.cloneParams(network, url, title, description, data)
      self.updateHref(network, updatedParams, popupOpener)
    }).catch((err)=> {
      console.log('bitly shorten error ', err)
      updatedParams = self.cloneParams(network, url, title, description, data)
      self.updateHref(network, updatedParams, popupOpener)
    })

    //if (network === social.networks.facebook && FB !== undefined) {
    //  return
    //}

    return popupOpener = this.updateHref()
  }

  cloneParams (network, url, title, description, full) {
    let params = _.cloneDeep(network[full ? 'fullParams' : 'params'])
    let updatedParams = _.mapValues(params, (value)=> {
      return value.replace(/{title}/gm, title).replace(/{description}/gm, description).replace(/{url}/gm, url)
    })
    return updatedParams
  }

  /**
   * @method _isEncoded
   * @description Wrapper to check if the string is encoded.
   * @private
   *
   * @param {String}  str
   * @param {Boolean}
   */
  isEncoded (str) {
    str = this.toRFC3986(str)
    return decodeURIComponent(str) !== str
  }

  /**
   * @method _encode
   * @description Wrapper to _encode a string if the string isn't already encoded.
   * @private
   *
   * @param {DOMNode} el
   * @param {String}  className
   */
  encode (str) {
    if (typeof str === 'undefined' || str === null || this.isEncoded(str))
      return encodeURIComponent(str)
    else
      return this.toRFC3986(str)
  }

  /**
   * @method toRFC3986
   * @description Encodes the string in RFC3986
   * @memberof String
   *
   * @return {String}
   */
  toRFC3986 (val) {
    let tmp = encodeURIComponent(val)
    tmp.replace(/[!'()*]/g, function (c) {
      return ` % ${c.charCodeAt(0).toString(16)}`
    })
  }


  /**
   * @method _getUrl
   * @description Returns the correct share URL based off of the incoming
   * URL and parameters given
   * @private
   *
   * @param {String} url
   * @param {boolean} encode
   * @param {Object} params
   */
  getUrl (url, encode = false, params = {}) {
    let qs = (() => {
      let results = []
      for (let k of Object.keys(params)) {
        let v = params[k]
        results.push(`${k}=${this.encode(v)}`)
      }
      return results.join('&')
    })()

    if (qs) qs = `?${qs}`

    return url + qs
  }

  /**
   * @method _updateHref
   * @description Makes the elements a tag have a href of the popup link and
   * as pops up the share window for the element
   * @private
   *
   * @param {DOMNode} element
   * @param {String} url
   * @param {Object} params
   */
  updateHref (data = null, params = null, popupOpener = null) {

    let shareUrl = ''

    //if (data === social.networks.facebook && FB !== undefined) {
    //  return FB.ui({
    //    method: 'send',
    //    link: params.url,
    //    caption: params.title,
    //    description: params.description
    //  }, function (response) {
    //  });
    //}

    if (popupOpener) {
      let encode = data.url.indexOf('mailto:') >= 0
      shareUrl = this.getUrl(data.url, !encode, params)
      return popupOpener.location = shareUrl
    }

    let popup = {
      width: 500,
      height: 350
    }

    popup.top = (screen.height / 2) - (popup.height / 2)
    popup.left = (screen.width / 2) - (popup.width / 2)
    return window.open(
      shareUrl,
      'targetWindow', `
        toolbar = no,
        location = no,
        status = no,
        menubar = no,
        scrollbars = yes,
        resizable = yes,
        left =${popup.left},
        top =${popup.top},
        width =${popup.width},
        height = ${popup.height}`
    )
  }

  getMeta (key) {
    let metas = document.getElementsByTagName('meta')

    let foundedMeta = _.find(metas, (meta)=> {
      return (key == meta.name || key == meta.getAttribute('property')) && meta.content
    })

    return foundedMeta && foundedMeta.content
  }

  getShareButtons () {
    return _.map(social.networks, (network) => {

      const ua = detectUA()

      if (!network.enabled) {
        return ''
      }

      if (!ua.getMobile().is('iPhone') && network.mobile) {
        return ''
      }
      const inputAttributes = {
        onClick: event => ::this.sharePopup(network)
      }

      let shareButtonClass = {
        'btn': true,
        'zmdi': true,
        'share_button': true
      }

      shareButtonClass[network.icon] = true

      return (<div className={classNames(shareButtonClass)} type="button" data-toggle="tooltip"
                   data-placement="top"
                   title={network.title}
                   key={`share-btn-${network.icon}`} {...inputAttributes}>
      </div>)
    })
  }

  render () {

    let popupClass = classNames({
      'popup': this.props.modal
    })

    let overlayClass = classNames({
      'overlay': this.props.modal,
      'active': true
    })

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default social">
          <div className="signin">
            <div className={popupClass}>
              <div className={overlayClass}>
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    {this.props.modal && <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{getI18n().social.title}</h1>
                      <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>}
                    <div className="mode-container">
                      <div className="mode">
                        {this.getShareButtons()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ModalSocial.propTypes = {
  data: React.PropTypes.object
}

ModalSocial.defaultProps = {
  data: null
}

export default ModalSocial
