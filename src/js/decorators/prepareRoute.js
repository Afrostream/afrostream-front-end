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

      componentWillMount() {
        const {
          context: { store },
          props: { params, location }
          } = this;

        prepareFn({store, params, location});
      }

      componentDidMount() {
        if (canUseDOM) {
          ga.pageview(this.context.router.state.location.pathname);
        }
      }
    };
}
