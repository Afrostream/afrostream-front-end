'use strict';

import React from 'react';
import { Router, State , Navigation} from 'react-router';
import { ReduxRouter } from 'redux-router';
import routes from '../routes';

class AppRouter extends React.Component {

  static propTypes = {
    history: React.PropTypes.object.isRequired
  };

  render() {

    return (
      <ReduxRouter {...this.props} routes={routes}/>
    );
  }
}

export default AppRouter;
