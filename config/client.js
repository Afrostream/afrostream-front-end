import { isBoolean } from '../src/js/lib/utils'

const isProduction = process.env.NODE_ENV === 'production'
const drmTodayStaging = !isProduction && 'staging.' || ''
const playerPackage = require('afrostream-player/package.json')
const protData = {
  'com.widevine.alpha': {
    'drmtoday': true,
    'serverURL': `https://lic.${drmTodayStaging}drmtoday.com/license-proxy-widevine/cenc/`,
    'httpRequestHeaders': {
      'dt-custom-data': ''
    }
  },
  'com.microsoft.playready': {
    'drmtoday': true,
    'serverURL': `https://lic.${drmTodayStaging}drmtoday.com/license-proxy-headerauth/drmtoday/RightsManager.asmx`,
    'httpRequestHeaders': {
      'http-header-CustomData': ''
    }
  },
  'com.adobe.flashaccess': {
    'drmtoday': true,
    'serverURL': `https://lic.${drmTodayStaging}drmtoday.com/flashaccess/LicenseTrigger/v1`,
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
  defaultCouponCode: 'PRIXDOUX',
  promoFlashInternalPlanUUID: 'afrostreammonthlyrts',
  featuresFlip: {
    sponsorship: true,
    koment: true,
    redirectAllPlans: false
  },
  userProfile: {
    keys: {
      profile: [
        {key: 'picture', type: 'picture', col: 12},
        {key: 'nickname', type: 'text', col: 12},
        {key: 'first_name', type: 'text', autoComplete: 'surname', col: 6},
        {key: 'last_name', type: 'text', autoComplete: 'given-name', col: 6},
        {key: 'biography', type: 'text', autoComplete: 'biography', col: 12, multiLine: true, rows: 5},
        {key: 'address', type: 'autocomplete', icon: '', col: 12},
        {
          key: 'gender',
          type: 'radio',
          icon: 'zmdi zmdi-female',
          iconRight: 'zmdi zmdi-male-alt',
          col: 12,
          list: [{value: 'women'}, {value: 'men'}]
        },
        {
          key: 'telephone',
          type: 'tel',
          icon: 'zmdi zmdi-smartphone-android',
          autoComplete: 'phone',
          pattern: '^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$',
          col: 12

        },
        {key: 'birthDate', type: 'date', icon: '', col: 12},
        {key: 'emailNewsletter', type: 'checkbox', col: 12},
        {key: 'emailOptIn', type: 'checkbox', col: 12},
        {key: 'email', type: 'email', disabled: true, autoComplete: 'email', col: 12},
        {key: 'password', type: 'password', col: 12},
      ],
      social: [
        {key: 'webPushNotificationsData', type: 'toggle', icon: 'zmdi zmdi-notifications', col: 12},
        {key: 'socialSharing', type: 'toggle', icon: 'zmdi zmdi-share', col: 12}
      ],
      player: [
        {
          key: 'playerAudio',
          type: 'select',
          icon: 'zmdi zmdi-hearing',
          list: [{label: 'lang.fr', value: 'fra'}, {label: 'lang.en', value: 'eng'}]
        },
        {
          key: 'playerCaption', type: 'select', icon: 'zmdi zmdi-view-subtitles',
          list: [{label: 'lang.null', value: null}, {label: 'lang.fr', value: 'fra'}, {label: 'lang.en', value: 'eng'}]
        },
        {
          key: 'playerQuality', type: 'select', icon: 'zmdi zmdi-router',
          list: [
            {label: 'quality.0', value: 0},
            {label: 'quality.5', value: 5},
            {label: 'quality.4', value: 4},
            {label: 'quality.3', value: 3},
            {label: 'quality.2', value: 2},
            {label: 'quality.1', value: 1}
          ]
        },
        {key: 'playerKoment', type: 'toggle', icon: 'zmdi zmdi-comment-more'},
        {key: 'playerAutoNext', type: 'toggle', icon: 'zmdi zmdi-skip-next'}
      ]
    }
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
    '//www.gstatic.com/firebasejs/live/3.0/firebase.js',
    '//www.gstatic.com/cv/js/sender/v1/cast_sender.js'
  ],
  gocarlessApi: '//pay' + (process.env.NODE_ENV !== 'production' ? '-sandbox' : '') + '.gocardless.com/js/beta',
  addThisApi: '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-583c553b01382bdf',
  recurlyApi: '//js.recurly.com/v3/recurly.js',
  cashwayApi: '//maps.cashway.fr/js/cwm.min.js',
  gmapApi: '//maps.googleapis.com/maps/api/js?key=AIzaSyAhppNXQh6Nhbs_-5ySMgU93h-y2VeXLo8&libraries=places',
  stripeApi: '//js.stripe.com/v2/',
  wecashupApi: {
    url: '//www.wecashup.cloud/' + (isProduction ? 'live' : 'demo' ) + '/2-form/js/MobileMoney.js',
    modalClass: 'featherlight',
    attributes: {
      'class': 'wecashup_button',
      'async': true,
      'data-receiver-uid': process.env.NODE_ENV !== 'production' ? 'bzmSSCP8WqUMDDH4sPb2w8hB14F2' : 'nZpRMzyIg2Tgh7o2nIK2heGkfVB2',
      'data-receiver-public-key': process.env.NODE_ENV !== 'production' ? 'NoZ7voE0KDRSBnxaB7oqcGdWQnrLVxAZm9NLiEIMyYvq' : 'SM3xFy5l31t9HD5XuosCfNuhZvNNhEQHNexLu4VjPtu3',
      'data-name': 'afrostream',
      'data-style': 1,
      'data-image': '//www.wecashup.cloud/live/2-form/img/home.png',
      'data-cash': true,
      'data-telecom': true,
      'data-m-wallet': false,
      'data-split': true
    }
  },
  payment: {
    default: 'recurly',
    order: ['recurly', 'stripe', 'gocardless', 'braintree', 'paypal', 'applepay', 'googlepay', 'carrier_billing', 'bitcoin']
  },
  //add alerts to front (same as cookies)
  alerts: [],
  google: {
    analyticsKey: process.env.GA_TRACKING_ID || 'UA-*******-**',
    adSenseKey: process.env.GA_ADSENSE_ID || 'ca-pub-5887481529465530',
    //Code ab tests multiples
    abCodes: isProduction && [
      {
        name: 'promo1euro',
        key: '3gI3800nQ9efKr8qwUJfzQ',
        nbVariations: 1
      }
    ] || [],
    firebase: {
      apiKey: 'AIzaSyBJ3H7rJHdhaLg8KfkjvwxvwDhbrbR4NpI',
      authDomain: 'afrostream-86e6c.firebaseapp.com',
      databaseURL: 'https://afrostream-86e6c.firebaseio.com',
      storageBucket: 'afrostream-86e6c.appspot.com',
      messagingSenderId: '6652169699'
    }
  },
  facebook: {
    appId: '828887693868980',
    sdkVersion: 'v2.6',
    analyticsKey: process.env.FB_TRACKING_ID || 'FB-*******-**'
  },
  apiClient: {
    protocol: process.env.API_CLIENT_PROTOCOL || 'https',
    authority: process.env.API_CLIENT_AUTHORITY || 'afr-api-v1-staging.herokuapp.com',
    urlPrefix: process.env.API_CLIENT_END_POINT || process.env.API_END_POINT || 'http://localhost:3002',
    token: 'accessToken',
    geo: 'geo'
  },
  images: {
    protocol: process.env.API_IMAGES_PROTOCOL || 'http',
    authority: process.env.API_IMAGES_AUTHORITY || 'images.cdn.afrostream.net',
    urlPrefix: process.env.API_IMAGES_END_POINT || 'https://images.cdn.afrostream.net',
    quality: 65,
    type: 'jpg'
  },
  addThis: {
    publicKey: 'ra-583c553b01382bdf'
  },
  netsize: {
    internalPlanUuid: 'nsafrostreammonthly'
  },
  countdowns: [{
    countryCode: 'FR',
    countDownDateFrom: '2017-02-07',
    countDownDateTo: '2017-04-10',
    imageUrl: '/production/screen/promo-un-euro.jpg',
    internalPlanUuid: 'afrostreammonthlyrts',
    internalPlanQuery: '',
    infos: '* Offre valable pour tout nouvel abonné et tout réabonnement pour un accès uniquement sur ordinateurs, tablettes et smartphones. Apres le premier mois à 1euro, l’offre passe au prix de 6,99 euros par mois en renouvellement automatique. Offre non cumulable. Offre valable jusqu‘au 2 avril 2017.'
  }],
  sentry: {
    dns: process.env.SENTRY_DSN || '',
    config: {}
  },
  fastly: {
    serviceId: process.env.FASTLY_SERVICE_ID || '',
    key: process.env.FASTLY_API_KEY || ''
  },
  carousel: {
    interval: 10000
  },
  sponsors: {
    billingProviderName: 'afr',
    couponsCampaignBillingUuid: process.env.SPONSORSHIP_BILLING_UUID || 'toto',
    couponsCampaignType: 'sponsorship'
  },
  intercom: {
    url: 'https://widget.intercom.io/widget/',
    appID: 'k3klwkxq',
    lifeFeature: 'life'
  },
  movies: {
    isNew: {
      episode: 7,
      movie: 30,
      season: 30
    }
  },
  reco: {
    enabled: true,
    limit: 3,
    time: 10
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
  life: {
    welcome: '/production/life/promo-4bis-2.jpg',
    welcomeMobile: '/production/life/promo-5-2.jpg',
    networks: {
      youtube: {
        enabled: true,
        icon: 'fa fa-youtube',
        title: 'Youtube',
        regex: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/i,
      },
      spotify: {
        enabled: true,
        icon: 'fa fa-spotify',
        title: 'Spotify',
        regex: /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/,
      },
      soundcloud: {
        enabled: true,
        icon: 'fa fa-soundcloud',
        title: 'Soundcloud',
        regex: /^https?:\/\/soundcloud\.com\/\S+\/\S+$/i,
      },
      instagram: {
        enabled: true,
        icon: 'fa fa-instagram',
        title: 'Instagram',
        regex: /(https?:\/\/)?([\w\.]*)instagram\.com\/([a-zA-Z0-9_-]*)$/,
      },
      website: {
        enabled: true,
        icon: 'fa fa-newspaper-o',
        title: 'Article',
        regex: /^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/,
      }
    }
  },
  social: {
    networks: {
      facebook: {
        enabled: true,      // Enable Facebook. [Default: true]
        icon: 'zmdi-facebook',
        url: 'https://www.facebook.com/sharer/sharer.php',
        title: 'Facebook',
        label: 'Share',
        params: {
          u: '{url}',
          s: 'En ce moment je regarde "{title}" sur @afrostream'
        },
        fullParams: {
          u: '{url}',
          s: '{title} {description}'
        }
      },
      whatsapp: {
        enabled: true,     // Enable WhatsApp. [Default: true],
        mobile: true,
        label: 'Share',
        icon: 'zmdi-whatsapp',
        title: 'Whatsapp',
        url: 'whatsapp://send',
        params: {
          text: 'En ce moment je regarde "{title}" sur @afrostream {url}'
        },
        fullParams: {
          text: '{title} {descroption} {url}'
        }
      },
      twitter: {
        enabled: true,      // Enable Twitter. [Default: true]
        label: 'Tweet',
        icon: 'zmdi-twitter',
        url: 'https://twitter.com/intent/tweet',
        title: 'Twitter',
        params: {
          url: '{url}',
          text: 'En ce moment je regarde "{title}" sur @afrostream'
        },
        fullParams: {
          url: '{url}',
          text: '{title} {description}'
        }
      },
      googlePlus: {
        enabled: true, // Enable Google+. [Default: true]
        icon: 'zmdi-google-plus',
        label: 'Share',
        title: 'Google +',
        url: 'https://plus.google.com/share',
        params: {
          url: '{url}'
        },
        fullParams: {
          url: '{url}',
          text: '{title} {description}'
        }
      },
      email: {
        enabled: true,     // Enable Email. [Default: true]
        icon: 'zmdi-email',
        label: 'Email',
        title: 'email',
        url: 'mailto:',
        params: {
          subject: 'À voir: "{title}" sur afrostream',
          body: 'En ce moment je regarde "{title}" et tu vas aimer {description} Tu peux aussi télécharger l’application Afrostream : https://play.google.com/store/apps/details?id=tv.afrostream.app&hl=en pour Androïd et https://itunes.apple.com/fr/app/afrostream/id1066377914?mt=8 pour Iphone / Ipad'
        },
        fullParams: {
          subject: '{title}',
          body: '{description} {url}'
        }
      }
    }
  },
  recurly: {
    key: process.env.RECURLY_PUBLIC_KEY || ''
  },
  stripe: {
    key: process.env.STRIPE_PUBLIC_KEY || ''
  },
  braintree: {
    key: process.env.BRAINTREE_PUBLIC_KEY || ''
  },
  gocardless: {
    key: process.env.GOCARDLESS_PUBLIC_KEY || '',
    version: '2015-07-06',
    creancier: {
      id: 'GB31ZZZSDDBARC0000007495895067',
      name: 'Afrostream',
      adress: '18 RUE SCRIBE 44000 NANTES'
    }
  },
  heroku: {
    appName: process.env.HEROKU_APP_NAME || 'afrostream-dev'
  },
  bitly: {
    login: 'afrostream',
    apiKey: process.env.BITLY_API_KEY || '',
    clientId: process.env.BITLY_CLIENT_ID || '',
    apiSecret: process.env.BITLY_API_SECRET || '',
    accessToken: process.env.BITLY_ACCESS_TOKEN || '',
    domain: 'see.onafro.tv',
    bitUrl: {
      access_token: 'https://api-ssl.bitly.com/oauth/access_token',
      shorten: 'https://api-ssl.bitly.com/v3/shorten'
    }
  },
  player: {
    plugins: {
      //mux: {
      //  debug: !isProduction,
      //  data: {
      //    'property_key': isProduction ? 'a_PjG6XMl-D-SkS2H-ygrHpYo' : 'gXlHgJvAkN15beJpBEcO8z1CR',
      //    'player_name': playerPackage.name,
      //    'player_version': playerPackage.version,
      //  }
      //}
    },
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
        'Koment': 'Afficher les commentaires',
        'Non-Koment': 'Masquer les commentaires',
        'List': 'Liste des commentaires',
        'Edit': 'Commenter',
        'Send': 'Envoyer',
        'Add your comment here...': 'Commenter ce passage de la video...',
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
        'The media could not be loaded, either because the server or network failed or because the format is not supported.': 'Cette vidéo n\'a pas pu être chargée, soit parce que le serveur ou le réseau a échoué ou parce que le format n\'est pas reconnu. Essayez de mettre à jour votre navigateur ici http://outdatedbrowser.com',
        'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.': 'La lecture de la vidéo a été interrompue à cause d\'un problème de corruption ou parce que la vidéo utilise des fonctionnalités non prises en charge par votre navigateur. Essayez de mettre à jour votre navigateur ici http://outdatedbrowser.com',
        'No compatible source was found for this media.': 'Aucune source compatible n\'a été trouvée pour cette vidéo.'
      }
    },
    'sr_options': {
      'ID_CLIENT': process.env.STREAMROOT_CLIENT_ID || '',
      'TRACKER_URL': process.env.STREAMROOT_TRACKER_URL || ''
    },
    'chromecast': {
      'appId': process.env.CHROMECAST_ID || '',
      'metadata': {
        'title': 'Title',
        'subtitle': 'Subtitle'
      }
    },
    'defaultVolume': 0.65,
    'techOrder': ['dash', 'html5', 'dashas', 'youtube', 'soundcloud', 'vimeo', 'spotify', 'deezer'],
  }
}

export default client
