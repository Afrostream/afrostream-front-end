import ActionTypes from '../consts/ActionTypes';

export function getTop() {
  console.log('getTop');
  return async api => ({
    type: ActionTypes.Category.getTop,
    res: await api(`/category/top`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}

export function getCategory(category) {
  return async api => ({
    type: ActionTypes.Category.getCategory,
    category,
    res: await api(`/category/${category}`, {
      sort: 'updated',
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
