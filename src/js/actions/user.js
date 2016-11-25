import ActionTypes from '../consts/ActionTypes'
import * as ModalActionCreators from './modal'
import * as OAuthActionCreators from './oauth'
import * as BillingActionCreators from './billing'
import * as FBActionCreators from './facebook'

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { push, isActive } from 'redux-router'
import { mergeFbUserInfo } from '../lib/utils'

import _ from 'lodash'
import config from '../../../config'

const mergeProfile = function (data, getState, actionDispatcher) {

  const token = getState().OAuth.get('token')
  let donePath = getState().Modal.get('donePath')

  if (!token) {
    return data
  }

  return async api => {
    actionDispatcher(pendingUser(true))
    //try {
    return await api({
      path: `/api/users/me`,
      passToken: true
    }).then((userInfos) => {
        let userMerged = userInfos.body || {}
        let planCode = userMerged.planCode
        let subscriptionsStatus = userMerged.subscriptionsStatus
        let status = subscriptionsStatus && subscriptionsStatus.status
        userMerged.user_id = userMerged._id || userMerged.user_id
        userMerged.splashList = userMerged.splashList || []
        userMerged = mergeFbUserInfo(userMerged)
        actionDispatcher(FBActionCreators.getFriendList())

        return async () => {
          if (!planCode && !donePath) {
            if (status && status !== 'active') {
              donePath = `/select-plan/none/${status}`
            } else {
              //get InternalPlan
              await actionDispatcher(BillingActionCreators.getInternalplans({
                contextBillingUuid: 'common',
                passToken: true,
                reload: true,
                userId: userMerged._id
              })).then(({res: {body = []}}) => {
                if (body) {

                  let firstPlan = _.find(body, (plan) => {
                    let planUuid = plan.internalPlanUuid
                    return planUuid === config.netsize.internalPlanUuid
                  })

                  if (!firstPlan && config.featuresFlip.redirectAllPlans) {
                    firstPlan = _.head(body)
                  }

                  if (firstPlan) {
                    donePath = `/select-plan/${firstPlan.internalPlanUuid}/checkout`
                  }
                }
              })
            }
          }

          if (donePath) {
            actionDispatcher(push(donePath))
          }

          actionDispatcher(ModalActionCreators.close())

          return _.merge(data, {
            user: userMerged
          })

        }


      }
    )
    //}).catch((e)=> {
    //  console.log(e, 'remove user data')
    //  //FIXME replace logout method
    //  actionDispatcher(OAuthActionCreators.logOut())
    //  return data
    //})
  }
}

/**
 * Get history movies/episodes for user
 * @returns {Function}
 */
export function getHistory () {
  return (dispatch, getState) => {
    const user = getState().User.get('user')
    if (!user) {
      return {
        type: ActionTypes.User.getHistory,
        res: null
      }
    }

    return async api => ({
      type: ActionTypes.User.getHistory,
      res: await api({
        path: `/api/users/${user.get('_id')}/history`,
        passToken: true
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
    if (!user) {
      return {
        type: returnTypeAction,
        res: null
      }
    }

    let readyFavorites = getState().User.get(`favorites/${type}`)
    if (readyFavorites) {
      console.log(`favorites ${type} already present in data store`)
      return {
        type: returnTypeAction,
        res: {
          body: readyFavorites.toJS()
        }
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
  return (dispatch, getState, actionDispatcher) => {
    return async () => {
      await actionDispatcher(OAuthActionCreators.getIdToken())
      const user = getState().User.get('user')
      return async () => {
        return await mergeProfile({
          type: ActionTypes.User.getProfile,
          user: null
        }, getState, actionDispatcher)
      }
    }
  }
}
