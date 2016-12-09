import { track } from '../lib/tracker'
import analytics from '../lib/analytics'
export default analytics(({type, payload}, state) => {
  const user = state.User.get('user')
  const userId = user && user.get('_id')
  track(_.merge(
    payload,
    {
      type: 'redux',
      action: type,
      userId
    }
  ))
})
