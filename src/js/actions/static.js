import ActionTypes from '../consts/ActionTypes';
import { notFound } from './notFoundAction';

export function getStatic (path) {
  return (dispatch, getState) => {
    let readyStatic = getState().Static.get(`static/${path}`);
    if (readyStatic) {
      console.log(`static ${path} already present in data store`);
      return {
        type: ActionTypes.Static.getStatic,
        path,
        res: {
          body: readyStatic.toJS()
        }
      };
    }
    return async api => ({
      type: ActionTypes.Static.getStatic,
      path,
      res: await api(`/api/${path}`).catch(notFound)
    });
  };
}
