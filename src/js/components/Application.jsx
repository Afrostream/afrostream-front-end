import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import SideBar from './SideBar/SideBar'
import AlertMessage from './Alert/AlertMessage'
import ModalView from './Modal/ModalView'
import classNames from 'classnames'
import { metasData, analytics } from '../decorators'

if (process.env.BROWSER) {
  require('./Application.less')
}

@metasData()
@analytics()
@connect(({Event, User, Modal}) => ({Event, User, Modal}))
class Application extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  componentDidMount () {
    require('chardin.js')
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

export default Application
