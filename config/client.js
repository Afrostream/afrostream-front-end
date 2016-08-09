import { isBoolean } from '../src/js/lib/utils'

const protData = {
  'com.widevine.alpha': {
    'drmtoday': true,
    'serverURL': 'https://lic.staging.drmtoday.com/license-proxy-widevine/cenc/',
    'httpRequestHeaders': {
      'dt-custom-data': ''
    }
  },
  'com.microsoft.playready': {
    'drmtoday': true,
    'serverURL': 'https://lic.staging.drmtoday.com/license-proxy-headerauth/drmtoday/RightsManager.asmx',
    'httpRequestHeaders': {
      'http-header-CustomData': ''
    }
  },
  'com.adobe.flashaccess': {
    'drmtoday': true,
    'serverURL': 'https://lic.staging.drmtoday.com/flashaccess/LicenseTrigger/v1',
    'httpRequestHeaders': {
      'customData': null
    }
  },
  'org.w3.clearkey': {
    'clearkeys': {
      '21920416600048BC8DBB9A45FD4A3B9E': '0001020304050607'
    }
  }
}

const client = {
  featuresFlip: {
    recurly: false,
    gocardless: true,
    paypal: true,
    cashway: true,
    braintree: true,
    stripe: false,
    sponsorship: true
  },
  /**
   * APPS
   */
  apps: {
    iosAppId: 'app-id=1066377914',
    androidAppId: 'app-id=tv.afrostream.app',
    params: {
      title: 'Application Afrostream',
      button: 'Voir',
      price: {ios: 'GRATUITE', android: 'GRATUITE'},
      storeText: {ios: 'Sur l’ App Store', android: 'Sur Google Play'}
    }
  },
  /**
   * Front-End Server
   */
  externalsJs: [
    '//www.gstatic.com/cv/js/sender/v1/cast_sender.js',
    '//smartplugin.youbora.com/v5/javascript/videojs5/5.1.3/sp.min.js'
  ],
  gocarlessApi: '//pay' + (process.env.NODE_ENV !== 'production' ? '-sandbox' : '') + '.gocardless.com/js/beta',
  recurlyApi: '//js.recurly.com/v3/recurly.js',
  cashwayApi: '//maps.cashway.fr/js/cwm.min.js',
  stripeApi: '//js.stripe.com/v2/',
  braintreeApi: '//js.braintreegateway.com/js/braintree-2.25.0.min.js',
  promoCodes: [
    {
      code: 'AFROLOVER',
      date: '2016/02/15',
      promoHeader: 'Offrez 1 an de film pour 39,99 EUROS',
      promoConditions1: '* Valable sur la formule cadeau.',
      promoConditions2: '12 mois d\'abonnement inclus dans le prix'
    },
    {
      code: 'SENEGALSERIE',
      date: '2016/02/15',
      promoHeader: 'PROFITEZ D\'UN MOIS À -50%',
      promoConditions1: '* Valable sur la formule mensuelle sans engagement.',
      promoConditions2: 'Soit 3,50 euros au lieu de 6,99 euros le premier mois, puis 6,99 euros par mois sans engagement'
    }
  ],
  payment: {
    default: 'card' //paypal/gocardless/card
  },
  //add alerts to front (same as cookies)
  alerts: [],
  google: {
    analyticsKey: process.env.GA_TRACKING_ID || 'UA-*******-**'
  },
  facebook: {
    appId: '828887693868980',
    sdkVersion: 'v2.6',
    analyticsKey: process.env.FB_TRACKING_ID || '1594872720779391'
  },
  apiClient: {
    protocol: process.env.API_CLIENT_PROTOCOL || 'http',
    authority: process.env.API_CLIENT_AUTHORITY || 'localhost:3002',
    urlPrefix: process.env.API_CLIENT_END_POINT || process.env.API_END_POINT || 'http://localhost:3002',
    token: 'accessToken'
  },
  images: {
    quality: 65,
    type: 'jpg'
  },
  sendBird: {
    appId: process.env.SENDBIRD_APP_ID || '',
    apiToken: process.env.SENDBIRD_API_TOKEN || '',
    channels: [
      295,
      204,
      308
    ]
  },
  sentry: {
    dns: process.env.SENTRY_DSN || 'https://24502de12b75437cb3783c395bd466f0@app.getsentry.com/59853',
    config: {}
  },
  fastly: {
    serviceId: process.env.FASTLY_SERVICE_ID || 'hc67hHS6Htz3hw4rEVvcc',
    key: process.env.FASTLY_API_KEY || '642762a026b388ab03a60d3fa55b2877'
  },
  carousel: {
    interval: 10000
  },
  sponsors: {
    maxSponsors: 10,
    couponsCampaignBillingUuid: process.env.SPONSORSHIP_BILLING_UUID || 'a94bb541-090d-44b2-b9d2-6e557c212566'
  },
  intercom: {
    url: 'https://widget.intercom.io/widget/',
    appID: 'k3klwkxq'
  },
  movies: {
    isNew: {
      episode: 2,
      movie: 10,
      season: 20
    }
  },
  reco: {
    enabled: true,
    limit: 3,
    time: 45
  },
  oauth2: {
    providers: [
      {
        name: 'facebook',
        social: true,
        icon: 'zmdi zmdi-facebook-box',
        active: isBoolean(process.env.OAUTH_FACEBOOK_ENABLED || true)
      },
      {
        name: 'bouygues',
        social: false,
        icon: 'zmdi zmdi-bouygues',
        active: isBoolean(process.env.OAUTH_BOUYGUES_ENABLED || true)
      },
      {
        name: 'orange',
        social: false,
        icon: 'zmdi zmdi-orange',
        active: isBoolean(process.env.OAUTH_ORANGE_ENABLED || true)
      }
    ]
  },
  social: {
    networks: {
      facebook: {
        enabled: true,      // Enable Facebook. [Default: true]
        icon: 'zmdi-facebook',
        url: 'https://www.facebook.com/sharer/sharer.php',
        title: 'Facebook',
        params: {
          u: '{url}',
          s: 'En ce moment je regarde "{title}" sur @afrostream'
        }
      },
      whatsapp: {
        enabled: true,     // Enable WhatsApp. [Default: true],
        mobile: true,
        icon: 'zmdi-whatsapp',
        title: 'Whatsapp',
        url: 'whatsapp://send',
        params: {
          text: 'En ce moment je regarde "{title}" sur @afrostream {url}'
        }
      },
      twitter: {
        enabled: true,      // Enable Twitter. [Default: true]
        icon: 'zmdi-twitter',
        url: 'https://twitter.com/intent/tweet',
        title: 'Twitter',
        params: {
          url: '{url}',
          text: 'En ce moment je regarde "{title}" sur @afrostream'
        }
      },
      googlePlus: {
        enabled: true, // Enable Google+. [Default: true]
        icon: 'zmdi-google-plus',
        title: 'Google +',
        url: 'https://plus.google.com/share',
        params: {
          url: '{url}'
        }
      },
      email: {
        enabled: true,     // Enable Email. [Default: true]
        icon: 'zmdi-email',
        title: 'email',
        url: 'mailto:',
        params: {
          subject: 'À voir: "{title}" sur afrostream',
          body: 'En ce moment je regarde "{title}" et tu vas aimer {description} Tu peux aussi télécharger l’application Afrostream : https://play.google.com/store/apps/details?id=tv.afrostream.app&hl=en pour Androïd et https://itunes.apple.com/fr/app/afrostream/id1066377914?mt=8 pour Iphone / Ipad'
        }
      }
    }
  },
  recurly: {
    key: process.env.RECURLY_PUBLIC_KEY || 'sjc-ZhO4HmKNWszC5LIA8BcsMJ'
  },
  stripe: {
    key: process.env.STRIPE_PUBLIC_KEY || 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
  },
  braintree: {
    key: process.env.BRAINTREE_PUBLIC_KEY || 'sandbox_phhy689d_vpchhx9ppk3xwrcy'
  },
  gocardless: {
    key: process.env.GOCARDLESS_PUBLIC_KEY || 'sENrK8JLcJaaA-JvFcfF7X_V12YG7lJgTQG8QvFL',
    version: '2015-07-06',
    creancier: {
      id: 'GB31ZZZSDDBARC0000007495895067',
      name: 'Afrostream',
      adress: '18 RUE SCRIBE 44000 NANTES'
    }
  },
  algolia: {
    appId: process.env.ALGOLIA_APP_ID || '3OKNPL7ZVA',
    apiKey: process.env.ALGOLIA_API_KEY || '3e6547172fb6d80b2ae02d6369edfc72'
  },
  heroku: {
    appName: process.env.HEROKU_APP_NAME || 'afrostream-dev'
  },
  bitly: {
    apiKey: process.env.BITLY_API_KEY || 'none',
    clientId: process.env.BITLY_CLIENT_ID || 'none',
    apiSecret: process.env.BITLY_API_SECRET || 'none',
    accessToken: process.env.BITLY_ACCESS_TOKEN || '3f7014f52dd257e8e502a3682835721020713736',
    domain: 'see.onafro.tv',
    bitUrl: {
      access_token: 'https://api-ssl.bitly.com/oauth/access_token',
      shorten: 'https://api-ssl.bitly.com/v3/shorten'
    }
  },
  player: {
    'autoplay': true,
    'controls': true,
    'language': 'fr',
    'dashas': {
      'protData': protData
    },
    'controlBar': {
      'volumeMenuButton': {
        'inline': false
      },
      'progressControl': {
        'seekBar': {
          'mouseThumbnailDisplay': {
            'host': 'hw.cdn.afrostream.net'
          }
        }
      }
    },
    'metrics': {
      'user_id': ''
    },
    'streamroot': {
      'p2pConfig': {
        'streamrootKey': 'ry-0gzuhlor'
      }
    },
    'dash': {
      'inititalMediaSettings': {
        'text': {
          'lang': 'fra'
        },
        'audio': {
          'lang': 'fra'
        },
        'video': {
          'lang': 'fra'
        }
      },
      'autoSwitch': true,
      'bolaEnabled': false,
      'scheduleWhilePaused': true,
      'initialBitrate': 400,
      'liveFragmentCount': 4,
      'buffer': {
        'bufferToKeep': 60,
        'minBufferTime': 24,
        'bufferPruningInterval': 30,
        'bandwidthSafetyFactor': 0.9,
        'bufferTimeAtTopQuality': 30,
        'bufferTimeAtTopQualityLongForm': 60,
        'longFormContentDurationThreshold': 600,
        'richBufferThreshold': 20,
        'abandonLoadTimeout': 4,
        'fragmentLoaderRetryAttempts': 3,
        'fragmentLoaderRetryInterval': 1000
      },
      'protData': protData
    },
    'languages': {
      'fr': {
        'French': 'Français',
        'fra': 'Français',
        'fr': 'Français',
        'English': 'Anglais',
        'eng': 'Anglais',
        'en': 'Anglais',
        'Next': 'Vidéo Suivante',
        'Play': 'Lecture',
        'Pause': 'Pause',
        'Current Time': 'Temps actuel',
        'Duration Time': 'Durée',
        'Remaining Time': 'Temps restant',
        'Stream Type': 'Type de flux',
        'LIVE': 'EN DIRECT',
        'Loaded': 'Chargé',
        'Progress': 'Progression',
        'Fullscreen': 'Plein écran',
        'Non-Fullscreen': 'Fenêtré',
        'Mute': 'Sourdine',
        'Unmuted': 'Son activé',
        'Playback Rate': 'Vitesse de lecture',
        'Subtitles': 'Sous-titres',
        'subtitles off': 'Sous-titres désactivés',
        'Captions': 'Sous-titres',
        'captions off': 'Sous-titres désactivés',
        'Audio Selection': 'Audio',
        'audio off': 'Audio désactivé',
        'Quality Selection': 'Qualité',
        'Quality': 'Qualité',
        'Chapters': 'Chapitres',
        'You aborted the media playback': 'Vous avez interrompu la lecture de la vidéo.',
        'A network error caused the media download to fail part-way.': 'Une erreur de réseau a interrompu le téléchargement de la vidéo.',
        'The media could not be loaded, either because the server or network failed or because the format is not supported.': 'Cette vidéo n\'a pas pu être chargée, soit parce que le serveur ou le réseau a échoué ou parce que le format n\'est pas reconnu. Essayez de mettre à jour votre navigateur ou telechargez le plugin flash player : https://get.adobe.com/fr/flashplayer/',
        'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.': 'La lecture de la vidéo a été interrompue à cause d\'un problème de corruption ou parce que la vidéo utilise des fonctionnalités non prises en charge par votre navigateur.',
        'No compatible source was found for this media.': 'Aucune source compatible n\'a été trouvée pour cette vidéo.'
      }
    },
    'sr_options': {
      'ID_CLIENT': process.env.STREAMROOT_CLIENT_ID || 'ry-0gzuhlor',
      'TRACKER_URL': process.env.STREAMROOT_TRACKER_URL || ''
    },
    'chromecast': {
      'appId': process.env.CHROMECAST_ID || '',
      'metadata': {
        'title': 'Title',
        'subtitle': 'Subtitle'
      }
    },
    'youbora': {
      'accountCode': process.env.YOUBORA_ID || 'afrostreamdev',
      'enableAnalytics': true,
      'httpSecure': true,
      'transactionCode': 'front'
    },
    'techOrder': ['dash', 'html5', 'dashas']
  }
}

export default client
