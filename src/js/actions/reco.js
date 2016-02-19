import ActionTypes from '../consts/ActionTypes';
import Immutable from 'immutable';
import {reco} from '../../../config';
import _ from 'lodash';

/**
 * Get user video params
 * @returns {Function}
 */
export function getVideoTracking(videoId) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');

    if (!user) {
      return {
        type: ActionTypes.User.getVideoTracking,
        videoId,
        res: null
      }
    }

    return async api => ({
      type: ActionTypes.User.getVideoTracking,
      res: await api(`/api/users/${user.get('_id')}/videos/${videoId}`, 'GET', {})
    });
  };

}
/**
 * Start track video
 * @returns {Function}
 */
export function trackVideo(data, videoId) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().OAuth.get('token');
    if (!user) {
      return {
        type: ActionTypes.User.trackVideo,
        videoId,
        res: null
      }
    }

    const now = new Date;
    const utc_timestamp = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
      now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

    let postData = _.merge({
      dateLastRead: utc_timestamp,
      playerPosition: 0,
      playerAudio: 'fra',
      playerCaption: 'fra'
    }, data);

    return async api => ({
      type: ActionTypes.User.trackVideo,
      res: await api(`/api/users/${user.get('_id')}/videos`, 'PUT', postData)
    });
  };
}
/**
 * Like or not for video recommendation algo
 * @returns {Function}
 */
export function rateVideo(value, videoId) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    if (!user) {
      return {
        type: ActionTypes.User.rateVideo,
        videoId,
        res: null
      }
    }

    return async api => ({
      type: ActionTypes.User.rateVideo,
      res: await api(`/api/users/${user.get('_id')}/videos`, 'PUT', {rating: value})
    });
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
    //  res: await api(`/api/users/me/recommendations`, 'POST', {page: route, videoId: videoId,limit:reco.limit})
    //});
  };
}
