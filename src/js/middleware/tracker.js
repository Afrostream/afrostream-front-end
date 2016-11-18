import { track } from '../lib/tracker'

export default function ({getState}) {
  return (next) => (action) => {

    const user = getState().User.get('user')

    track({
      type: 'redux',
      action: action.type,
      userId: user && user.get('_id')
    })

    return next(action)
  }
}
