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