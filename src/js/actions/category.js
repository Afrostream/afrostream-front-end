import ActionTypes from '../consts/ActionTypes';

export function getSpots(categoryId) {
  return (dispatch, getState) => {
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
  return async api => ({
    type: ActionTypes.Category.getMeaList,
    res: await api(`/categorys/meas`)
  });
}

export function getMenu() {
  return async api => ({
    type: ActionTypes.Category.getMenu,
    res: await api(`/categorys/menu`)
  });
}
