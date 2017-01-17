import React from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as UserActionCreators from '../../actions/user'

import SplashScreen from '../SplashScreen/SplashScreen'
import BrowseMenu from './BrowseMenu'
import SlideShow from '../SlideShow/SlideShow'
import MoviesList from '../Movies/MoviesList'
import UserMoviesList from '../Movies/UserMoviesList'
import LoginPage from '../Login/LoginPage'

@prepareRoute(async function ({store}) {
  await Promise.all([
    store.dispatch(EventActionCreators.userActive(true))
  ])
  store.dispatch(UserActionCreators.getFavorites('movies'))
  store.dispatch(UserActionCreators.getHistory())
})
@connect(({User}) => ({User}))
class BrowsePage extends React.Component {
  render () {
    const {props: {User}} = this
    const user = User.get('user')
    const authorized = user && user.get('authorized')
    return (
      <div className="row-fluid">
        {!authorized && <LoginPage modalType="newsletter" closable={false} {...this.props}/>}
        {authorized && [
          <SplashScreen />,
          <BrowseMenu key="browse-menu"/>,
          <SlideShow key="slide-show"/>,
          <UserMoviesList key="user-movies-list" limit={5}/>,
          <MoviesList key="movies-list"/>
        ]}
      </div>
    )
  }
}

export default BrowsePage
