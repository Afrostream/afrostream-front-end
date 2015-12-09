'use strict';
import React, { PropTypes } from 'react';

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
          context: { store ,router},
          props: { params, location }
          } = this;

        prepareFn({store,router, params, location});
      }

    };
}
