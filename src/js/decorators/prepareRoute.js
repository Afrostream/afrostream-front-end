'use strict';
import React, { PropTypes } from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

export default function prepareRoute(prepareFn) {

  return DecoratedComponent =>

    class PrepareRouteDecorator extends React.Component {

      static prepareRoute = prepareFn;

      static contextTypes = {
        store: PropTypes.object.isRequired
      };

      render() {
        return (
          <DecoratedComponent {...this.props} />
        );
      }

      //componentWillReceiveProps(nextProps, nextContext) {
      //  const {
      //    context: { store },
      //    props: { params }
      //    } = this;
      //
      //  if (!shallowEqual(nextContext, this.context)) {
      //    prepareFn({store, params: nextContext.params});
      //  }
      //}

      //componentWillReceiveProps(nextProps, nextContext) {
      //  const {
      //    context: { store },
      //    props: { params }
      //    } = this;
      //
      //  if (!shallowEqual(nextProps, this.nextProps)) {
      //    prepareFn({store, params: nextProps.params});
      //  }
      //}

      //componentDidMount() {
      //  const {
      //    context: { store },
      //    props: { params }
      //    } = this;
      //
      //  prepareFn({store, params: params});
      //}

    };
}
