import ActionTypes from '../consts/ActionTypes';
import Immutable from 'immutable';
import {reco} from '../../../config';
import _ from 'lodash';

const _immu = {};

_immu.sample = function (list, n) {
  if (n === undefined) return list.get(_immu.random(list.size - 1));
  return _immu.shuffle(list).slice(0, Math.max(0, n));
};

_immu.shuffle = function (list) {
  var set = list;
  var size = set.size;
  var shuffled = Immutable.List(Array(size));
  for (var index = 0, rand; index < size; index++) {
    rand = _immu.random(0, index);
    if (rand !== index) shuffled = shuffled.set(index, shuffled.get(rand));
    shuffled = shuffled.set(rand, set.get(index));
  }
  return shuffled;
};

_immu.random = function (min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

/**
 * Like or not for video recommendation algo
 * TODO connecter a l'api une fois celle ci disponible
 * @returns {Function}
 */
export function likeVideoOrNot(value, videoId) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().OAuth.get('token');
    if (!user) {
      return {
        type: ActionTypes.User.likeVideoOrNot,
        videoId,
        res: null
      }
    }

    return {
      type: ActionTypes.User.likeVideoOrNot,
      videoId,
      res: {
        body: {like: value}
      }
    };

    //TODO connecter une fois l'api reco presente
    //return async api => ({
    //  type: ActionTypes.Reco.getRecommendations,
    //  res: await api(`/api/users/me/videos`, 'POST', {value:value videoId: videoId}, token)
    //});
  };
}
/**
 * Get recommendation movies for user
 * TODO connecter a l'api une fois celle ci disponible
 * @returns {Function}
 */
export function getRecommendations(route = 'player', videoId = 'home') {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().OAuth.get('token');
    if (!user) {
      return {
        type: ActionTypes.User.getRecommendations,
        videoId,
        res: null
      }
    }

    let readyReco = getState().User.get(`reco/${videoId}`);
    if (readyReco) {
      console.log(`Recos ${route} ${videoId} already present in data store`);
      return {
        type: ActionTypes.User.getRecommendations,
        videoId,
        res: {
          body: readyReco.toJS()
        }
      };
    }

    let recoList = [];
    let categories = getState().Category.get(`categorys/spots`);
    categories.map((categorie)=> {
      let catMovies = categorie.get('adSpots');
      if (catMovies) {
        let addedMovies = _immu.sample(catMovies, 2);
        recoList = recoList.concat(addedMovies.toJS());
      }
    });
    recoList = _.filter(recoList, (o)=> {
      return o['_id'] != videoId;
    });
    recoList = _.uniq(recoList, (o)=> {
      return o['_id'];
    });
    recoList = _.slice(recoList, 0, reco.limit);
    return {
      type: ActionTypes.User.getRecommendations,
      videoId,
      res: {
        body: recoList
      }
    };
    //TODO connecter une fois l'api reco presente
    //return async api => ({
    //  type: ActionTypes.Reco.getRecommendations,
    //  res: await api(`/api/users/me/recommendations`, 'POST', {page: route, videoId: videoId,limit:reco.limit}, token)
    //});
  };
}
