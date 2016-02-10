import ActionTypes from '../consts/ActionTypes';
import Immutable from 'immutable';

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
 * Get recommendation movies for user
 * TODO connecter a l'api une fois celle ci disponible
 * @returns {Function}
 */
export function getRecommendations(route = 'player', videoId) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().OAuth.get('token');
    if (!user) {
      return {
        type: ActionTypes.Reco.getRecommendations,
        route,
        videoId,
        res: null
      }
    }

    let readyReco = getState().Reco.get(`${route}/${videoId}`);
    if (readyReco) {
      console.log(`Recos ${route} ${videoId} already present in data store`);
      return {
        type: ActionTypes.Reco.getRecommendations,
        route,
        videoId,
        res: {
          body: readyReco.toJS()
        }
      };
    }

    let recoList = [];
    let categories = getState().Category.get(`categorys/spots`);
    categories.map((categorie)=> {
      if (recoList.length > 6) {
        return;
      }
      let catMovies = categorie.get('adSpots');
      if (catMovies) {
        let addedMovies = _immu.sample(catMovies, 2);
        recoList.push(addedMovies.toJS());
      }
    });

    return {
      type: ActionTypes.Reco.getRecommendations,
      route,
      videoId,
      res: {
        body: recoList
      }
    };
    //TODO connecter une fois l'api reco presente
    //return async api => ({
    //  type: ActionTypes.Reco.getRecommendations,
    //  res: await api(`/api/recommendations`, 'POST', {page: route, videoId: videoId}, token)
    //});
  };
}
