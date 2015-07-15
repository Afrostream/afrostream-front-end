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
    getTopByCategory: null,
    toggleNext: null,
    togglePrev: null,
    toggleSlide: null
  })
};
