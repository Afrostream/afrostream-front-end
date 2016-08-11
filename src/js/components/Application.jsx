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
import * as UserActionCreators from '../actions/user'

if (process.env.BROWSER) {
  require('./Application.less')
}

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
