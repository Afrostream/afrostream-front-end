'use strict';
import dictFr from '../node_modules/auth0-lock/i18n/fr-FR.json';
import _ from 'lodash';
import castlab from './player/castlab';
const customDict = _.merge(dictFr, {
  signin: {
    "title": "S’identifier",
    "action": "Se connecter"
  },
  signup: {
    "serverErrorText": "Votre compte existe déjà. Appuyer sur le bouton connexion pour activer votre abonnement."
  }
});

import {canUseDOM} from 'react/lib/ExecutionEnvironment';

const auth0ClientId = process.env.AUTH0_CLIENT_ID || 'dev';

// hack for auth0 mock.
let auth0MockDomain, auth0MockAssetsUrl;
if (auth0ClientId === 'dev') {
  /*
   dev environment
   */
  const auth0MockUseHttps = true;  // on any auth0 error, you can switch this to true.
  auth0MockDomain = auth0MockUseHttps ? '127.0.0.1:3443' : '127.0.0.1:3080';
  auth0MockAssetsUrl = auth0MockUseHttps ? undefined : 'http://' + auth0MockDomain + '/';

  if (!auth0MockUseHttps && canUseDOM) {
    // we "Override" xhr.open to rewrite https request to http requests.
    window.XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url) {
      if (arguments[1].indexOf(config.auth0.domain) !== -1) {
        arguments[1] = arguments[1].replace(/^https/, 'http');
      }
      return this.realOpen.apply(this, arguments);
    };
  }
}

const config = {
  /**
   * Front-End Server
   */
  google: {
    analyticsKey: process.env.GA_TRACKING_ID || 'UA-*******-**'
  },
  apiClient: {
    urlPrefix: process.env.API_CLIENT_END_POINT || process.env.API_END_POINT || 'http://localhost:3002/api',
    token: 'afro_token',
    tokenRefresh: 'afro_refresh_token'
  },
  carousel: {
    interval: 10000
  },
  intercom: {
    url: 'https://widget.intercom.io/widget/',
    appID: 'k3klwkxq'
  },
  auth0: {
    clientId: auth0ClientId,
    domain: process.env.AUTH0_DOMAIN || auth0MockDomain,
    callbackUrl: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
    assetsUrl: auth0MockAssetsUrl,
    token: 'afroToken',
    tokenRefresh: 'afroRefreshToken',
    signIn: {
      dict: customDict,
      icon: '',
      theme: 'default',
      //signupLink: '/signup',
      resetLink: '/reset',
      connections: [process.env.AUTH0_CONNECTION || 'afrostream-front-dev', 'facebook'],
      socialBigButtons: true,
      disableSignupAction: false,
      rememberLastLogin: false,
      disableResetAction: false,
      popup: true,
      sso: false,
      authParams: {
        scope: 'openid'
      }
    },
    signUp: {
      dict: 'fr',
      connections: [process.env.AUTH0_CONNECTION || 'afrostream-front-dev', 'facebook'],
      socialBigButtons: true,
      popup: true,
      sso: false,
      authParams: {
        scope: 'openid'
      }
    }
  },
  recurly: {
    key: process.env.RECURLY_PUBLIC_KEY || 'sjc-ZhO4HmKNWszC5LIA8BcsMJ'
  },
  algolia: {
    appId: process.env.ALGOLIA_APP_ID || '3OKNPL7ZVA',
    apiKey: process.env.ALGOLIA_API_KEY || '3e6547172fb6d80b2ae02d6369edfc72'
  },
  player: {
    "autoplay": true,
    "controls": true,
    "width": "100%",
    "height": "100%",
    "language": "fr",
    "flash": {
      "params": {
        "wmode": "direct"
      }
    },
    "hls": {
      "params": {
        "wmode": "direct"
      }
    },
    "metrics": {
      'user_id': ''
    },
    "languages": {
      "fr": {
        "Play": "Lecture",
        "Pause": "Pause",
        "Current Time": "Temps actuel",
        "Duration Time": "Durée",
        "Remaining Time": "Temps restant",
        "Stream Type": "Type de flux",
        "LIVE": "EN DIRECT",
        "Loaded": "Chargé",
        "Progress": "Progression",
        "Fullscreen": "Plein écran",
        "Non-Fullscreen": "Fenêtré",
        "Mute": "Sourdine",
        "Unmuted": "Son activé",
        "Playback Rate": "Vitesse de lecture",
        "Subtitles": "Sous-titres",
        "subtitles off": "Sous-titres désactivés",
        "Captions": "Sous-titres",
        "captions off": "Sous-titres désactivés",
        "Chapters": "Chapitres",
        "You aborted the media playback": "Vous avez interrompu la lecture de la vidéo.",
        "A network error caused the media download to fail part-way.": "Une erreur de réseau a interrompu le téléchargement de la vidéo.",
        "The media could not be loaded, either because the server or network failed or because the format is not supported.": "Cette vidéo n'a pas pu être chargée, soit parce que le serveur ou le réseau a échoué ou parce que le format n'est pas reconnu.",
        "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "La lecture de la vidéo a été interrompue à cause d'un problème de corruption ou parce que la vidéo utilise des fonctionnalités non prises en charge par votre navigateur.",
        "No compatible source was found for this media.": "Aucune source compatible n'a été trouvée pour cette vidéo."
      }
    },
    "sr_options": {
      "ID_CLIENT": process.env.STREAMROOT_CLIENT_ID || 'ry-0gzuhlor',
      "TRACKER_URL": process.env.STREAMROOT_TRACKER_URL || ''
    },
    "dasheverywhere": castlab,
    //"techOrder": ["dasheverywhere", "html5"],
    "techOrder": ["hls", "dash", "html5"],
    "plugins": {
      "chromecast": {
        "appId": process.env.CHROMECAST_ID || '',
        "metadata": {
          "title": "Title",
          "subtitle": "Subtitle"
        }
      },
      "ga": {},
      "audiotracks": {
        "title": "Langues"
      }
    }
  }
};

export default config;
