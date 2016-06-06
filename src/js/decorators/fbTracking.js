import React, { PropTypes } from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import shallowEqual from 'react-pure-render/shallowEqual'
import config from '../../../config'
import * as ReactFB from '../lib/fbEvent'

export default function fbTrack (prepareFn) {

  return FbTrackingComponent =>

    class FBTrackingDecorator extends React.Component {

      static prepareRoute = prepareFn

      static contextTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      }

      render () {
        return (
          <FbTrackingComponent {...this.props} />
        )
      }

      componentWillReceiveProps (nextProps) {
        const {
          props: {location}
        } = this

        if (!shallowEqual(nextProps.location.pathname, location.pathname && canUseDOM)) {
          ReactFB.track(nextProps.location.pathname)
        }
      }

      componentDidMount () {
        const {
          props: {location}
        } = this

        if (canUseDOM) {
          ReactFB.initialize(config.facebook.analyticsKey, {debug: true})
          ReactFB.track(location.pathname)
        }
      }
    }
}
