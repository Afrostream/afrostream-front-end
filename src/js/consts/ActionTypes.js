import keyMirror from 'fbjs/lib/keyMirror';

export default {

  User: keyMirror({
    getIdToken: null,
    createLock: null,
    getProfile: null,
    showLock: null,
    showSignupLock: null,
    showGiftLock: null,
    showSigninLock: null,
    logOut: null,
    subscribe: null,
    pendingUser: null,
    cancelSubscription: null
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
    getVideo: null
  }),

  Player: keyMirror({
    getConfig: null
  }),

  Season: keyMirror({
    toggleSeason: null,
    getSeason: null
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
    target: null
  }),

  Blog: keyMirror({
    fetchAll: null,
    fetchPost: null,
  })
};
