import React from 'react';
import ModalComponent from './ModalComponent';
import classNames from 'classnames';
import {social} from '../../../../config';
import _ from 'lodash';
import {detectUA} from '../Player/PlayerUtils';


if (process.env.BROWSER) {
  require('./ModalSocial.less');
}

class ModalSocial extends ModalComponent {

  sharePopup(network) {

    let title = this.getMeta('og:title');
    let description = this.getMeta('og:description') || '';
    let url = this.getMeta('og:url');

    let params = _.cloneDeep(network.params);
    let updatedParams = _.mapValues(params, (value)=> {
      return value.replace(/{title}/gm, title).replace(/{description}/gm, description).replace(/{url}/gm, url);
    });

    this.updateHref(network, updatedParams);
  }

  /**
   * @method _isEncoded
   * @description Wrapper to check if the string is encoded.
   * @private
   *
   * @param {String}  str
   * @param {Boolean}
   */
  isEncoded(str) {
    str = this.toRFC3986(str);
    return decodeURIComponent(str) !== str;
  }

  /**
   * @method _encode
   * @description Wrapper to _encode a string if the string isn't already encoded.
   * @private
   *
   * @param {DOMNode} el
   * @param {String}  className
   */
  encode(str) {
    if (typeof str === 'undefined' || str === null || this.isEncoded(str))
      return encodeURIComponent(str);
    else
      return this.toRFC3986(str);
  }

  /**
   * @method toRFC3986
   * @description Encodes the string in RFC3986
   * @memberof String
   *
   * @return {String}
   */
  toRFC3986(val) {
    let tmp = encodeURIComponent(val);
    tmp.replace(/[!'()*]/g, function (c) {
      return `%${c.charCodeAt(0).toString(16)}`;
    });
  };


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
  getUrl(url, encode = false, params = {}) {
    let qs = (() => {
      let results = [];
      for (let k of Object.keys(params)) {
        let v = params[k];
        results.push(`${k}=${this.encode(v)}`);
      }
      return results.join('&');
    })();

    if (qs) qs = `?${qs}`;

    return url + qs;
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
  updateHref(data, params) {
    let encode = data.url.indexOf('mailto:') >= 0;
    let shareUrl = this.getUrl(data.url, !encode, params);

    let popup = {
      width: 500,
      height: 350
    };

    popup.top = (screen.height / 2) - (popup.height / 2);
    popup.left = (screen.width / 2) - (popup.width / 2);

    window.open(
      shareUrl,
      'targetWindow', `
          toolbar=no,
          location=no,
          status=no,
          menubar=no,
          scrollbars=yes,
          resizable=yes,
          left=${popup.left},
          top=${popup.top},
          width=${popup.width},
          height=${popup.height}
        `
    );
  }

  getMeta(key) {
    let metas = document.getElementsByTagName('meta');

    let foundedMeta = _.find(metas, (meta)=> {
      return (key == meta.name || key == meta.getAttribute('property')) && meta.content;
    });

    return foundedMeta && foundedMeta.content;
  }

  getShareButtons() {
    return _.map(social.networks, (network) => {

      const ua = detectUA();

      if (!network.enabled) {
        return '';
      }

      if (!ua.getMobile().mobile() && network.mobile) {
        return '';
      }
      const inputAttributes = {
        onClick: event => ::this.sharePopup(network)
      };

      let shareClass = {
        'fa': true
      };

      shareClass[network.icon] = true;

      return (<div className="btn share_button" role="button" key={`share-btn-${network.icon}`} {...inputAttributes}>
        <i className={classNames(shareClass)}></i>
      </div>)
    });
  }

  render() {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    });

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default social">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{social.dict.title}</h1>
                      <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>
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
    );
  }
}

export default ModalSocial;
