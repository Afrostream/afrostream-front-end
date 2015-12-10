'use strict';

import React, { PropTypes } from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (canUseDOM) {
  var ga = require('react-ga');
}
export default function analytics(prepareFn) {

  return AnalyticsComponent =>

    class AnalyticsDecorator extends React.Component {

      static prepareRoute = prepareFn;

      static contextTypes = {
        router: PropTypes.object.isRequired
      };

      render() {
        return (
          <AnalyticsComponent {...this.props} />
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
      }

    };
}
