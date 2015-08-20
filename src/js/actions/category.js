import ActionTypes from '../consts/ActionTypes';

export function getTop(category) {
  return (dispatch, getState) => {
    //TODO recuperation de l'id top
    const defaultCategory = 2//getState().Category.get('initial');
    category = category || defaultCategory;
    return async api => ({
      type: ActionTypes.Category.getTop,
      res: await api(`/categorys/${category}/spots`, {
        sort: 'updated',
        direction: 'desc'
      })
    });
  };
}

export function getCategory(category) {
  return (dispatch, getState) => {
    const defaultCategory = getState().Category.get('top');
    category = category || defaultCategory;
    return async api => ({
      type: ActionTypes.Category.getCategory,
      category,
      res: await api(`/categorys/${category}`, {
        sort: 'updated',
        direction: 'desc'
      })
    });
  };
}

export function getMeaList() {
  return async api => ({
    type: ActionTypes.Category.getMeaList,
    res: await api(`/categorys/meas`, {
      sort: 'top',
      direction: 'desc'
    })
  });
}

export function getMenu() {
  return async api => ({
    type: ActionTypes.Category.getMenu,
    res: await api(`/categorys/menu`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}
