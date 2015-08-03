import keyMirror from 'react/lib/keyMirror';

export default {

  User: keyMirror({
    getIdToken: null,
    createLock: null,
    getProfile: null,
    showLock: null,
    logOut: null
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

  Asset: keyMirror({
    getToken: null
  }),

  Season: keyMirror({
    toggleSeason: null
  }),

  Category: keyMirror({
    getTop: null,
    getMeaList: null,
    getCategory: null,
    getMenu: null
  })
};
