'use strict';
import React, { PropTypes } from 'react';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import shallowEqual from 'react-pure-render/shallowEqual';

export default function prepareRoute(prepareFn) {

  return DecoratedComponent =>

    class PrepareRouteDecorator extends React.Component {

      static prepareRoute = prepareFn;

      static contextTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired
      };

      render() {
        return (
          <DecoratedComponent {...this.props} />
        );
      }

      componentWillReceiveProps(nextProps) {
        const {
          context: { store ,history,location},
          props: { params }
          } = this;

        if (!shallowEqual(nextProps, this.props)) {
          prepareFn({store, location, params: nextProps.params});
        }
      }

      componentDidMount() {
        const {
          context: { store ,history,location},
          props: { params }
          } = this;

        prepareFn({store, location, params: params});
      }

    };
}
