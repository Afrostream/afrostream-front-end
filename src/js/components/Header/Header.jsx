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

  toggleSideBar () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(EventActionCreators.toggleSideBar(false))
  }

  render () {

    const {
      props: {
        Event,
        User,
        router
      }
    } = this

    const hiddenMode = !Event.get('userActive')
    const chatMode = Event.get('showChat')
    const pinned = Event.get('pinHeader')
    const user = User.get('user')
    let excludedBreacrumbsRoutes = ['home', 'player', 'search', 'lang', 'pinId', 'movieId', 'seasonSlug', 'videoId']
    let planCode
    if (user) {
      planCode = user.get('planCode')
      excludedBreacrumbsRoutes.shift()
    }

    const isOnLife = router.isActive('life')

    let sliderClasses = {
      'topbar': true,
      'topbar-life': isOnLife,
      'topbar-hidden': !chatMode && hiddenMode && router.isActive('player'),
      'topbar-fixed-color': true
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
  history: React.PropTypes.object.isRequired
}

Header.defaultProps = {}

export default withRouter(Header)
