export function create (email) {
  return (dispatch, getState) => {
    return async api => ({
      type: 'whatever',
      res: await api({path: `/api/waitingUsers/`, method: 'POST', params: {email: email}})
    })
  }
}
