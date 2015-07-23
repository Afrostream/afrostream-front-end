import keyMirror from 'react/lib/keyMirror';

export default {

  Repo: keyMirror({
    getByUsername: null,
    getMore: null
  }),

  User: keyMirror({
    getOneByUsername: null
  }),

  Slides: keyMirror({
    toggleNext: null,
    togglePrev: null,
    toggleSlide: null
  }),

  Movies: keyMirror({
    toggleNext: null,
    togglePrev: null
  }),

  Category: keyMirror({
    getTop: null,
    getCategory: null,
    getMenu: null
  })
};
