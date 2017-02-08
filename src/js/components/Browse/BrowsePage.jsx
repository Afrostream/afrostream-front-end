import React from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as UserActionCreators from '../../actions/user'
import * as LifeActionCreators from '../../actions/life'

import SplashScreen from '../SplashScreen/SplashScreen'
import BrowseMenu from './BrowseMenu'
import SlideShow from '../SlideShow/SlideShow'
import MoviesList from '../Movies/MoviesList'
import BrowseLifeUsersList from './BrowseLifeUsersList'
import UserMoviesList from '../Movies/UserMoviesList'
import BrowsePinsList from './BrowsePinsList'
import LoginPage from '../Login/LoginPage'

@prepareRoute(async function ({store}) {
  await Promise.all([
    store.dispatch(EventActionCreators.userActive(true))
  ])
  store.dispatch(UserActionCreators.getFavorites('movies'))
  store.dispatch(UserActionCreators.getHistory())
  store.dispatch(LifeActionCreators.fetchPins({limit: 14}))
  store.dispatch(LifeActionCreators.fetchUsers({}))
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
          <SplashScreen key="splash-screens"/>,
          <SlideShow key="slide-show" gradient={true}/>,
          <UserMoviesList key="user-movies-list"/>,
          <BrowseLifeUsersList key="life-users-list"/>,
          <BrowsePinsList key="browse-pins-list"/>,
          <MoviesList key="movies-list"/>
        ]}
      </div>
    )
  }
}

export default BrowsePage
