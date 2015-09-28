'use strict';
import dictFr from '../node_modules/auth0-lock/i18n/fr-FR.json';
import _ from 'lodash';
const customDict = _.merge(dictFr, {
  signin: {
    "title": "S’identifier",
    "action": "Se connecter"
  }
});

export default {
  /**
   * Front-End Server
   */
  google: {
    analyticsKey: process.env.GA_TRACKING_ID || 'UA-*******-**'
  },
  apiClient: {
    urlPrefix: process.env.API_CLIENT_END_POINT || process.env.API_END_POINT || 'http://localhost:3002/api',
    token: 'afro_token'
  },
  carousel: {
    interval: 10000
  },
  auth0: {
    clientId: process.env.AUTH0_CLIENT_ID || 'BtSdIqKqfIse0H1dqlpHFJgKIkUG0NpE',
    domain: process.env.AUTH0_DOMAIN || 'afrostream.eu.auth0.com',
    callbackUrl: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
    token: 'afroToken',
    tokenRefresh: 'afroRefreshToken',
    signIn: {
      dict: customDict,
      icon: '',
      theme: 'default',
      //signupLink: '/signup',
      resetLink: '/reset',
      connections: ['afrostream-front', 'facebook'],
      socialBigButtons: true,
      disableSignupAction: false,
      rememberLastLogin: false,
      disableResetAction: false,
      popup: true,
      sso: false,
      authParams: {
        scope: 'openid offline_access'
      }
    },
    signUp: {
      dict: 'fr',
      connections: ['afrostream-front', 'facebook'],
      socialBigButtons: true,
      popup: true,
      sso: false,
      authParams: {
        scope: 'openid offline_access'
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
        "wmode": "opaque"
      }
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
    "techOrder": ["html5", "dash", "hls", "flash", "streamroot", "srflash"],
    "plugins": {
      "chromecast": {
        "appId": process.env.CHROMECAST_ID || '',
        "metadata": {
          "title": "Title",
          "subtitle": "Subtitle"
        }
      },
      "ga": {}
    }
  }
};
