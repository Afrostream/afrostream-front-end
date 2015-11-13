'use strict';

import React, { PropTypes } from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (canUseDOM) {
  var ga = require('react-ga');
}
export default function prepareRoute(prepareFn) {

  return DecoratedComponent =>

    class PrepareRouteDecorator extends React.Component {

      static prepareRoute = prepareFn;

      static contextTypes = {
        store: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
      };

      render() {
        return (
          <DecoratedComponent {...this.props} />
        );
      }

      componentDidMount() {
        const {
          context: { store },
          props: { params, location }
          } = this;

        if (canUseDOM) {
          ga.pageview(this.context.router.state.location.pathname);
        }
        prepareFn({store, params, location});
      }

    };
}
