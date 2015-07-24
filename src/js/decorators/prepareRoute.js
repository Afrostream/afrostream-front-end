'use strict';

import React, { PropTypes } from 'react';
import locationStateEquals from './locationStateEquals';

export default function prepareRoute(prepareFn) {

  return DecoratedComponent =>
    class PrepareRouteDecorator extends React.Component {

      static prepareRoute = prepareFn;

      static contextTypes = {
        redux: PropTypes.object.isRequired
      };

      render() {
        return (
          <DecoratedComponent {...this.props} />
        );
      }

      componentDidMount() {
        const {
          context: { redux },
          props: { params, location }
          } = this;

        prepareFn({redux, params, location});
      }

      //componentDidUpdate() {
      //  const {
      //    context: { redux },
      //    props: { params, location }
      //    } = this;
      //
      //  prepareFn({redux, params, location});
      //}

      //componentWillReceiveProps() {
      //  this.onLocationChange();
      //}

      //isSyncWhithRoute(props = this.props, context = this.context) {
        //
        //const storeState = state.store.getState();
        //const storeLocationState = storeState.router.state;
        //const routerLocationState = context.router.state.location.state; // LOL
        //return locationStateEquals(storeLocationState, routerLocationState);
      //  console.log(props, context);
      //  return true;
      //}

      /**
       * Update store state in response to router change
       */
      //onLocationChange() {
      //
      //  const {
      //    context: { redux },
      //    props: { params, location }
      //    } = this;
      //
      //
      //  if (!this.isSyncWhithRoute(this.props, this.context)) {
      //    prepareFn({redux, params, location});
      //  }
      //}
    };
}
