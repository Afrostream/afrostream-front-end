'use strict';
import React, { PropTypes } from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import shallowEqual from 'react-pure-render/shallowEqual';

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

      componentWillReceiveProps(nextProps) {
        //if (!shallowEqual(nextProps, this.props)) {
        const {
          context: { store ,router},
          props: { params, location }
          } = this;

        prepareFn({store, router, params: params || router.state.params, location});
        //}
      }

      componentDidMount() {
        const {
          context: { store ,router},
          props: { params, location }
          } = this;

        prepareFn({store, router, params: params || router.state.params, location});
      }

    };
}
