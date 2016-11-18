import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Headroom from 'react-headrooms'
import UserButton from './../User/UserButton'
import SmartBanner from './SmartBanner'
import SearchInput from './../Search/SearchBox'
import classSet from 'classnames'
import config from '../../../../config'
import { withRouter } from 'react-router'
import window from 'global/window'
import * as EventActionCreators from '../../actions/event'
import Breadcrumbs from './Breadcrumbs'
const {apps} = config

if (process.env.BROWSER) {
  require('./Header.less')
}

@connect(({Event, User}) => ({Event, User}))
class Header extends React.Component {

  state = {
    pinned: this.props.pinned,
    isIOS: false
  }

  componentDidMount () {
    window.addEventListener('scroll', this.updatePin.bind(this))
    this.setState({
      isIOS: window.navigator.userAgent.match(/(iPod|iPhone|iPad)/i)
    })
    this.updatePin()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.updatePin.bind(this))
  }

  toggleSideBar () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(EventActionCreators.toggleSideBar(false))
  }

  updatePin () {
    let pin = window.pageYOffset
    if (pin !== this.state.pinned) {
      this.setState({
        pinned: !!(pin)
      })
    }
  }

  render () {

    const {
      props: {
        Event,
        User,
        router,
        location
      }
    } = this

    const hiddenMode = !Event.get('userActive')
    const chatMode = Event.get('showChat')
    const pinned = Event.get('pinHeader')
    const user = User.get('user')
    let excludedBreacrumbsRoutes = ['home', 'player', 'search', 'pin', 'seasonSlug']
    let planCode
    if (user) {
      planCode = user.get('planCode')
      excludedBreacrumbsRoutes.shift()
    }

    //let hasHistory = !this.state.isIOS && user && (location.pathname.length > 1)

    const isOnLife = router.isActive('life')

    let sliderClasses = {
      'topbar': true,
      'topbar-life': isOnLife,
      'topbar-hidden': !chatMode && hiddenMode && router.isActive('player'),
      'topbar-fixed-color': true
      //'topbar-fixed-color': chatMode || pinned || this.state.pinned
      //|| router.isActive('recherche')
      //|| router.isActive('player')
      //|| router.isActive('compte')
      //|| router.isActive('couponregister')
      //|| router.isActive('parrainage')
    }


    return (
      <Headroom tolerance={5} offset={200} classes={{
        initial: 'animated',
        pinned: 'slideDown',
        unpinned: 'slideUp'
      }}>

        <header className={classSet(sliderClasses)}>
          {/*{planCode && <SmartBanner {...apps.params}/>}*/}
          <nav className="float--left" role="navigation">
            <ul className="nav">
              <li>
                <button role="button" className="btn-home" onClick={::this.toggleSideBar}>
                  <i className="open-menu-icon zmdi zmdi-menu"/>
                  <img src={`/images/logo.png`} alt="afrostream-logo" className="logo"/>
                </button>
              </li>
              {user && <li>
                <SearchInput/>
              </li>}


            </ul>
          </nav>
          <nav className="float--left float-bottom-mobile" role="navigation">
            <Breadcrumbs
              {...this.context}
              {...this.props}
              excludes={excludedBreacrumbsRoutes}
              displayMissingText="Accueil"
              hideNoPath={true}
              displayMissing={false}
              setDocumentTitle={false}
              wrapperClass="nav breadcrumbs"
              itemClass="step"
              wrapperElement="ul"
              activeItemClass="active"
              itemElement="li"/>
          </nav>
          <nav className="float--right" role="navigation">
            <UserButton {...this.props}/>
          </nav>
        </header>
      </Headroom>
    )
  }
}

Header.propTypes = {
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired,
  pinned: React.PropTypes.bool
}

Header.defaultProps = {
  pinned: false
}

export default withRouter(Header)
