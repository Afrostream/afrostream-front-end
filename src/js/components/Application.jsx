import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import SideBar from './SideBar/SideBar'
import AlertMessage from './Alert/AlertMessage'
import FloatPlayer from './Player/FloatPlayer'

import ModalView from './Modal/ModalView'
import Snackbar from 'material-ui/Snackbar'
import classNames from 'classnames'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { metasData, analytics, fbTracking, fbSDK } from '../decorators'
import { withRouter } from 'react-router'
import { prepareRoute } from '../decorators'
import injectTapEventPlugin from 'react-tap-event-plugin'


import * as EventActionCreator from '../actions/event'
import * as LifeActionCreators from '../actions/life'
import * as CategoryActionCreators from '../actions/category'
import * as MovieActionCreators from '../actions/movie'
import * as SeasonActionCreators from '../actions/season'
import * as EpisodeActionCreators from '../actions/episode'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import {
  intlShape,
  injectIntl
} from 'react-intl'

import {
  red500,
  grey200,
  grey400,
  grey600,
  grey900,
  purple600,
  purple700,
  purple800,
  purple900,
  red400
} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { ScrollContainer } from 'react-router-scroll'

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

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

if (process.env.BROWSER) {
  require('./Application.less')
}

@prepareRoute(async function ({store, params: {movieId, seasonId, episodeId}}) {

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
@connect(({Event, User, Modal, Config, GA}) => ({Event, User, Modal, Config, GA}))
class Application extends React.Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {

    const {
      props: {
        location,
        router,
        dispatch,
        children,
        Event,
        GA,
        Modal,
        User,
        intl
      }
    } = this
    const isOnLife = router.isActive('life')
    const isMobile = Event.get('isMobile')
    const user = User.get('user')
    const docked = false//Boolean(!isMobile && (isOnLife || user))
    const toggled = Event.get('sideBarToggled')
    const snackMessage = Event.get('snackMessage')
    const hasPopup = Modal.get('target')
    const {query} = location

    const abColor = GA.get('variations').find(variation => {
      return variation.get('name') === 'countdownColors' && variation.get('choose') === 1
    })

    let appClasses = classNames({
      'app': true,
      'lock-open': hasPopup,
      'ab-color': abColor
    })

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={appClasses}>
          <AlertMessage />
          <Header {...this.props}/>
          <SideBar {...{toggled, docked}} {...this.props}>
            <div id="page-content-wrapper" className="container-fluid">
              {children}
              <Footer {...this.props} />
            </div>
          </SideBar>
          <FloatPlayer {...this.props}/>
          <ModalView {...this.props}/>
          {snackMessage && snackMessage.size && <Snackbar
            contentStyle={{color: '#FFFFFF'}}
            bodyStyle={{
              backgroundColor: snackMessage.get('type') === 'error' ? red400 : '#3498db'
            }}
            open={Boolean(snackMessage)}
            message={intl.formatMessage({id: snackMessage.get('message')})}
            autoHideDuration={4000}
            onRequestClose={
              (e) => {
                dispatch(EventActionCreator.snackMessage(null))
              }
            }
          />}
        </div>
      </MuiThemeProvider>
    )
  }
}

Application.propTypes = {
  intl: intlShape.isRequired,
  location: React.PropTypes.object,
  history: React.PropTypes.object
}

export default withRouter(injectIntl(Application))
