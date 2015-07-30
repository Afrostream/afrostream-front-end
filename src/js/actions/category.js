import ActionTypes from '../consts/ActionTypes';

export function getTop() {
  return async api => ({
    type: ActionTypes.Category.getTop,
    res: await api(`/category/top`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}

export function getCategory(category) {
  category = category || 'selection';
  return async api => ({
    type: ActionTypes.Category.getCategory,
    category,
    res: await api(`/category/${category}`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}

export function getMeaList() {
  return async api => ({
    type: ActionTypes.Category.getMeaList,
    res: await api(`/category/mea`, {
      sort: 'top',
      direction: 'desc'
    })
  });
}

export function getMenu() {
  return async api => ({
    type: ActionTypes.Category.getMenu,
    res: await api(`/category/menu`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}
