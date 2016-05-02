'use strict';

import React from 'react';
import { Router, State, RouterContext, Navigation } from 'react-router';
import { ReduxRouter } from 'redux-router';
import routes from '../routes';

class AppRouter extends React.Component {

  render () {
    return (
      <ReduxRouter {...this.props} RoutingContext={RouterContext}>
        {routes}
      </ReduxRouter>
    );
  }
}

export default AppRouter;
