import React from 'react'
import { prepareRoute } from '../../decorators'
import * as UserActionCreators from '../../actions/user'
import FavoritesList from './FavoritesList'

@prepareRoute(async function ({store}) {
  await Promise.all([
    store.dispatch(UserActionCreators.getFavorites('movies')),
    store.dispatch(UserActionCreators.getFavorites('episodes'))
  ])
})
class BrowsePage extends React.Component {

  render () {
    return (
      <div className="row-fluid favorites-page">
        <FavoritesList />
      </div>
    )
  }
}

export default BrowsePage
