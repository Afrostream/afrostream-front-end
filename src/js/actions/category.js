import ActionTypes from '../consts/ActionTypes';

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

export function getMenu(category) {
  return async api => ({
    type: ActionTypes.Category.getMenu,
    category,
    res: await api(`/category/${category}/menu`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}
