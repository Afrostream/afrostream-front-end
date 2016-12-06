import Q from 'q'
import _ from 'lodash'
import { statsd } from '../lib/tracker'

export default function ({}) {

  //return next =>
  //  function _r (action) {
  //    const statsdData = action.statsd
  //    if (statsdData) {
  //      debugger
  //      if (action && _.isFunction(action.then)) {
  //        return action.then(_r)
  //          .catch(() => {
  //            debugger
  //            statsdData.key = `redux.action.${statsdData.key}.error`
  //            console.log('statsd : ', statsdData.key)
  //            statsd(statsdData)
  //            return next(action)
  //          })
  //      }
  //      debugger
  //      statsdData.key = `redux.action.${statsdData.key}.success`
  //      console.log('statsd : ', statsdData.key)
  //    }
  //    return next(action)
  //  }

  return (next) => (action) => {
    const statsdData = action.statsd

    if (statsdData) {
      console.log('statsd data ', statsdData)
      try {
        statsdData.key = `redux.action.${statsdData.key}.success`
        console.log('statsd : ', statsdData.key)
        statsd(statsdData)
        return next(action)
      } catch (err) {
        statsdData.key = `redux.action.${statsdData.key}.error`
        console.log('statsd : ', statsdData.key)
        statsd(statsdData)
      }
    }
    next(action)
  }


}
