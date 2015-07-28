import React from 'react';
import { prepareRoute } from '../decorators';
import * as AssetActionCreators from '../actions/asset';
import PlayerComponent from './Player/PlayerComponent';

@prepareRoute(async function ({ store, params: { type, movie, slug, asset } }) {
  return await * [
      store.dispatch(AssetActionCreators.getToken(asset))
    ];
}) class PlayerPage extends React.Component {

  render() {
    const {
      props: {
        params: { asset }
        }
      } = this;

    return (
      <div className="row-fluid">
        {asset ? <PlayerComponent {...{asset}}/> : ''}
      </div>
    );
  }
}

export default PlayerPage;
