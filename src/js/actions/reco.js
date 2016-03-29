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

    let videoUserData = null;
    return async api => {
      try {
        videoUserData = await
        api(`/api/users/${user.get('_id')}/videos/${videoId}`, 'GET', {},true)
      } catch (e) {
        console.log(`didn’t find any video user data for videoId : ${videoId}`);
      }
      return {
        type: ActionTypes.User.getVideoTracking,
        videoId,
        res: videoUserData
      };
    };
  };

}
/**
 * Start track video
 * @returns {Function}
 */
export function trackVideo(data, videoId) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    if (!user) {
      return {
        type: ActionTypes.User.trackVideo,
        videoId,
        res: null
      }
    }

    let dataUserVideo = getState().User.get(`video/${videoId}`);

    const now = new Date().toISOString();

    let postData = _.merge({
      dateLastRead: now,
      playerPosition: 0,
      playerAudio: 'fra',
      playerCaption: 'fra'
    }, data);

    if (dataUserVideo) {
      let rating = dataUserVideo.get('rating');
      if (rating) {
        postData = _.merge(postData, {rating: rating});
      }
    }

    return async api => ({
      type: ActionTypes.User.trackVideo,
      videoId,
      res: await api(`/api/users/${user.get('_id')}/videos/${videoId}`, 'PUT', postData, true).then(()=> {
        return {body: postData}
      })
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

    let dataUserVideo = getState().User.get(`video/${videoId}`);
    let mergedDataUserVideo = {
      rating: value
    };

    if (dataUserVideo) {
      mergedDataUserVideo = _.merge(dataUserVideo.toJS(), mergedDataUserVideo);
    }

    return async api => ({
      type: ActionTypes.User.rateVideo,
      videoId,
      res: await api(`/api/users/${user.get('_id')}/videos/${videoId}`, 'PUT', {rating: value},true).then(()=> {
      return {body: mergedDataUserVideo}
    })
  })
    ;
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
