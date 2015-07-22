import ActionTypes from '../consts/ActionTypes';

export function getTopByCategory(category) {
  return async api => ({
    type: ActionTypes.Category.getTopByCategory,
    category,
    res: await api(`/category/${category}/top`, {
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
    res: await api(`/category`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}
