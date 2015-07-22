import ActionTypes from '../consts/ActionTypes';

export function getTopByCategory(category) {
  console.log('getTopByCategory');
  return async api => ({
    type: ActionTypes.Category.getTopByCategory,
    category,
    page: 0,
    res: await api(`/category/${category}/top`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}

export function getCategory(category) {
  console.log('getCategory');
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
  console.log('getMenu');
  return async api => ({
    type: ActionTypes.Category.getMenu,
    res: await api(`/category`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}
