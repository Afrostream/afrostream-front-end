/**
 *
 * @param track
 * @param select
 * based on https://github.com/markdalgleish/redux-analytics
 * const action = {
 * type: 'MY_ACTION',
 *  meta: {
 *   analytics: {
 *     type: 'my-analytics-event',
 *     payload: {
 *       some: 'data',
 *       more: 'stuff'
 *     }
 *   }
 * }
 *}
 */
export default (track, select = ({meta}) => meta.analytics) => store => next => action => {
  const returnValue = next(action)

  if (!action || !action.meta) {
    return returnValue
  }

  const event = select(action)

  if (!event) {
    return returnValue
  }

  track(event, store.getState())

  return returnValue
}
