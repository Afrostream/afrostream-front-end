import keyMirror from 'fbjs/lib/keyMirror';

export default {

  OAuth: keyMirror({
    getIdToken: null,
    signin: null,
    signup: null,
    reset: null,
    facebook: null,
    logOut: null,
  }),

  Coupon: keyMirror({
    validate: null,
    create: null,
    getCouponCampaigns: null
  }),

  User: keyMirror({
    logOut: null,
    getProfile: null,
    subscribe: null,
    pendingUser: null,
    trackVideo: null,
    rateVideo: null,
    getHistory: null,
    getSubscriptions: null,
    getVideoTracking: null,
    getRecommendations: null,
    getFavoritesMovies: null,
    getFavoritesEpisodes: null,
    setFavoritesMovies: null,
    setFavoritesEpisodes: null,
    cancelSubscription: null,
    gocardless: null
  }),

  Slides: keyMirror({
    toggleNext: null,
    togglePrev: null,
    toggleSlide: null
  }),

  Movie: keyMirror({
    getMovie: null,
    getSeason: null
  }),

  Video: keyMirror({
    getVideo: null,
    trackVideo: null
  }),

  Player: keyMirror({
    getConfig: null
  }),

  Season: keyMirror({
    toggleSeason: null,
    getSeason: null
  }),

  Episode: keyMirror({
    getEpisode: null
  }),

  Event: keyMirror({
    toggleSideBar: null,
    userActive: null,
    pinHeader: null
  }),

  Intercom: keyMirror({
    createIntercom: null,
    removeIntercom: null
  }),

  Category: keyMirror({
    getAllSpots: null,
    getSpots: null,
    getMeaList: null,
    getCategory: null,
    getMenu: null
  }),

  Modal: keyMirror({
    open: null,
    close: null
  }),

  Blog: keyMirror({
    fetchAll: null,
    fetchPost: null
  }),

  Search: keyMirror({
    fetchMovies: null,
    fetching: null
  })
};
