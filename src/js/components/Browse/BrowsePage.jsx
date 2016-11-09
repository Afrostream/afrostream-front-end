import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as UserActionCreators from '../../actions/user'
import * as CategoryActionCreators from '../../actions/category'

import BrowseMenu from './BrowseMenu'
import SlideShow from '../SlideShow/SlideShow'
import MoviesList from '../Movies/MoviesList'
import UserMoviesList from '../Movies/UserMoviesList'

@prepareRoute(async function ({store}) {
  await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(EventActionCreators.userActive(true))
  ])

  store.dispatch(UserActionCreators.getFavorites('movies'))
  store.dispatch(UserActionCreators.getHistory())
})
class BrowsePage extends React.Component {

  render () {
    return (
      <div className="row-fluid">
        <BrowseMenu />
        <SlideShow />
        <UserMoviesList />
        <MoviesList />
      </div>
    )
  }
}

export default BrowsePage
