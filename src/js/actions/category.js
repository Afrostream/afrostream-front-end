import ActionTypes from '../consts/ActionTypes'
import { notFoundCategory } from './notFoundAction'
import _ from 'lodash'

export function getAllSpots () {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Category.getAllSpots,
      res: await api({path: `/api/categorys/spots`})
    })
  }
}

export function getSpots (categoryId) {
  return (dispatch, getState) => {

    //TODO recuperation de l'id top
    const defaultCategory = getState().Category.get('categoryId')
    categoryId = categoryId || defaultCategory

    return async api => ({
      type: ActionTypes.Category.getSpots,
      categoryId,
      res: await api({path: `/api/categorys/${categoryId}/spots`})
    })
  }
}

export function getCategory (categoryId) {
  return (dispatch, getState, actionDispatcher) => {

    actionDispatcher({
      type: ActionTypes.Category.getCategory,
      categoryId
    })

    const defaultCategory = getState().Category.get('categoryId')
    categoryId = categoryId || defaultCategory
    return async api => ({
      type: ActionTypes.Category.getCategory,
      categoryId,
      res: await api({path: `/api/categorys/${categoryId}`}).catch(notFoundCategory)
    })
  }
}

export function getMeaList () {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Category.getMeaList,
      res: await api({path: `/api/categorys/meas`})
    })
  }
}

export function getMenu () {
  return (api, getState, dispatch) => {
    return async api => {

      const menuRes = await api({path: `/api/categorys/menu`})

      const resultData = menuRes.body

      try {

        await Promise.all(_(resultData).chain()
          .take(4)
          .map((category) => {
            console.log('category', category._id)
            return dispatch(this.getCategory(category._id))
          })
          .value())
      } catch (err) {
        console.log('Promise categories fail : ', err)
      }

      return {
        type: ActionTypes.Category.getMenu,
        res: menuRes
      }
    }
  }
}
