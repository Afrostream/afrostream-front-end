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
