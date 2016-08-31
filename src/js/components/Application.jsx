import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import SideBar from './SideBar/SideBar'
import SplashScreen from './SplashScreen/SplashScreen'
import AlertMessage from './Alert/AlertMessage'
import ModalView from './Modal/ModalView'
import classNames from 'classnames'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { metasData, analytics, fbTracking, fbSDK } from '../decorators'
import { withRouter } from 'react-router'
import { prepareRoute } from '../decorators'

import * as BillingActionCreators from '../actions/billing'
import * as MovieActionCreators from '../actions/movie'
import * as SeasonActionCreators from '../actions/season'
import * as EpisodeActionCreators from '../actions/episode'
import * as UserActionCreators from '../actions/user'


if (process.env.BROWSER) {
  require('./Application.less')
}

@prepareRoute(async function ({store, location, params: {movieId, seasonId, episodeId, videoId}}) {

  if (movieId && movieId !== 'undefined') {
    await store.dispatch(MovieActionCreators.getMovie(movieId))
  }
  if (seasonId && seasonId !== 'undefined') {
    await store.dispatch(SeasonActionCreators.getSeason(seasonId))
  }

  if (episodeId && episodeId !== 'undefined') {
    await store.dispatch(EpisodeActionCreators.getEpisode(episodeId))
  }

})

@metasData()
@analytics()
@fbSDK()
@fbTracking()
@connect(({Event, User, Modal}) => ({Event, User, Modal}))
class Application extends React.Component {

  componentDidMount () {
    const {
      props: {
        dispatch
      }
    } = this
    if (canUseDOM) {
      require('chardin.js')
    }
    dispatch(UserActionCreators.getProfile())
  }

  render () {

    const {props: {children, Event, User, Modal}} = this
    const toggled = User.get('user') && Event.get('sideBarToggled')
    const hasPopup = Modal.get('target')

    let appClasses = classNames({
      'app': true,
      'toggled': toggled,
      'lock-open': hasPopup
    })

    return (
      <div className={appClasses}>
        <Header {...this.props}/>
        <SideBar />
        <SplashScreen />
        <AlertMessage />
        <div id="page-content-wrapper" className="container-fluid">
          {children}
          <Footer {...this.props}/>
        </div>
        <ModalView {...this.props}/>
      </div>
    )
  }
}

Application.propTypes = {
  location: React.PropTypes.object,
  history: React.PropTypes.object
}

export default withRouter(Application)
