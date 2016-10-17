import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import SideBar from './SideBar/SideBar'
import SplashScreen from './SplashScreen/SplashScreen'
import AlertMessage from './Alert/AlertMessage'
import FloatPlayer from './Player/FloatPlayer'
import ModalView from './Modal/ModalView'
import classNames from 'classnames'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { metasData, analytics, fbTracking, fbSDK } from '../decorators'
import { withRouter } from 'react-router'
import { prepareRoute } from '../decorators'
import window from 'global/window'
import MobileDetect from 'mobile-detect'

import * as CategoryActionCreators from '../actions/category'
import * as MovieActionCreators from '../actions/movie'
import * as SeasonActionCreators from '../actions/season'
import * as EpisodeActionCreators from '../actions/episode'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {
  red500,
  grey200,
  grey400,
  grey600,
  grey900,
  purple600,
  purple700,
  purple800,
  purple900
} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
  palette: {
    textColor: grey900,
    secondaryTextColor: grey600,
    disabledColor: grey600,
    alternateTextColor: grey400,
    primary1Color: purple600,
    primary2Color: purple700,
    primary3Color: grey200,
    accent1Color: red500
  }
})


if (process.env.BROWSER) {
  require('./Application.less')
}

@prepareRoute(async function ({store, params: {movieId, seasonId, episodeId}}) {

  await store.dispatch(CategoryActionCreators.getMenu())

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

  constructor (props) {
    super(props)
    this.state = {
      isMobile: true
    }
  }

  componentDidMount () {
    const userAgent = (window.navigator && navigator.userAgent) || ''
    let agent = new MobileDetect(userAgent)

    this.setState({
      isMobile: agent.mobile()
    })
  }

  render () {

    const {props: {children, Event, Modal}} = this
    const toggled = canUseDOM && Event.get('sideBarToggled')
    const hasPopup = Modal.get('target')

    let appClasses = classNames({
      'app': true,
      'toggled': toggled,
      'lock-open': hasPopup
    })

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={appClasses}>
          <Header {...this.props}/>
          <SideBar {...{toggled}} {...this.props}/>
          <SplashScreen />
          <AlertMessage />
          <div id="page-content-wrapper" className="container-fluid">
            {children}
            <Footer {...this.props}/>
          </div>
          <FloatPlayer {...this.props}/>
          <ModalView {...this.props}/>
        </div>
      </MuiThemeProvider>
    )
  }
}

Application.propTypes = {
  location: React.PropTypes.object,
  history: React.PropTypes.object
}

export default withRouter(Application)
