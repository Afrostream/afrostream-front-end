import keyMirror from 'fbjs/lib/keyMirror'

export default {

  Geo: keyMirror({
    getGeo: null
  }),
  OAuth: keyMirror({
    refresh: null,
    getIdToken: null,
    signin: null,
    signup: null,
    reset: null,
    strategy: null,
    logOut: null,
    mobileCheck: null,
    mobileSubscribe: null
  }),

  Billing: keyMirror({
    subscribe: null,
    getConfig: null,
    getSubscriptions: null,
    getInternalplans: null,
    couponValidate: null,
    couponActivate: null,
    createCoupon: null,
    sponsorsList: null,
    switchSubscription: null,
    cancelSubscription: null,
    getCouponCampaigns: null,
    updateUser: null
  }),

  User: keyMirror({
    put: null,
    logOut: null,
    getProfile: null,
    pendingUser: null,
    trackVideo: null,
    rateVideo: null,
    getHistory: null,
    getVideoTracking: null,
    getRecommendations: null,
    getFavoritesMovies: null,
    getFavoritesEpisodes: null,
    setFavoritesMovies: null,
    setFavoritesEpisodes: null,
    setSplash: null
  }),

  Slides: keyMirror({
    toggleNext: null,
    togglePrev: null,
    toggleSlide: null
  }),

  Movie: keyMirror({
    getMovie: null,
    getLast: null,
    getSeason: null
  }),

  Video: keyMirror({
    getVideo: null,
    trackVideo: null
  }),

  Player: keyMirror({
    getConfig: null,
    setFullScreen: null,
    setPlayer: null,
    loadPlayer: null,
    killPlayer: null
  }),

  Config: keyMirror({
    getConfig: null
  }),

  Season: keyMirror({
    toggleSeason: null,
    getSeason: null
  }),

  Episode: keyMirror({
    getEpisode: null
  }),

  SW: keyMirror({
    setPushNotifications: null
  }),

  Event: keyMirror({
    toggleSideBar: null,
    userActive: null,
    showError: null,
    snackMessage: null
  }),

  Intercom: keyMirror({
    createIntercom: null,
    removeIntercom: null
  }),

  Category: keyMirror({
    getAllSpots: null,
    getCarrousel: null,
    getSpots: null,
    getMeaList: null,
    getCategory: null,
    getMenu: null
  }),

  Modal: keyMirror({
    open: null,
    close: null
  }),

  Job: keyMirror({
    fetchAll: null,
    fetchJob: null
  }),

  Press: keyMirror({
    fetchAll: null
  }),

  Search: keyMirror({
    fetchAll: null,
    fetchMovies: null,
    fetching: null
  }),

  Static: keyMirror({
    getComponentRoute: null,
    getStatic: null
  }),

  Facebook: keyMirror({
    initialized: null,
    like: null,
    readNews: null,
    pageInfo: null,
    watchVideo: null,
    getFriends: null,
    getFriendList: null,
    getInvitableFriends: null
  }),

  Life: keyMirror({
    spotClick: null,
    removePin: null,
    publishPin: null,
    wrappPin: null,
    fetchThemes: null,
    fetchSpots: null,
    fetchPins: null,
    fetchPin: null,
    fetchUsersFollow: null,
    fetchUserLikes: null,
    likePin: null,
    followUser: null,
    fetchUsers: null,
    fetchUserPins: null
  }),

  GA: keyMirror({
    setVariations: null
  })
}
