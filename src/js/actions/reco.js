import ActionTypes from '../consts/ActionTypes';
import Immutable from 'immutable';
import {reco} from '../../../config';
import _ from 'lodash';

/**
 * Like or not for video recommendation algo
 * TODO connecter a l'api une fois celle ci disponible
 * @returns {Function}
 */
export function rateVideo(value, videoId) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().OAuth.get('token');
    if (!user) {
      return {
        type: ActionTypes.User.rateVideo,
        videoId,
        res: null
      }
    }

    return {
      type: ActionTypes.User.rateVideo,
      videoId,
      res: {
        body: {rate: value}
      }
    };

    //TODO connecter une fois l'api reco presente
    //return async api => ({
    //  type: ActionTypes.Reco.getRecommendations,
    //  res: await api(`/api/users/me/videos`, 'PUT', {rate:value, videoId: videoId}, token)
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
        recoList = recoList.concat(catMovies.toJS());
      }
    });

    recoList = _.filter(recoList, (o)=> {
      return o['_id'] != videoId;
    });
    recoList = _.uniq(recoList, (o)=> {
      return o['_id'];
    });
    recoList = _.sample(recoList, reco.limit);

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
