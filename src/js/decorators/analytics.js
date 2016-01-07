'use strict';

import React, { PropTypes } from 'react';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import shallowEqual from 'react-pure-render/shallowEqual';
import config from '../../../config';

if (canUseDOM) {
  var ga = require('react-ga');
}
export default function analytics(prepareFn) {

  return AnalyticsComponent =>

    class AnalyticsDecorator extends React.Component {

      static prepareRoute = prepareFn;

      static contextTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };

      render() {
        return (
          <AnalyticsComponent {...this.props} />
        );
      }

      componentWillReceiveProps(nextProp, nextContext) {
        const {
          context: { store ,location},
          props: { params }
          } = this;

        //if (!shallowEqual(nextContext.location, location) && canUseDOM) {
        if (nextContext.location.pathname !== location.pathname && canUseDOM) {
          ga.pageview(nextContext.location.pathname);
        }
      }

      componentDidMount() {
        const {
          context: { location }
          } = this;

        if (canUseDOM) {
          ga.initialize(config.google.analyticsKey, {debug: true});
          ga.pageview(location.pathname);
        }
      }

    };
}
