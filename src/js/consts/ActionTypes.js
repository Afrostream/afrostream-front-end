import keyMirror from 'react/lib/keyMirror';

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
    cancelSubscription: null,
    gift: null
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
    getSpots: null,
    getMeaList: null,
    getCategory: null,
    getMenu: null
  })
};
