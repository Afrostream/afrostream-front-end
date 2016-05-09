'use strict';
import React, { PropTypes } from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

export default function prepareRoute (prepareFn) {

  return DecoratedComponent =>

    class PrepareRouteDecorator extends React.Component {

      static prepareRoute = prepareFn;

      static contextTypes = {
        store: PropTypes.object.isRequired
      };

      static propsTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };

      render () {
        return (
          <DecoratedComponent {...this.props} />
        );
      }

      componentWillReceiveProps (nextProps) {
        const {
          context: {store},
          props: {params, router}
        } = this;

        if (!shallowEqual(nextProps.params, params)) {
          prepareFn({store, params: nextProps.params, router});
        }
      }

      componentDidMount () {
        const {
          context: {store},
          props: {params, router}
        } = this;

        prepareFn({store, params: params, router});
      }

    };
}
