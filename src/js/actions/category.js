import ActionTypes from '../consts/ActionTypes';

export function getAllSpots() {
  console.log('getAllSpots');
  return (dispatch, getState) => {
    let readySpots = getState().Category.get(`/categorys/spots`);
    if (readySpots) {
      console.log('spots already present in data store');
      return {
        type: ActionTypes.Category.getAllSpots
      };
    }

    return async api => ({
      type: ActionTypes.Category.getAllSpots,
      res: await api(`/categorys/spots`)
    });
  }
}

export function getSpots(categoryId) {
  return (dispatch, getState) => {

    let readySpot = getState().Category.get(`/categorys/${categoryId}/spots`);
    if (readySpot) {
      console.log('spots already present in data store', categoryId);
      return {
        type: ActionTypes.Category.getSpots,
        categoryId
      };
    }
    //TODO recuperation de l'id top
    const defaultCategory = getState().Category.get('categoryId');
    console.log('defaultCategory', defaultCategory)
    categoryId = categoryId || defaultCategory;
    return async api => ({
      type: ActionTypes.Category.getSpots,
      categoryId,
      res: await api(`/categorys/${categoryId}/spots`)
    });
  };
}

export function getCategory(categoryId) {
  return (dispatch, getState) => {

    let readyCat = getState().Category.get(`/categorys/${categoryId}`);
    if (readyCat) {
      console.log('Category already present in data store', categoryId);
      return {
        type: ActionTypes.Category.getCategory,
        categoryId
      };
    }

    const defaultCategory = getState().Category.get('categoryId');
    categoryId = categoryId || defaultCategory;
    return async api => ({
      type: ActionTypes.Category.getCategory,
      categoryId,
      res: await api(`/categorys/${categoryId}`)
    });
  };
}

export function getMeaList() {
  return (dispatch, getState) => {
    let readyMea = getState().Category.get(`meaList`);
    if (readyMea) {
      console.log('Meas already present in data store');
      return {
        type: ActionTypes.Category.getMeaList
      };
    }

    return async api => ({
      type: ActionTypes.Category.getMeaList,
      res: await api(`/categorys/meas`)
    });
  }
}

export function getMenu() {
  return (dispatch, getState) => {
    let readyMenu = getState().Category.get(`menu`);
    if (readyMenu) {
      console.log('Menu already present in data store');
      return {
        type: ActionTypes.Category.getMenu
      };
    }
    return async api => ({
      type: ActionTypes.Category.getMenu,
      res: await api(`/categorys/menu`)
    });
  }
}
