import client from './client'

const server = {
  metadata: {
    domain: 'https://www.afrostream.tv',
    title: 'AFROSTREAM | Les meilleurs films et séries afro en illimité',
    description: 'Profitez d\'une sélection des meilleurs films & séries afro à regarder en illimité sur tous vos écrans grâce à Afrostream, la première semaine est offerte.',
    shareImage: '/production/image/2016/12/coupon_page_bg-2.png',
    defaultImage: '/production/image/2016/12/ba3bbe6e104fa55c10aa-1920x1080.jpg',
    screen: {
      image: '/production/screen/blackish-home-v5.jpg',
      imageUK: '/production/screen/HearMeMove.jpeg',
      shareUK: '/production/screen/meta-og-home-uk.jpg',
      logo: ''
    },
    carousel: {
      mobile: [
        '/production/carousel/apercu_catalogue_mobile_slide1{lang}.png',
        '/production/carousel/apercu_catalogue_mobile_slide2{lang}.png'
      ],
      desktop: [
        '/production/carousel/apercu_catalogue_desktop_slide1{lang}.png',
        '/production/carousel/apercu_catalogue_desktop_slide2{lang}.png'
      ]
    },
    videos: [{src: 'https://afrostream-video.imgix.net/Afrostream-boucle-2.mp4', type: 'video/mp4'}],
    metas: [
      {
        property: 'fb:app_id',
        content: client.facebook.appId
      },
      {
        name: 'twitter:card',
        content: 'summary'
      },
      {
        name: 'twitter:creator',
        content: '@afrostream'
      },
      {
        property: 'og:site_name',
        content: 'Afrostream'
      },
      {
        property: 'og:image:height',
        content: '630'
      },
      {
        property: 'og:image:width',
        content: '1200'
      },
      {
        name: 'keywords',
        content: 'netflix, afro, cinema, black, series, shows, empire, cookie, webseries, musique, afrostream, viola davis, taraji p henson, blackxploitation, film, nollywood, ghana, france'
      }]
  },
  domain: {
    host: process.env.DOMAIN_HOST || 'afrostream.dev'
  },
  subdomain: process.env.SUBDOMAIN || '',
  /**
   * Front-End Server
   */
  server: {
    host: '0.0.0.0',
    ip: process.env.IP || undefined,
    port: process.env.PORT ||
    process.env.USER === 'marc' && 80 || // (to bind 80: sudo setcap cap_net_bind_service=+ep `which node`)
    3001
  },

  /**
   * API Server
   */
  apiServer: {
    urlPrefix: process.env.API_END_POINT || 'http://afrostream.dev:3002'
  },

  /**
   * WebpackDevServer
   */
  webpackDevServer: {
    host: 'afrostream.dev',
    port: 8081
  },
  // List of user roles
  userRoles: ['free', 'user', 'premium', 'vip'],
  /**
   * browserSync
   */
  browserSyncServer: {
    host: 'afrostream.dev',
    port: 8082
  }
}

export default server
