import ActionTypes from '../consts/ActionTypes'
import { notFoundCategory } from './notFoundAction'

export function getAllSpots () {
  return (dispatch, getState) => {
    let readySpots = getState().Category.get(`categorys/spots`)
    if (readySpots) {
      console.log('spots already present in data store')
      return {
        type: ActionTypes.Category.getAllSpots,
        res: {
          body: readySpots.toJS()
        }
      }
    }

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
    console.log('defaultCategory', defaultCategory)
    categoryId = categoryId || defaultCategory

    let readySpot = getState().Category.get(`categorys/${categoryId}/spots`)
    if (readySpot) {
      console.log('spots already present in data store', categoryId)
      return {
        type: ActionTypes.Category.getSpots,
        categoryId,
        res: {
          body: readySpot.toJS()
        }
      }
    }

    return async api => ({
      type: ActionTypes.Category.getSpots,
      categoryId,
      res: await api({path: `/api/categorys/${categoryId}/spots`})
    })
  }
}

export function getCategory (categoryId) {
  return (dispatch, getState, actionDispatcher) => {

    let readyCat = getState().Category.get(`categorys/${categoryId}`)
    if (readyCat) {
      console.log('Category already present in data store', categoryId)
      return {
        type: ActionTypes.Category.getCategory,
        categoryId,
        res: {
          body: readyCat.toJS()
        }
      }
    }

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
    let readyMea = getState().Category.get(`meaList`)
    if (readyMea) {
      console.log('Meas already present in data store')
      return {
        type: ActionTypes.Category.getMeaList,
        res: {
          body: readyMea.toJS()
        }
      }
    }

    return async api => ({
      type: ActionTypes.Category.getMeaList,
      res: await api({path: `/api/categorys/meas`})
    })
  }
}

export function getMenu () {
  return (dispatch, getState) => {
    let readyMenu = getState().Category.get(`menu`)
    if (readyMenu) {
      console.log('Menu already present in data store')
      return {
        type: ActionTypes.Category.getMenu,
        res: {
          body: readyMenu.toJS()
        }
      }
    }
    return async api => ({
      type: ActionTypes.Category.getMenu,
      res: await api({path: `/api/categorys/menu`})
    })
  }
}
