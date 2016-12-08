import Q from 'q'
import _ from 'lodash'
import { statsd } from '../lib/tracker'

async function pomisifyStatsd (next, action) {
  return await Q(next(action))
    .then(
      (v) => {
        const statsdData = v.statsd
        if (statsdData) {
          statsdData.key = `redux.action.${statsdData.key}.success`
          console.log('statsd : ', statsdData.key)
          statsd(statsdData)
        }
        return next(v)
      },
      (err) => {
        throw err
      })
}

export default function (store) {

  return (next) => (action) => {
    Q(next(action))
      .then(
        (v) => {
          const statsdData = v.statsd
          console.log('statsd : ', action, statsdData)
          if (statsdData) {
            statsdData.key = `redux.action.${statsdData.key}.success`
            statsd(statsdData)
          }
          return next(v)
        },
        (err) => {
          console.log('statsd error : ', action)
          throw err
        })
  }

  return next =>
    async function _r (action) {
      const statsdData = action.statsd
      let resultAction

      try {
        if (action && _.isFunction(action.then)) {
          resultAction = await pomisifyStatsd(next, action.then)
        } else {
          resultAction = await pomisifyStatsd(next, action)
        }

        if (statsdData) {
          statsdData.key = `redux.action.${statsdData.key}.success`
          console.log('statsd : ', statsdData.key)
          statsd(statsdData)
        }

      } catch (err) {
        console.log('err action : ', err, action)
        if (statsdData) {
          statsdData.key = `redux.action.${statsdData.key}.error`
          console.log('statsd : ', statsdData.key)
          statsd(statsdData)
        }
      }


      console.log('action : ', action)
      console.log('resultAction : ', resultAction)


      return resultAction
    }


//return (next) => (action) => {
//  return Q(next(action))
//    .then(
//      (v) => {
//        const statsdData = v.statsd
//        if (statsdData) {
//          debugger
//          statsdData.key = `redux.action.${statsdData.key}.success`
//          console.log('statsd : ', statsdData.key)
//          statsd(statsdData)
//        }
//        return next(v)
//      },
//      (err) => {
//        const statsdData = action.statsd
//        debugger
//        if (statsdData) {
//          statsdData.key = `redux.action.${statsdData.key}.error`
//          console.log('statsd : ', statsdData.key)
//          statsd(statsdData)
//        }
//        throw err
//      })
}
