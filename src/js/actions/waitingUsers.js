export function create (email) {
  return (dispatch, getState) => {
    return async api => ({
      type: 'whatever',
      res: await api(`/api/waitingUsers/`, 'POST', {email: email})
    })
  }
}
