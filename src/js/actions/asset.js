import ActionTypes from '../consts/ActionTypes';

export function getToken(asset) {
  console.log('getToken', asset);
  return async api => ({
    type: ActionTypes.Asset.getToken,
    asset,
    res: await api(`/asset/${asset}`)
  });
}