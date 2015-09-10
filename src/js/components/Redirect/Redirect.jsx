import React from 'react/addons';
import * as UserActionCreators from '../../actions/user';
import { prepareRoute } from '../../decorators';

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(UserActionCreators.secureRoute())
    ];
}) class Redirect extends React.Component {

  static propTypes = {};


  render() {
    return (
      <div />
    );
  }
}

export default Redirect;
