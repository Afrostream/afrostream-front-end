'use strict';
import React, { PropTypes } from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

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

      componentWillReceiveProps() {
        const {
          context: { store ,router},
          props: { params, location }
          } = this;

        prepareFn({store, router, params: params || router.state.params, location});
        if (canUseDOM) {
          document.getElementsByTagName('BODY')[0].scrollTop = 0;
        }
      }

      componentDidMount() {
        const {
          context: { store ,router},
          props: { params, location }
          } = this;

        prepareFn({store, router, params: params || router.state.params, location});
        if (canUseDOM) {
          document.getElementsByTagName('BODY')[0].scrollTop = 0;
        }
      }

    };
}
