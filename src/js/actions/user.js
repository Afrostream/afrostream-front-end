import ActionTypes from '../consts/ActionTypes'
import Immutable from 'immutable'
import { isAuthorized } from '../lib/geo'
import * as ModalActionCreators from './modal'
import * as OAuthActionCreators from './oauth'
import * as BillingActionCreators from './billing'
import * as FBActionCreators from './facebook'

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { push, isActive } from 'redux-router'
import { mergeFbUserInfo } from '../lib/utils'

import _ from 'lodash'
import config from '../../../config'

async function mergeProfile ({api, data, getState, dispatch}) {

  //HAS TOKEN STORED
  let donePath = getState().Modal.get('donePath')
  let user = getState().User.get('user')

  const {location:{query}, params} = getState().router
  dispatch(pendingUser(true))
  //const token = getState().OAuth.get('token')
  //
  //if (!token) {
  //  throw new Error('No token present')
  //  return data
  //}
  //GET USER INFO
  if (!user || (user instanceof Immutable.Map && !user.get('planCode'))) {
    await api({
      path: `/api/users/me`,
      passToken: true
    }).then(({body}) => {
      user = body
    })
  }

  if (!user) {
    throw new Error('No user found')
  }

  if (user instanceof Immutable.Map) {
    user = user.toJS()
  }
  //MERGE USER DATA
  let subscriptionsStatus = user.subscriptionsStatus
  let status = subscriptionsStatus && subscriptionsStatus.status
  let userSubscriptions = subscriptionsStatus && subscriptionsStatus.subscriptions
  let planCode = subscriptionsStatus && subscriptionsStatus.planCode || user.planCode
  user.status = status
  user.isActive = planCode && userSubscriptions && _.find(userSubscriptions || [], (subscription) => subscription.isActive === 'yes')
  user.splashList = user.splashList || []
  user.authorized = true
  user = mergeFbUserInfo(user)

  dispatch(FBActionCreators.getFriendList())

  //GEOLOC
  try {
    const geo = getState().Geo.get('geo')
    user.authorized = geo && (geo.get('authorized')) || await isAuthorized()
  } catch (err) {
    console.error('Error requesting /auth/geo ', err)
  }
  //Si l'user est geobloqué, on regarde si il a un plan en cours,
  //si c'est le cas on lui laisse l'acces au site
  if (!user.authorized) {
    user.authorized = user.isActive
    //  dispatch(ModalActionCreators.open({target: 'geoWall'}))
    //  throw new Error('User not authorized Geoloc /auth/geo ')
  }
  if (!planCode && !donePath) {
    if (user.status && user.status !== 'active') {
      donePath = `/select-plan/none/${user.status}`
    } else {
      //get InternalPlan
      await dispatch(BillingActionCreators.getInternalplans({
        contextBillingUuid: 'common',
        passToken: true,
        reload: true,
        userId: user._id
      })).then(({res: {body = []}}) => {

        if (body) {
          let firstPlan = (!params || !params.planCode) && _.find(body, (plan) => {
              let planUuid = plan.internalPlanUuid
              return planUuid === config.netsize.internalPlanUuid
            })

          if (!firstPlan && config.featuresFlip.redirectAllPlans) {
            firstPlan = _.head(body)
          }

          if (firstPlan) {
            donePath = `/select-plan/${firstPlan.internalPlanUuid}/checkout`
          }

          return donePath
        }
      })
    }
  }

  //ADD FAVORITE
  if (query && query.addFavoriteMovie) {
    //addFavoriteMovie=true&movieId=IDDUMOVIE
    dispatch(setFavorites('movies', true, query.addFavoriteMovie))
  }

  if (donePath) {
    dispatch(push(donePath))
    dispatch(ModalActionCreators.close())
  }


  dispatch(pendingUser(false))

  return _.merge(data, {
    user
  })

  //}).catch((e)=> {
  //  console.log(e, 'remove user data')
  //  //FIXME replace logout method
  //  actionDispatcher(OAuthActionCreators.logOut())
  //  return data
  //})
}

/**
 * Get history movies/episodes for user
 * @returns {Function}
 */
export function getHistory ({limit = 100}) {
  return (dispatch, getState) => {
    const user = getState().User.get('user')
    if (!user || !user.get('_id')) {
      return {
        type: ActionTypes.User.getHistory,
        res: null
      }
    }

    return async api => ({
      type: ActionTypes.User.getHistory,
      res: await api({
        path: `/api/users/${user.get('_id')}/history`,
        passToken: true,
        params: {
          limit
        }
      })
    })
  }
}

/**
 * put user
 * @returns {Function}
 */
export function put (data) {
  return (dispatch, getState) => {
    const user = getState().User.get('user')
    if (!user) {
      return {
        type: ActionTypes.User.put,
        res: null
      }
    }

    return async api => ({
      type: ActionTypes.User.put,
      res: await api({
        path: `/api/users/${user.get('_id')}`,
        method: 'PUT',
        params: data,
        passToken: true
      })
    })
  }
}

/**
 * Get favorites movies/episodes for user
 * @param type
 * @returns {Function}
 */
export function getFavorites (type = 'movies') {
  return (dispatch, getState) => {
    const user = getState().User.get('user')
    const capitType = _.capitalize(type)
    const returnTypeAction = ActionTypes.User[`getFavorites${capitType}`]

    if (!user || !user.get('_id')) {
      return {
        type: returnTypeAction,
        res: null
      }
    }

    return async api => ({
      type: returnTypeAction,
      res: await api({
        path: `/api/users/${user.get('_id')}/favorites${capitType}`,
        passToken: true
      })
    })
  }
}

export function setFavorites (type, active, id) {
  return (dispatch, getState) => {
    const user = getState().User.get('user')
    const capitType = _.capitalize(type)
    const returnTypeAction = ActionTypes.User[`setFavorites${capitType}`]
    if (!user) {
      return {
        type: returnTypeAction,
        res: null,
        id
      }
    }
    return async api => {
      let list = getState().User.get(`favorites/${type}`)
      let dataFav
      if (active) {
        dataFav = await api({
          path: `/api/users/${user.get('_id')}/favorites${capitType}`,
          method: 'POST',
          params: {_id: id},
          passToken: true
        })
      } else {
        dataFav = await api({
          path: `/api/users/${user.get('_id')}/favorites${capitType}/${id}`,
          method: 'DELETE',
          passToken: true
        })
      }

      let index = await list.findIndex((obj) => {
        return obj.get('_id') == id
      })

      let newList
      if (index > -1) {
        newList = list.delete(index)
      } else {
        newList = list.push(dataFav.body)
      }

      return {
        type: returnTypeAction,
        res: newList.toJS()
      }
    }
  }
}

export function setSplash (splashId) {
  return (dispatch, getState, actionDispatcher) => {
    const user = getState().User.get('user')

    if (!user) {
      return {
        type: ActionTypes.User.setSplash
      }
    }

    let userSPList = user.get('splashList')
    let splashList = userSPList && userSPList.toJS() || []

    splashList = _.concat(splashList, [{
      '_id': splashId
    }])

    splashList = _.uniqBy(splashList, '_id')

    let tmpUser = user.toJS()
    tmpUser.splashList = splashList

    actionDispatcher({
      type: ActionTypes.User.setSplash,
      user: tmpUser
    })

    return actionDispatcher(put({
      splashList
    }))
  }
}

export function updateUserProfile (data) {
  return (dispatch, getState, actionDispatcher) => {
    return actionDispatcher(put(data))
  }
}

export function pendingUser (pending) {
  return {
    type: ActionTypes.User.pendingUser,
    pending
  }
}

/**
 * Get profile from afrostream
 * @returns {Function}
 */
export function getProfile () {
  return (api, getState, dispatch) => {
    return async () => {
      await dispatch(OAuthActionCreators.getIdToken())
      const user = getState().User.get('user')
      return async () => {
        try {
          return await mergeProfile({
              api,
              data: {
                type: ActionTypes.User.getProfile,
                user: null
              },
              getState,
              dispatch
            }
          )
        } catch (err) {
          console.log('Error merge profile :', err.message)
          return {
            type: ActionTypes.User.getProfile,
            user: null
          }
        }

      }
    }
  }
}
