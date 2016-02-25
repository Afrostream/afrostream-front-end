import React, { Component, PropTypes } from 'react';
import MobileDetect from 'mobile-detect';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

if (process.env.BROWSER) {
  require('./SmartBaner.less');
}

class SmartBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true
    }
  }

  static propTypes = {
    daysHidden: PropTypes.number,
    daysReminder: PropTypes.number,
    appStoreLanguage: PropTypes.string,
    button: PropTypes.string,
    storeText: PropTypes.objectOf(PropTypes.string),
    price: PropTypes.objectOf(PropTypes.string),
    force: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string
  };

  static defaultProps = {
    daysHidden: 15,
    daysReminder: 90,
    appStoreLanguage: null,
    button: 'View',
    storeText: {
      ios: 'On the App Store',
      android: 'In Google Play',
      windows: 'In Windows Store'
    },
    price: {
      ios: 'Free',
      android: 'Free',
      windows: 'Free'
    },
    force: '',
    title: '',
    author: ''
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.force !== this.props.force) {
      this.setType(nextProps.force);
    }
  }

  componentDidMount() {
    this.setType(this.props.force);
  }

  type = '';
  appId = '';
  settings = {};

  parseAppId() {
    let meta = document.querySelector('meta[name="' + this.settings.appMeta + '"]');
    if (!meta) {
      return '';
    }

    if (this.type === 'windows') {
      this.appId = meta.getAttribute('content');
    } else {
      this.appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];
    }

    return this.appId;
  }

  setType(deviceType) {
    if (!canUseDOM || !localStorage || !navigator) {
      return true;
    }
    let appStoreLanguage = this.props.appStoreLanguage || navigator.language.slice(-2) || navigator.userLanguage.slice(-2);
    let mixins = {
      ios: {
        appMeta: 'apple-itunes-app',
        iconRels: ['apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () => {
          return 'https://itunes.apple.com/' + appStoreLanguage + '/app/id' + this.appId;
        }
      },
      android: {
        appMeta: 'google-play-app',
        iconRels: ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () => {
          return 'http://play.google.com/store/apps/details?id=' + this.appId;
        }
      },
      windows: {
        appMeta: 'msApplication-ID',
        iconRels: ['windows-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () => {
          return 'http://www.windowsphone.com/s?appid=' + this.appId;
        }
      }
    };

    const userAgent = (window.navigator && navigator.userAgent) || '';
    let agent = new MobileDetect(userAgent);

    if (deviceType.length) {
      this.type = deviceType;
    } else if (agent.is('WindowsMobileOS') || agent.is('WindowsPhoneOS')) {
      this.type = 'windows';
      //iOS >= 6 has native support for Smart Banner
    } else if (agent.is('iOS') && parseInt(agent.version('iOS'), 10) < 6) {
      this.type = 'ios';
    } else if (agent.is('AndroidOS')) {
      this.type = 'android';
    }

    this.settings = mixins[this.type];

    // Don't show banner if device isn't iOS or Android, website is loaded in app,
    // user dismissed banner, or we have no app id in meta

    let disabled = this.hasCookies() || this.parseAppId() === '';
    this.setState({
      disabled: disabled
    });

    if (disabled) {
      this.hide();
    } else {
      this.show();
    }
  }

  hide() {
    document.querySelector('html').classList.remove('smartbanner-show');
  }

  show() {
    document.querySelector('html').classList.add('smartbanner-show');
  }

  close() {
    this.hide();
    let expires = new Date(Date.now() + (this.props.daysHidden * 1000 * 60 * 60 * 24)).toISOString();
    localStorage.setItem('smartbanner-closed', JSON.stringify({expiresAt: expires}));

  }

  install() {
    this.hide();
    let expires = new Date(Date.now() + (this.props.daysReminder * 1000 * 60 * 60 * 24)).toISOString();
    localStorage.setItem('smartbanner-installed', JSON.stringify({expiresAt: expires}));
  }

  hasCookies() {

    let closed;
    let installed;
    let closedExpire;
    let instExpire;

    try {
      closed = localStorage.getItem('smartbanner-closed');
      installed = localStorage.getItem('smartbanner-installed');
      closedExpire = JSON.parse(closed);
      instExpire = JSON.parse(installed);
      let now = Date.now();
      if (closedExpire) {
        closed = new Date(closedExpire.expiresAt).getTime() > now;
      }
      if (instExpire) {
        installed = new Date(instExpire.expiresAt).getTime() > now;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    if (!this.type
      || navigator.standalone
      || closed
      || installed) {
      return true;
    }

    return false;
  }

  render() {
    // Don't show banner if device isn't iOS or Android, website is loaded in app,
    // user dismissed banner, or we have no app id in meta
    if (this.state.disabled) {
      return (<div />);
    }

    let link = this.settings.getStoreLink();
    let inStore = this.props.price[this.type] + ' - ' + this.props.storeText[this.type];
    let icon;
    for (let i = 0, max = this.settings.iconRels.length; i < max; i++) {
      let rel = document.querySelector('link[rel="' + this.settings.iconRels[i] + '"]');
      if (rel) {
        icon = rel.getAttribute('href');
        break;
      }
    }

    let wrapperClassName = 'smartbanner smartbanner-' + this.type;
    let iconStyle = {
      backgroundImage: 'url(' + icon + ')'
    };

    return (
      <div className={wrapperClassName}>
        <div className="smartbanner-container">
          <a className="smartbanner-close" onClick={::this.close}>&times;</a>
          <span className="smartbanner-icon" style={iconStyle}></span>
          <div className="smartbanner-info">
            <div className="smartbanner-title">{this.props.title}</div>
            <div>{this.props.author}</div>
            <span>{inStore}</span>
          </div>

          <a href={link} onClick={::this.install} className="smartbanner-button">
            <span className="smartbanner-button-text">{this.props.button}</span>
          </a>
        </div>
      </div>
    );
  }
}

export default SmartBanner;
